import { prisma, Prisma } from '@saidonclub/database';
import { config } from '@saidonclub/config-engine';
import { evaluateRank, RankEvaluation } from './ranks';
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

  // Check for in-progress closures to avoid race conditions in multi-node environments
  const inProgress = await prisma.weeklyClosure.findFirst({
    where: { status: { in: ['DETECTING', 'VALIDATING'] } }
  });

  if (inProgress) {
    console.log(`[CLOSURE] Ya hay un cierre en curso (${inProgress.id}). Abortando.`);
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
  
  let totalCommissionsAcc = 0;

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: NodeNext requires .js ext but webpack resolves without it
    const { RANK_HIERARCHY } = await import('./ranks');
    const rankRequirements = await Promise.all(
      RANK_HIERARCHY.map(async (r: (typeof RANK_HIERARCHY)[number]) => ({
        ...r,
        points: await config.get<number>(r.pointsKey, Infinity),
        bonus: await config.get<number>(r.bonusKey, 0),
      }))
    );
    const batchSize = 100; // Aumentado para mayor eficiencia dado que ahora es O(1) batching
    const pioneers = await prisma.user.findMany({
      where: { role: 'PIONERO' },
      select: { id: true },
    });

    const ranksEnabled = await config.get<boolean>('mlm_ranks_enabled', true);
    const rule35Enabled = await config.get<boolean>('mlm_rank_35_rule_enabled', true);

    // Update status to PROCESSING and set detectionEnded
    await prisma.weeklyClosure.update({
      where: { id: closure.id },
      data: { 
        status: 'PROCESSING',
        detectionEnded: new Date()
      }
    });

    for (let i = 0; i < pioneers.length; i += batchSize) {
      const batch = pioneers.slice(i, i + batchSize);
      console.log(`[CLOSURE] Procesando lote ${i / batchSize + 1} (${batch.length} usuarios)...`);

      const batchUserIds = batch.map((u: { id: string }) => u.id);

      // 1. Pre-fetch ALL required data for this batch in parallel
      const [allCachedVolumes, existingCommissions, existingWallets] = await Promise.all([
        prisma.volumeCache.findMany({
          where: {
            userId: { in: batchUserIds },
            cycleMonth: currentMonth,
            cycleYear: currentYear,
          },
        }),
        prisma.commission.findMany({
          where: {
            userId: { in: batchUserIds },
            type: 'RANK_BONUS',
            cycleMonth: currentMonth,
            cycleYear: currentYear,
          }
        }),
        prisma.wallet.findMany({
          where: { userId: { in: batchUserIds } }
        })
      ]);

      const volumeMap: Record<string, number[]> = {};
      allCachedVolumes.forEach((v: { userId: string; volume: { toString(): string } | number | bigint }) => {
        if (!volumeMap[v.userId]) volumeMap[v.userId] = [];
        volumeMap[v.userId].push(Number(v.volume));
      });

      const commissionMap = new Map<string, { userId: string; id: string }>(
        existingCommissions.map((c: { userId: string; id: string }) => [c.userId, c])
      );
      const walletMap = new Map<string, { userId: string; id: string }>(
        existingWallets.map((w: { userId: string; id: string }) => [w.userId, w])
      );

      // Pre-fetch transactions for these wallets that match the criteria
      const walletIds = existingWallets.map((w: { id: string }) => w.id);
      const existingTransactions = await prisma.walletTransaction.findMany({
        where: {
          walletId: { in: walletIds },
          type: 'RANK_BONUS',
          metadata: {
            path: ['source'],
            equals: 'RANK_BONUS'
          }
        }
      });
      
      // Map transactions by their commissionId (stored in metadata)
      const transactionMap = new Map<string, { id: string; amount: { toString(): string } | number }>();
      existingTransactions.forEach((tx: { metadata: unknown; id: string; amount: { toString(): string } | number }) => {
        const metadata = tx.metadata as Record<string, unknown>;
        if (metadata && metadata['commissionId']) {
          transactionMap.set(metadata['commissionId'] as string, tx);
        }
      });

      // 2. Evaluate all ranks OUTSIDE the transaction in parallel (CPU intensive but non-blocking)
      const evaluationResults = (await Promise.all(
        batch.map((user: { id: string }) =>
          evaluateRank(
            user.id,
            currentMonth,
            currentYear,
            rankRequirements,
            volumeMap,
            ranksEnabled,
            rule35Enabled
          )
        )
      )).filter((res: RankEvaluation | null): res is RankEvaluation => res !== null);

      // Accumulate commissions for final report
      evaluationResults.forEach((res: RankEvaluation) => {
        totalCommissionsAcc += res.bonusAmount;
      });

      // 3. Persist results in a clean, fast transaction
      if (evaluationResults.length > 0) {
        await prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            for (const rankResult of evaluationResults) {
              if (!rankResult) continue;
              // UPSERT RANK
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
                // UPSERT COMMISSION
                const existingComm = commissionMap.get(rankResult.userId);
                type CommRecord = { id: string };
                let comm: CommRecord;
                if (existingComm) {
                  comm = await tx.commission.update({
                    where: { id: existingComm.id },
                    data: { 
                      amount: rankResult.bonusAmount,
                      status: 'PENDING'
                    }
                  }) as CommRecord;
                } else {
                  comm = await tx.commission.create({
                    data: {
                      userId: rankResult.userId,
                      type: 'RANK_BONUS',
                      amount: rankResult.bonusAmount,
                      pointsValue: 0,
                      cycleMonth: currentMonth,
                      cycleYear: currentYear,
                      status: 'PENDING',
                    },
                  }) as CommRecord;
                }

                // UPSERT WALLET (Ensure exists)
                type WalletRecord = { id: string };
                let wallet = walletMap.get(rankResult.userId) as WalletRecord | undefined;
                if (!wallet) {
                  wallet = await tx.wallet.create({
                    data: {
                      userId: rankResult.userId,
                      balancePending: 0,
                      balanceAvailable: 0,
                      balanceValidated: 0,
                    }
                  }) as WalletRecord;
                }

                // IDEMPOTENT TRANSACTION
                const existingTx = transactionMap.get(comm.id);

                if (!existingTx) {
                  await tx.wallet.update({
                    where: { id: wallet.id },
                    data: {
                      balancePending: { increment: rankResult.bonusAmount },
                      totalEarned: { increment: rankResult.bonusAmount }
                    }
                  });

                  await tx.walletTransaction.create({
                    data: {
                      walletId: wallet.id,
                      type: 'RANK_BONUS',
                      amount: rankResult.bonusAmount,
                      status: 'PENDING',
                      description: `Bono de Rango - ${rankResult.achievedRank} - Ciclo ${currentMonth}/${currentYear}`,
                      metadata: {
                        commissionId: comm.id,
                        rankName: rankResult.achievedRank,
                        source: 'RANK_BONUS'
                      }
                    }
                  });
                } else if (Number(existingTx.amount) !== rankResult.bonusAmount) {
                  const diff = rankResult.bonusAmount - Number(existingTx.amount);
                  await tx.wallet.update({
                    where: { id: wallet.id },
                    data: {
                      balancePending: { increment: diff },
                      totalEarned: { increment: diff }
                    }
                  });
                  
                  await tx.walletTransaction.update({
                    where: { id: existingTx.id },
                    data: { amount: rankResult.bonusAmount }
                  });
                }
              }
            }
          },
          { timeout: 300000 }
        );
      }
    }

    // Update closure with total commissions calculated
    await prisma.weeklyClosure.update({
      where: { id: closure.id },
      data: { totalCommissions: totalCommissionsAcc },
    });
    
    // ============================================================
    // FASE 4: VALIDACIÓN Y MOVIMIENTO DE FONDOS (High Performance)
    // ============================================================
    await prisma.weeklyClosure.update({
      where: { id: closure.id },
      data: { 
        status: 'VALIDATING',
        validationStarted: new Date()
      }
    });

    console.log('[CLOSURE] Fase 4: Validando y liberando fondos...');
    
    // 1. Validar todas las comisiones masivamente
    // 1. Validar todas las comisiones masivamente y obtener totales por tipo
    const commTotals = await prisma.$queryRawUnsafe<any[]>(`
      WITH updated_comm AS (
        UPDATE commissions SET status = 'VALIDATED' WHERE status = 'PENDING' RETURNING type, amount
      )
      SELECT type, SUM(amount) as total FROM updated_comm GROUP BY type;
    `);

    let totalSeedBonus = 0;
    commTotals.forEach((c: { type: string; total: unknown }) => {
      if (c.type === 'SEED_BONUS') totalSeedBonus = Number(c.total) || 0;
    });

    // Update closure with Seed Bonus info
    await prisma.weeklyClosure.update({
      where: { id: closure.id },
      data: { totalSeedBonus }
    });

    // 2. Mover fondos de Pending a Validated en una sola operación atómica de base de datos
    // Capturar el total pagado en el proceso
    const paidResult = await prisma.$queryRawUnsafe<any[]>(`
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
      RETURNING (SELECT SUM(total) FROM (SELECT SUM(amount) as total FROM updated_tx GROUP BY wallet_id) s) as total_paid;
    `);

    const totalPaid = Number(paidResult[0]?.total_paid) || 0;

    await prisma.weeklyClosure.update({
      where: { id: closure.id },
      data: {
        status: 'PROCESSED',
        validationEnded: new Date(),
        totalPaid: totalPaid
      },
    });

    console.log(`[CLOSURE] Cierre ${closure.id} completado exitosamente. Total pagado: $${totalPaid}`);
  } catch (error) {
    await prisma.weeklyClosure.update({
      where: { id: closure.id },
      data: { status: 'PAUSED' },
    });
    console.error(`[CLOSURE] Error crítico en cierre ${closure.id}:`, error);
    throw error;
  }
}
