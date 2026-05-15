"use server";

import {
  createVerificationToken,
  sendVerificationPIN,
  verifyToken,
} from "@/lib/auth/security";
import { VerificationType } from "@saidonclub/database";
import { prisma } from "@saidonclub/database";
import { createClient } from "@/utils/supabase/server";

const WITHDRAWAL_CONFIG = {
  MIN_AMOUNT: 10,
  MAX_DAILY_LIMIT: 1000,
  MIN_WITHDRAWAL_FREQUENCY_HOURS: 24,
};

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id;
}

export async function requestWithdrawalPin() {
  const userId = await getUserId();
  if (!userId) return { success: false, message: "No autorizado" };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) return { success: false, message: "Usuario no encontrado" };

  try {
    const pin = await createVerificationToken(
      user.email,
      VerificationType.WITHDRAWAL,
    );
    await sendVerificationPIN(user.email, pin, VerificationType.WITHDRAWAL);
    return { success: true };
  } catch (error) {
    console.error("Error requesting withdrawal PIN:", error);
    return {
      success: false,
      message: "No se pudo generar el PIN de seguridad",
    };
  }
}

export async function executeWithdrawal(
  email: string,
  pin: string,
  amount: number,
  method: string,
  details: string,
) {
  const userId = await getUserId();
  if (!userId) return { success: false, message: "No autorizado" };

  const isValid = await verifyToken(email, pin, VerificationType.WITHDRAWAL);

  if (!isValid) {
    return { success: false, message: "PIN incorrecto o expirado" };
  }

  if (amount <= 0) {
    return { success: false, message: "El monto debe ser mayor a cero" };
  }

  if (amount < WITHDRAWAL_CONFIG.MIN_AMOUNT) {
    return {
      success: false,
      message: `El monto mínimo de retiro es $${WITHDRAWAL_CONFIG.MIN_AMOUNT}`,
    };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayWithdrawals = await prisma.walletTransaction.findMany({
    where: {
      wallet: { userId },
      type: "WITHDRAWAL",
      createdAt: { gte: todayStart },
      status: { in: ["PENDING", "VALIDATED"] },
    },
  });

  const todayTotal = Math.abs(
    todayWithdrawals.reduce((sum, tx) => sum + Number(tx.amount), 0),
  );
  const remainingDaily = WITHDRAWAL_CONFIG.MAX_DAILY_LIMIT - todayTotal;

  if (remainingDaily <= 0) {
    return {
      success: false,
      message: `Has alcanzado tu límite diario de $${WITHDRAWAL_CONFIG.MAX_DAILY_LIMIT}. Intenta mañana.`,
    };
  }

  if (amount > remainingDaily) {
    return {
      success: false,
      message: `Puedes retirar máximo $${remainingDaily.toFixed(2)} hoy. Límite diario: $${WITHDRAWAL_CONFIG.MAX_DAILY_LIMIT}`,
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get user wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        throw new Error("Wallet no encontrada");
      }

      const availableBalance = Number(wallet.balanceAvailable);
      if (availableBalance < amount) {
        throw new Error(
          `Balance insuficiente. Disponible: $${availableBalance.toFixed(2)}`,
        );
      }

      // 2. Create withdrawal transaction (pending validation)
      const now = new Date();
      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "WITHDRAWAL",
          amount: -amount,
          status: "PENDING",
          description: `Retiro via ${method} - ${details}`,
          metadata: {
            method,
            details,
            requestedAt: now.toISOString(),
          },
          createdAt: now,
        },
      });

      // 3. Reserve funds (move from available to pending)
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceAvailable: { decrement: amount },
          balancePending: { increment: amount },
        },
      });

      return { transactionId: transaction.id, amount };
    });

    return {
      success: true,
      message: `Solicitud de retiro de $${result.amount.toFixed(2)} enviada. Será procesada en 24-48 horas.`,
    };
  } catch (error: unknown) {
    console.error("Error during withdrawal:", error);
    const message =
      error instanceof Error ? error.message : "Error al procesar el retiro";
    return { success: false, message };
  }
}
