// ============================================================
// MODULE:     mlm-engine/payments
// AGENT:      MLM/Math Engineer
// PURPOSE:    Gestión de pagos a proveedores por ventas realizadas.
//             Acredita el costo del producto/servicio al wallet del proveedor.
//             Incluye límites diarios de transferencia por rol.
// ============================================================

import { prisma, Prisma } from '@saidonclub/database';

// ─── Límites diarios de transferencia por rol ─────────────────────────────
export const DAILY_TRANSFER_LIMITS: Record<string, number> = {
  USER:        500,
  PREFERENTE:  1_000,
  PIONERO:     5_000,
  PROVIDER_PRODUCTS: 10_000,
  PROVIDER_SERVICES: 10_000,
  ADMIN:       50_000,
  SUPER_ADMIN: 999_999,
  AUDITOR:     0,      // Auditores no pueden transferir
  ACCOUNTANT:  0,
};

export const DEFAULT_DAILY_LIMIT = 500;

/**
 * Verifica si un usuario puede realizar una transferencia dado su límite diario.
 * @returns { allowed: boolean, remaining: number, limit: number }
 */
export async function checkTransferLimit(
  userId: string,
  amount: number,
): Promise<{ allowed: boolean; remaining: number; limit: number; message?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const limit = DAILY_TRANSFER_LIMITS[user?.role ?? 'USER'] ?? DEFAULT_DAILY_LIMIT;

  if (limit === 0) {
    return { allowed: false, remaining: 0, limit, message: 'Tu rol no permite transferencias.' };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayTransfers = await prisma.walletTransaction.aggregate({
    _sum: { amount: true },
    where: {
      wallet: { userId },
      type: 'POINTS_TRANSFER',
      createdAt: { gte: todayStart },
      status: { in: ['PENDING', 'VALIDATED', 'PAID'] },
    },
  });

  const usedToday = Math.abs(Number(todayTransfers._sum?.amount ?? 0));
  const remaining = Math.max(0, limit - usedToday);

  if (amount > remaining) {
    return {
      allowed: false,
      remaining,
      limit,
      message: `Límite diario alcanzado. Puedes transferir máximo ${remaining.toFixed(2)} hoy (límite: ${limit.toLocaleString()}/día).`,
    };
  }

  return { allowed: true, remaining, limit };
}

/**
 * Procesa los pagos a proveedores para una orden específica.
 * Acredita el costo base (cost * quantity) a la billetera del proveedor.
 */
export async function processProviderPayments(
  orderId: string,
  tx: Prisma.TransactionClient = prisma
): Promise<void> {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          service: true,
        },
      },
    },
  });

  if (!order) return;

  // Mapa para acumular pagos por proveedor (por si hay varios items del mismo proveedor)
  const providerPayments = new Map<string, number>();

  for (const item of order.items) {
    let cost = 0;
    let providerId = '';

    if (item.product) {
      cost = Number(item.product.cost);
      providerId = item.product.providerId;
    } else if (item.service) {
      cost = Number(item.service.cost);
      providerId = item.service.providerId;
    }

    if (providerId && cost > 0) {
      const current = providerPayments.get(providerId) || 0;
      providerPayments.set(providerId, current + cost * item.quantity);
    }
  }

  // Acreditar a cada proveedor
  for (const [providerId, totalAmount] of providerPayments.entries()) {
    // 1. Asegurar que el proveedor tenga una billetera
    let wallet = await tx.wallet.findUnique({
      where: { userId: providerId },
    });

    if (!wallet) {
      wallet = await tx.wallet.create({
        data: {
          userId: providerId,
          balancePending: 0,
          balanceAvailable: 0,
        },
      });
    }

    // 2. Aumentar el balance pendiente
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balancePending: { increment: totalAmount },
        totalEarned: { increment: totalAmount },
      },
    });

    // 3. Crear registro de transacción
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount: totalAmount,
        status: 'PENDING',
        description: `Venta Marketplace - Orden #${orderId.slice(0, 8)}`,
        metadata: {
          orderId,
          source: 'MARKETPLACE_SALE',
        },
      },
    });
  }
}
