// ============================================================
// MODULE:     mlm-engine/seed-bonus
// AGENT:      MLM/Math Engineer
// PURPOSE:    Bono Semilla: Se paga por CADA compra de membresía.
//             Fondo independiente del marketplace. NO genera puntos.
//
// TABLA DE PAGOS (configurable desde SystemConfig):
//   Preferente N1: $10  | Pionero N1: $43  | Upgrade N1: $33
//   Pionero N2-8: $1 c/u | Upgrade N2-8: $1 c/u
//   Preferente NO paga niveles 2-8
// ============================================================

import { prisma, Prisma } from '@saidonclub/database';
import { config } from '@saidonclub/config-engine';
import { getGenealogyTree } from './genealogy';

export interface SeedBonusCommission {
  userId: string;
  purchaserId: string;
  membershipType: string;
  level: number;
  amount: number;
}

/**
 * Calcula los bonos semilla para una compra de membresía.
 * Recorre el árbol genealógico hasta 8 niveles y distribuye
 * según el tipo de membresía comprada.
 *
 * @param purchaserId - El usuario que compró la membresía
 * @param membershipType - Tipo de membresía: PREFERENTE o PIONERO
 * @param isUpgrade - Si es un upgrade desde otra membresía
 * @param tx - Transacción de Prisma
 */
export async function calculateSeedBonus(
  purchaserId: string,
  membershipType: 'PREFERENTE' | 'PIONERO',
  isUpgrade: boolean = false,
  tx: Prisma.TransactionClient = prisma
): Promise<SeedBonusCommission[]> {
  const enabled = await config.get<boolean>('mlm_seed_bonus_enabled', true);
  if (!enabled) return [];

  // Verificar fondos en MEMBERSHIP reserve antes de calcular
  const reserve = await tx.fundsReserve.findFirst({
    where: { fundType: 'MEMBERSHIP' },
  });
  if (!reserve || Number(reserve.availableAmount) <= 0) {
    throw new Error(`Fondos MEMBERSHIP insuficientes para bono semilla`);
  }

  const tree = await getGenealogyTree(purchaserId, 8);
  const commissions: SeedBonusCommission[] = [];
  let totalCalculated = 0;

  for (const node of tree) {
    let amount = 0;

    if (node.level === 1) {
      // Nivel 1: montos variables según tipo de membresía
      if (membershipType === 'PREFERENTE') {
        amount = await config.get<number>('mlm_seed_preferente_n1', 10);
      } else if (membershipType === 'PIONERO') {
        // Si es upgrade, usa el bonus de upgrade N1, si no el normal de pionero
        amount = isUpgrade
          ? await config.get<number>('mlm_seed_upgrade_n1', 33)
          : await config.get<number>('mlm_seed_pionero_n1', 43);
      }
    } else if (node.level >= 2 && node.level <= 8) {
      // Niveles 2-8: Pionero y Upgrade pagan $1 por nivel
      if (membershipType === 'PIONERO') {
        amount = await config.get<number>('mlm_seed_pionero_n2_8', 1);
      }
      // Preferente NO paga niveles 2-8 (por diseño del plan)
    }

    if (amount > 0) {
      const amountFixed = parseFloat(amount.toFixed(2));
      commissions.push({
        userId: node.userId,
        purchaserId,
        membershipType,
        level: node.level,
        amount: amountFixed,
      });
      totalCalculated += amountFixed;

      // Ensure we don't exceed available funds in the reserve
      if (totalCalculated > Number(reserve.availableAmount)) {
         console.warn(`[SEED BONUS] Fondos insuficientes para completar todo el árbol. Deteniendo.`);
         break;
      }

      await tx.seedBonus.create({
        data: {
          userId: node.userId,
          membershipPurchaserId: purchaserId,
          membershipType: membershipType,
          level: node.level,
          amount: amountFixed,
          sourceFund: 'MEMBERSHIP',
        }
      });
      
      // Also add to the main commission table (to be paid out later)
      const now = new Date();
      await tx.commission.create({
        data: {
          userId: node.userId,
          // orderId is null/optional for seed bonus
          type: 'SEED_BONUS',
          level: node.level,
          amount: amountFixed,
          pointsValue: 0,
          cycleMonth: now.getMonth() + 1,
          cycleYear: now.getFullYear(),
          status: 'PENDING',
        }
      });
    }
  }

  // Descontar del pool de reserva
  if (totalCalculated > 0) {
    await tx.fundsReserve.update({
      where: { id: reserve.id },
      data: {
        availableAmount: { decrement: totalCalculated },
        committedAmount: { increment: totalCalculated }
      }
    });
  }

  return commissions;
}
