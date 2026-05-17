// ============================================================
// MODULE:     mlm-engine/royalties
// AGENT:      MLM/Math Engineer
// PURPOSE:    Cálculo de regalías sobre el margen real de cada orden.
//             Distribuye el pool entre niveles activos con compresión.
//
// FÓRMULA:
//   Margen Real = priceSaidon - cost - tax - logistics
//   Pool = Margen Real * (mlm_royalty_percentage / 100)
//   Comisión Nivel X = Pool * (mlm_royalty_lX_pct / 100)
//
// VALIDACIÓN FINANCIERA (CRÍTICA):
//   - FundsReserve MARKETPLACE_MARGIN >= Pool total
//   - Si no hay fondos suficientes, falla de forma segura (no genera comisiones).
// ============================================================

import { prisma, Prisma } from '@saidonclub/database';
import { config } from '@saidonclub/config-engine';
import { getGenealogyTree } from './genealogy';

export interface RoyaltyCommission {
  userId: string;
  orderId: string;
  level: number;
  percentage: number;
  amount: number;
  type: 'ROYALTY';
}

/**
 * Calcula y genera las comisiones de regalías para una orden.
 * DEBE ejecutarse dentro de una transacción Prisma para garantizar ACID.
 */
export async function calculateRoyalties(
  orderId: string,
  tx: Prisma.TransactionClient = prisma
): Promise<RoyaltyCommission[]> {
  // Leer configuraciones relevantes de forma paralela
  const [
    mlmEnabled,
    royaltyEnabled,
    royaltyPercentageVal,
    royaltyLevels,
  ] = await Promise.all([
    config.get<boolean>('mlm_enabled', true),
    config.get<boolean>('mlm_royalty_enabled', true),
    config.get<number>('mlm_royalty_percentage', 50),
    config.get<number>('mlm_royalty_levels', 8),
  ]);

  if (!mlmEnabled || !royaltyEnabled) return [];

  // Convertir porcentaje pool a Decimal
  const poolPercentage = new Prisma.Decimal(royaltyPercentageVal).div(100);

  // Obtener orden con productos y servicios
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: { 
      items: { 
        include: { 
          product: true,
          service: true
        } 
      }, 
      user: true 
    },
  });

  if (!order || order.isMembershipOrder) return [];
  if (!order.user) return [];

  // Calcular margen real sumando todos los items usando Decimal para precisión
  let totalMargin = new Prisma.Decimal(0);
  
  for (const item of order.items) {
    if (item.product) {
      const prod = item.product;
      const price = new Prisma.Decimal(prod.priceSaidon);
      const cost = new Prisma.Decimal(prod.cost);
      const tax = new Prisma.Decimal(prod.tax);
      const logistics = new Prisma.Decimal(prod.logistics);
      
      const itemMargin = price.minus(cost).minus(tax).minus(logistics);
      totalMargin = totalMargin.plus(itemMargin.mul(item.quantity));
    } else if (item.service) {
      const svc = item.service;
      const price = new Prisma.Decimal(svc.priceSaidon);
      const cost = new Prisma.Decimal(svc.cost);
      const tax = new Prisma.Decimal(svc.tax);
      
      const itemMargin = price.minus(cost).minus(tax);
      totalMargin = totalMargin.plus(itemMargin.mul(item.quantity));
    }
  }

  if (totalMargin.lte(0)) return [];

  // Calcular pool de regalías (Margen * % Configurado)
  const pool = totalMargin.mul(poolPercentage);

  // VALIDACIÓN CRÍTICA: Verificar fondos reservados antes de comprometer
  const reserve = await tx.fundsReserve.findFirst({
    where: { fundType: 'MARKETPLACE_MARGIN' },
  });
  
  if (!reserve || new Prisma.Decimal(reserve.availableAmount).lt(pool)) {
    throw new Error(`Fondos insuficientes en MARKETPLACE_MARGIN para orden ${orderId}. Requerido: ${pool}, Disponible: ${reserve?.availableAmount ?? 0}`);
  }

  // Obtener árbol genealógico con compresión dinámica
  const tree = await getGenealogyTree(order.user.id, royaltyLevels);

  // Leer porcentajes por nivel en paralelo
  const levelKeys = Array.from({ length: royaltyLevels }, (_, i) => `mlm_royalty_l${i + 1}_pct`);
  const levelPercentages = await config.getMany(levelKeys);

  const commissions: RoyaltyCommission[] = [];
  let totalCalculated = new Prisma.Decimal(0);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Pre-cargar billeteras para evitar N+1
  const userIds = tree.map(node => node.userId);
  const existingWallets = await tx.wallet.findMany({
    where: { userId: { in: userIds } }
  });
  const walletMap = new Map(existingWallets.map((w: { userId: string; id: string }) => [w.userId, w]));

  for (const node of tree) {
    const pctVal = Number(levelPercentages[`mlm_royalty_l${node.level}_pct`] ?? 0);
    if (pctVal <= 0) continue;

    const levelPct = new Prisma.Decimal(pctVal).div(100);
    // Comisión = Pool * % del Nivel
    const amount = pool.mul(levelPct).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
    
    if (amount.gt(0)) {
      const amountNumber = amount.toNumber();
      
      commissions.push({
        userId: node.userId,
        orderId,
        level: node.level,
        percentage: pctVal,
        amount: amountNumber,
        type: 'ROYALTY',
      });
      totalCalculated = totalCalculated.plus(amount);
      
      // 1. CREATE COMMISSION IN DB
      const comm = await tx.commission.create({
        data: {
          userId: node.userId,
          orderId,
          type: 'ROYALTY',
          level: node.level,
          percentage: pctVal,
          amount: amount, // Prisma acepta Decimal
          pointsValue: 0,
          cycleMonth: currentMonth,
          cycleYear: currentYear,
          status: 'PENDING',
        }
      });

      // 2. GET OR CREATE WALLET
      type WalletRecord = { id: string };
      let wallet = walletMap.get(node.userId) as WalletRecord | undefined;
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: {
            userId: node.userId,
            balancePending: 0,
            balanceAvailable: 0,
            balanceValidated: 0,
          }
        }) as WalletRecord;
        walletMap.set(node.userId, wallet as ReturnType<typeof walletMap.get> extends undefined ? never : NonNullable<ReturnType<typeof walletMap.get>>);
      }

      // 3. UPDATE WALLET BALANCE (PENDING)
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balancePending: { increment: amount },
          totalEarned: { increment: amount }
        }
      });

      // 4. CREATE WALLET TRANSACTION
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'ROYALTY',
          amount: amount,
          status: 'PENDING',
          description: `Regalías - Nivel ${node.level} - Orden #${orderId.slice(0, 8)}`,
          metadata: {
            commissionId: comm.id,
            orderId,
            level: node.level,
            source: 'ROYALTY'
          }
        }
      });
    }
  }

  // Descontar del pool de reserva
  if (totalCalculated.gt(0)) {
    await tx.fundsReserve.update({
      where: { id: reserve!.id },
      data: {
        availableAmount: { decrement: totalCalculated },
        committedAmount: { increment: totalCalculated }
      }
    });
  }

  return commissions;
}

