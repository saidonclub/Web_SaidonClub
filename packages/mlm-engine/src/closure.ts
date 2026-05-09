import { prisma, Prisma } from '@saidonclub/database';
import { config } from '@saidonclub/config-engine';
import { evaluateRank } from './ranks';
import { refreshAllVolumesCache } from './genealogy';

/**
 * Ejecuta el cierre semanal completo con arquitectura de alto rendimiento.
 * Optimizado para manejar miles de usuarios mediante SQL masivo y batching.
 */
export async function executeWeeklyClosure(closureDate: Date): Promise<void> {
  const enabled = await config.get<boolean>('closure_enabled', true);
  if (!enabled) {
    console.log('[CLOSURE] Cierre semanal desactivado por configuración.');
    return;
  }

  const closure = await prisma.weeklyClosure.create({
    data: {
      closureDate,
      status: 'DETECTING',
      totalCommissions: 0,
      totalSeedBonus: 0,
      totalPaid: 0,
      detectionStarted: new Date(),
    },
  });

  console.log(`[CLOSURE] Iniciando cierre ${closure.id} (Modo Enterprise)`);

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // ============================================================
    // FASE 1: ACTIVACIONES (SQL Masivo - O(1) Transaction)
    // ============================================================
    console.log('[CLOSURE] Fase 1: Recalculando activaciones en lote...');
    const rollingDays = await config.get<number>('mlm_activation_rolling_days', 30);
    const minPoints = await config.get<number>('mlm_activation_min_points', 50);
    const rollingSince = new Date();
    rollingSince.setDate(rollingSince.getDate() - rollingDays);

    // SQL Masivo para actualizar estados de activación
    await prisma.$executeRawUnsafe(`
      INSERT INTO activation_status (id, user_id, is_active, points_30d, last_checked, activation_type, "updatedAt")
      SELECT 
        gen_random_uuid(),
        u.id,
        COALESCE(sub.total, 0) >= $1 OR EXISTS (SELECT 1 FROM memberships m WHERE m.user_id = u.id),
        COALESCE(sub.total, 0),
        NOW(),
        'POINTS',
        NOW()
      FROM users u
      LEFT JOIN (
        SELECT user_id, SUM(amount) as total
        FROM points_ledger
        WHERE "createdAt" >= $2
        GROUP BY user_id
      ) as sub ON sub.user_id = u.id
      ON CONFLICT (user_id) DO UPDATE SET
        is_active = EXCLUDED.is_active,
        points_30d = EXCLUDED.points_30d,
        last_checked = EXCLUDED.last_checked,
        "updatedAt" = EXCLUDED."updatedAt";
    `, minPoints, rollingSince);

    // ============================================================
    // FASE 2: REFRESCAR CACHÉ DE VOLUMEN (Recursive CTE masivo)
    // ============================================================
    console.log('[CLOSURE] Fase 2: Refrescando caché de volúmenes organizacionales...');
    await refreshAllVolumesCache(currentMonth, currentYear);

    // ============================================================
    // FASE 3: EVALUACIÓN DE RANGOS (Batch Processing)
    // ============================================================
    console.log('[CLOSURE] Fase 3: Evaluando rangos con caché O(1)...');
    
    // PRE-FETCH Rank requirements once for all users
    const { RANK_HIERARCHY } = await import('./ranks');
    const rankRequirements = await Promise.all(
      RANK_HIERARCHY.map(async (r) => ({
        ...r,
        points: await config.get<number>(r.pointsKey, Infinity),
        bonus: await config.get<number>(r.bonusKey, 0),
      }))
    );

    const batchSize = 100;
    const pioneers = await prisma.user.findMany({
      where: { role: 'PIONERO' },
      select: { id: true },
    });

    for (let i = 0; i < pioneers.length; i += batchSize) {
      const batch = pioneers.slice(i, i + batchSize);
      const batchUserIds = batch.map((u) => u.id);

      // 1. Pre-fetch all volumes for this batch in one query
      const allCachedVolumes = await prisma.volumeCache.findMany({
        where: {
          userId: { in: batchUserIds },
          cycleMonth: currentMonth,
          cycleYear: currentYear,
        },
      });

      const volumeMap: Record<string, number[]> = {};
      allCachedVolumes.forEach((v) => {
        if (!volumeMap[v.userId]) volumeMap[v.userId] = [];
        volumeMap[v.userId].push(Number(v.volume));
      });

      // 2. Evaluate all ranks OUTSIDE the transaction
      const evaluationResults: any[] = [];
      for (const user of batch) {
        const rankResult = await evaluateRank(
          user.id,
          currentMonth,
          currentYear,
          rankRequirements,
          volumeMap
        );
        if (rankResult) {
          evaluationResults.push(rankResult);
        }
      }

      // 3. Persist results in a clean, fast transaction
      if (evaluationResults.length > 0) {
        await prisma.$transaction(
          async (tx) => {
            for (const rankResult of evaluationResults) {
              await tx.rank.upsert({
                where: {
                  userId_cycleMonth_cycleYear: {
                    userId: rankResult.userId,
                    cycleMonth: currentMonth,
                    cycleYear: currentYear,
                  }
                },
                update: {
                  rankName: rankResult.achievedRank as any,
                  requiredPoints: rankResult.cappedVolume,
                  monthlyBonus: rankResult.bonusAmount,
                  achievedDate: new Date(),
                },
                create: {
                  userId: rankResult.userId,
                  rankName: rankResult.achievedRank as any,
                  requiredPoints: rankResult.cappedVolume,
                  monthlyBonus: rankResult.bonusAmount,
                  cycleMonth: currentMonth,
                  cycleYear: currentYear,
                  achievedDate: new Date(),
                },
              });

              if (rankResult.bonusAmount > 0) {
                await tx.commission.upsert({
                  where: {
                    orderId: `RANK-${currentYear}-${currentMonth}-${rankResult.userId}`
                  },
                  update: {
                    amount: rankResult.bonusAmount,
                  },
                  create: {
                    userId: rankResult.userId,
                    orderId: `RANK-${currentYear}-${currentMonth}-${rankResult.userId}`,
                    type: 'RANK_BONUS',
                    amount: rankResult.bonusAmount,
                    pointsValue: 0,
                    cycleMonth: currentMonth,
                    cycleYear: currentYear,
                    status: 'PENDING',
                  },
                });
              }
            }
          },
          {
            timeout: 30000, // 30 seconds
          }
        );
      }
      console.log(`[CLOSURE] Procesados ${Math.min(i + batchSize, pioneers.length)} / ${pioneers.length} pioneros`);
    }

    // ============================================================
    // FASE 4: VALIDACIÓN Y MOVIMIENTO DE FONDOS (High Performance)
    // ============================================================
    console.log('[CLOSURE] Fase 4: Validando comisiones y actualizando balances masivamente...');
    
    // 1. Validar todas las comisiones masivamente
    await prisma.$executeRaw`UPDATE commissions SET status = 'VALIDATED' WHERE status = 'PENDING'`;

    // 2. Mover fondos de Pending a Validated en una sola operación atómica de base de datos
    // Esto evita el timeout de Prisma al procesar miles de wallets una por una.
    await prisma.$executeRaw`
      WITH updated_tx AS (
        UPDATE wallet_transactions 
        SET status = 'VALIDATED' 
        WHERE status = 'PENDING'
        RETURNING wallet_id, amount
      )
      UPDATE wallets 
      SET 
        balance_validated = balance_validated + sub.total,
        balance_pending = balance_pending - sub.total
      FROM (
        SELECT wallet_id, SUM(amount) as total 
        FROM updated_tx 
        GROUP BY wallet_id
      ) sub
      WHERE wallets.id = sub.wallet_id
    `;

    await prisma.weeklyClosure.update({
      where: { id: closure.id },
      data: {
        status: 'PROCESSED',
        validationEnded: new Date(),
      },
    });

    console.log(`[CLOSURE] Cierre ${closure.id} completado exitosamente.`);
  } catch (error) {
    await prisma.weeklyClosure.update({
      where: { id: closure.id },
      data: { status: 'PAUSED' },
    });
    console.error(`[CLOSURE] Error crítico en cierre ${closure.id}:`, error);
    throw error;
  }
}
