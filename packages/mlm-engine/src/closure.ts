// ============================================================
// MODULE:     mlm-engine/closure
// AGENT:      MLM/Math Engineer
// PURPOSE:    Cierre Semanal Automático. Ejecutado por cron job
//             (Supabase Edge Function) cada viernes 5pm Ecuador.
//
// FASES:
//   1. DETECTING: Crear registro + verificar fondos y fraudes.
//   2. VALIDATING: Recalcular activaciones rolling 30 días.
//   3. RANK_EVALUATION: Evaluar rangos mensuales con regla 35%.
//   4. DISTRIBUTION: Mover comisiones PENDING → VALIDATED.
//   5. PROCESSED: Marcar cierre como completado.
//
// REGLA DE ORO: Todo dentro de prisma.$transaction().
//               Si falla cualquier fase, rollback total y marca PAUSED.
// ============================================================

import { prisma, Prisma } from '@saidonclub/database';
import { config } from '@saidonclub/config-engine';
import { evaluateRank } from './ranks';

/**
 * Ejecuta el cierre semanal completo de forma atómica (ACID).
 * Se llama desde la Edge Function de Supabase cada viernes a las 17:00 (Ecuador).
 */
export async function executeWeeklyClosure(closureDate: Date): Promise<void> {
  const enabled = await config.get<boolean>('closure_enabled', true);
  if (!enabled) {
    console.log('[CLOSURE] Cierre semanal desactivado por configuración.');
    return;
  }

  // Crear registro de cierre en estado inicial
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

  console.log(`[CLOSURE] Iniciando cierre ${closure.id} para ${closureDate.toISOString()}`);

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // ================================================
      // FASE 1: RECALCULAR ACTIVACIONES (rolling 30 días)
      // ================================================
      const rollingDays = await config.get<number>('mlm_activation_rolling_days', 30);
      const minPoints = await config.get<number>('mlm_activation_min_points', 50);

      const pioneers = await tx.user.findMany({
        where: { role: 'PIONERO' },
        include: { activation: true, pointsLedger: true, membership: true },
      });

      for (const user of pioneers) {
        const since = new Date();
        since.setDate(since.getDate() - rollingDays);

        const points30d = user.pointsLedger
          .filter((p: { createdAt: Date }) => new Date(p.createdAt) >= since)
          .reduce((sum: number, p: { amount: { toNumber: () => number } }) => sum + p.amount.toNumber(), 0);

        // Activo si tiene suficientes puntos rolling O si tiene membresía activa
        const isActive = points30d >= minPoints || !!user.membership;

        await tx.activationStatus.upsert({
          where: { userId: user.id },
          update: { isActive, points30d, lastChecked: new Date() },
          create: {
            userId: user.id,
            isActive,
            activationType: 'POINTS',
            points30d,
            lastChecked: new Date(),
          },
        });
      }

      // ================================================
      // FASE 2: EVALUAR RANGOS MENSUALES
      // ================================================
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      for (const user of pioneers) {
        const rankResult = await evaluateRank(user.id, currentMonth, currentYear);
        if (rankResult) {
          await tx.rank.create({
            data: {
              userId: user.id,
              rankName: rankResult.achievedRank as any,
              requiredPoints: rankResult.cappedVolume,
              monthlyBonus: rankResult.bonusAmount,
              cycleMonth: currentMonth,
              cycleYear: currentYear,
              achievedDate: new Date(),
            },
          });

          // Crear comisión de rango si el bono es > 0
          if (rankResult.bonusAmount > 0) {
            await tx.commission.create({
              data: {
                userId: user.id,
                // Pseudo-orderId para trazabilidad de bonos de rango
                orderId: `RANK-${closure.id}-${user.id}`,
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
      }

      // ================================================
      // FASE 3: MOVER COMISIONES PENDING → VALIDATED
      // ================================================
      await tx.commission.updateMany({
        where: { status: 'PENDING' },
        data: { status: 'VALIDATED' },
      });

      await tx.walletTransaction.updateMany({
        where: { status: 'PENDING' },
        data: { status: 'VALIDATED' },
      });

      // Actualizar balances de wallets
      const validatedTxs = await tx.walletTransaction.groupBy({
        by: ['walletId'],
        where: { status: 'VALIDATED' },
        _sum: { amount: true },
      });

      for (const group of validatedTxs) {
        if (!group._sum.amount) continue;
        await tx.wallet.update({
          where: { id: group.walletId },
          data: {
            balanceValidated: { increment: group._sum.amount },
            balancePending: { decrement: group._sum.amount },
          },
        });
      }

      // ================================================
      // FASE 4: MARCAR CIERRE COMO PROCESADO
      // ================================================
      await tx.weeklyClosure.update({
        where: { id: closure.id },
        data: {
          status: 'PROCESSED',
          validationEnded: new Date(),
        },
      });
    });

    console.log(`[CLOSURE] Cierre ${closure.id} completado exitosamente.`);
  } catch (error) {
    // La transacción hace rollback automático
    // Marcamos el cierre como PAUSED para revisión manual
    await prisma.weeklyClosure.update({
      where: { id: closure.id },
      data: { status: 'PAUSED' },
    });
    console.error(`[CLOSURE] Error en cierre ${closure.id}:`, error);
    throw error; // Re-lanzar para que el cron job lo registre
  }
}
