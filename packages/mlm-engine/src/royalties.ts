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
    royaltyPercentage,
    royaltyLevels,
  ] = await Promise.all([
    config.get<boolean>('mlm_enabled', true),
    config.get<boolean>('mlm_royalty_enabled', true),
    config.get<number>('mlm_royalty_percentage', 50),
    config.get<number>('mlm_royalty_levels', 8),
  ]);

  if (!mlmEnabled || !royaltyEnabled) return [];

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

  // Calcular margen real sumando todos los items
  let totalMargin = 0;
  for (const item of order.items) {
    if (item.product) {
      const prod = item.product;
      const itemMargin =
        Number(prod.priceSaidon) -
        Number(prod.cost) -
        Number(prod.tax) -
        Number(prod.logistics);
      totalMargin += itemMargin * item.quantity;
    } else if (item.service) {
      const svc = item.service;
      // Para servicios, el margen es el precio menos el costo y el impuesto
      const itemMargin = 
        Number(svc.priceSaidon) - 
        Number(svc.cost) - 
        Number(svc.tax);
      totalMargin += itemMargin * item.quantity;
    }
  }

  if (totalMargin <= 0) return [];

  // Calcular pool de regalías
  const pool = totalMargin * (royaltyPercentage / 100);

  // VALIDACIÓN CRÍTICA: Verificar fondos reservados antes de comprometer
  const reserve = await tx.fundsReserve.findFirst({
    where: { fundType: 'MARKETPLACE_MARGIN' },
  });
  
  if (!reserve || Number(reserve.availableAmount) < pool) {
    throw new Error(`Fondos insuficientes en MARKETPLACE_MARGIN para orden ${orderId}`);
  }

  // Obtener árbol genealógico con compresión dinámica
  const tree = await getGenealogyTree(order.user.id, royaltyLevels);

  // Leer porcentajes por nivel en paralelo
  const levelKeys = Array.from({ length: royaltyLevels }, (_, i) => `mlm_royalty_l${i + 1}_pct`);
  const levelPercentages = await config.getMany(levelKeys);

  const commissions: RoyaltyCommission[] = [];
  let totalCalculated = 0;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  for (const node of tree) {
    const pct = Number(levelPercentages[`mlm_royalty_l${node.level}_pct`] ?? 0);
    if (pct <= 0) continue;

    const amount = pool * (pct / 100);
    const amountFixed = parseFloat(amount.toFixed(2));
    
    if (amountFixed > 0) {
      commissions.push({
        userId: node.userId,
        orderId,
        level: node.level,
        percentage: pct,
        amount: amountFixed,
        type: 'ROYALTY',
      });
      totalCalculated += amountFixed;
      
      // CREATE COMMISSION IN DB
      await tx.commission.create({
        data: {
          userId: node.userId,
          orderId,
          type: 'ROYALTY',
          level: node.level,
          percentage: pct,
          amount: amountFixed,
          pointsValue: 0,
          cycleMonth: currentMonth,
          cycleYear: currentYear,
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
