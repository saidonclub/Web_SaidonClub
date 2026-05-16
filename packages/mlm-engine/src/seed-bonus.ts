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

  // Fetch all required config values upfront to avoid querying inside the loop
  const [
    preferenteN1,
    upgradeN1,
    pioneroN1,
    pioneroN2_8
  ] = await Promise.all([
    config.get<number>('mlm_seed_preferente_n1', 10),
    config.get<number>('mlm_seed_upgrade_n1', 33),
    config.get<number>('mlm_seed_pionero_n1', 43),
    config.get<number>('mlm_seed_pionero_n2_8', 1)
  ]);

  // Pre-cargar billeteras para evitar N+1
  const userIds = tree.map(node => node.userId);
  const existingWallets = await tx.wallet.findMany({
    where: { userId: { in: userIds } }
  });
  const walletMap = new Map(existingWallets.map(w => [w.userId, w]));

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  for (const node of tree) {
    let amount = 0;

    if (node.level === 1) {
      // Nivel 1: montos variables según tipo de membresía
      if (membershipType === 'PREFERENTE') {
        amount = preferenteN1;
      } else if (membershipType === 'PIONERO') {
        // Si es upgrade, usa el bonus de upgrade N1, si no el normal de pionero
        amount = isUpgrade ? upgradeN1 : pioneroN1;
      }
    } else if (node.level >= 2 && node.level <= 8) {
      // Niveles 2-8: Pionero y Upgrade pagan $1 por nivel
      if (membershipType === 'PIONERO') {
        amount = pioneroN2_8;
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
      const comm = await tx.commission.create({
        data: {
          userId: node.userId,
          // orderId is null/optional for seed bonus
          type: 'SEED_BONUS',
          level: node.level,
          amount: amountFixed,
          pointsValue: 0,
          cycleMonth: currentMonth,
          cycleYear: currentYear,
          status: 'PENDING',
        }
      });

      // --- INTEGRACIÓN DE BILLETERA ---
      
      // 1. GET OR CREATE WALLET
      let wallet = walletMap.get(node.userId);
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: {
            userId: node.userId,
            balancePending: 0,
            balanceAvailable: 0,
            balanceValidated: 0,
          }
        });
        walletMap.set(node.userId, wallet);
      }

      // 2. UPDATE WALLET BALANCE (PENDING)
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balancePending: { increment: amountFixed },
          totalEarned: { increment: amountFixed }
        }
      });

      // 3. CREATE WALLET TRANSACTION
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'COMMISSION',
          amount: amountFixed,
          status: 'PENDING',
          description: `Bono Semilla - Nivel ${node.level} - Compra: ${membershipType}${isUpgrade ? ' (UPGRADE)' : ''}`,
          metadata: {
            commissionId: comm.id,
            purchaserId,
            level: node.level,
            source: 'SEED_BONUS'
          }
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
