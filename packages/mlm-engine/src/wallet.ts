// ============================================================
// MODULE:     mlm-engine/wallet
// AGENT:      MLM/Math Engineer
// PURPOSE:    Gestión de billetera y canje de puntos.
//             Permite convertir saldo disponible (USD) a puntos Saidon.
// ============================================================

import { prisma, Prisma } from '@saidonclub/database';
import { config } from '@saidonclub/config-engine';

/**
 * Intercambia saldo disponible en la billetera por puntos Saidon.
 * Realiza una operación atómica (ACID) para garantizar la integridad financiera.
 * 
 * @param userId ID del usuario
 * @param amount Cantidad en USD a retirar de la billetera
 */
export async function exchangeBalanceToPoints(userId: string, amount: number) {
  const amountDecimal = new Prisma.Decimal(amount);
  
  if (amountDecimal.lte(0)) {
    throw new Error('El monto debe ser mayor a cero');
  }

  // Obtener tasa de conversión (por defecto 100 puntos por 1 USD)
  const exchangeRate = await config.get<number>('POINTS_EXCHANGE_RATE', 100);

  return await prisma.$transaction(async (tx) => {
    // 1. Obtener wallet con lock (implicit in update or select for update if needed)
    // Usamos findUnique primero para validar existencia
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new Error('Wallet no encontrada para el usuario');
    }

    // 2. Verificar saldo disponible
    if (wallet.balanceAvailable.lt(amountDecimal)) {
      throw new Error('Saldo insuficiente para realizar el canje');
    }

    // 3. Descontar de wallet
    // increment/decrement en Prisma generan SQL 'balance = balance - X' que es seguro ante concurrencia
    const updatedWallet = await tx.wallet.update({
      where: { userId },
      data: {
        balanceAvailable: { decrement: amountDecimal },
        totalWithdrawn: { increment: amountDecimal },
      },
    });

    // 4. Registrar transacción en wallet
    await tx.walletTransaction.create({
      data: {
        walletId: updatedWallet.id,
        amount: amountDecimal,
        type: 'WITHDRAWAL',
        status: 'PAID',
        description: `Canje de saldo a puntos (${amount} USD)`,
        metadata: {
          target: 'POINTS',
          exchangeRate,
          pointsEarned: amountDecimal.mul(exchangeRate).toNumber(),
        },
      },
    });

    // 5. Agregar puntos al PointsLedger
    const pointsToAdd = amountDecimal.mul(exchangeRate);
    const now = new Date();
    
    await tx.pointsLedger.create({
      data: {
        userId,
        amount: pointsToAdd,
        sourceType: 'TRANSFER',
        cycleMonth: now.getMonth() + 1,
        cycleYear: now.getFullYear(),
        description: `Canje desde billetera (${amount} USD)`,
      },
    });

    return {
      success: true,
      amountExchanged: amount,
      pointsEarned: pointsToAdd.toNumber(),
      newBalanceAvailable: updatedWallet.balanceAvailable.toNumber(),
    };
  });
}
