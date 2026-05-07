// ============================================================
// MODULE:     mlm-engine/payments
// AGENT:      MLM/Math Engineer
// PURPOSE:    Gestión de pagos a proveedores por ventas realizadas.
//             Acredita el costo del producto/servicio al wallet del proveedor.
// ============================================================

import { prisma, Prisma } from '@saidonclub/database';

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
