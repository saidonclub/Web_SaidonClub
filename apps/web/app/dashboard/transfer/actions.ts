'use server'

import { createVerificationToken, sendVerificationPIN, verifyToken } from '@/lib/auth/security'
import { VerificationType } from '@saidonclub/database'
import { prisma } from '@saidonclub/database'
import { createClient } from '@/utils/supabase/server'
import { checkTransferLimit } from '@saidonclub/mlm-engine'

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

export async function requestTransferPin() {
  const userId = await getUserId()
  if (!userId) return { success: false, message: 'No autorizado' }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  })

  if (!user) return { success: false, message: 'Usuario no encontrado' }

  try {
    const pin = await createVerificationToken(user.email, VerificationType.TRANSACTION)
    await sendVerificationPIN(user.email, pin, VerificationType.TRANSACTION)
    return { success: true }
  } catch (error) {
    console.error('Error requesting transfer PIN:', error)
    return { success: false, message: 'No se pudo generar el PIN de seguridad' }
  }
}

export async function executeTransfer(email: string, pin: string, amount: number, destinationEmail: string) {
  const userId = await getUserId()
  if (!userId) return { success: false, message: 'No autorizado' }

  const isValid = await verifyToken(email, pin, VerificationType.TRANSACTION)

  if (!isValid) {
    return { success: false, message: 'PIN incorrecto o expirado' }
  }

  if (amount <= 0) {
    return { success: false, message: 'El monto debe ser mayor a cero' }
  }

  if (email.toLowerCase() === destinationEmail.toLowerCase()) {
    return { success: false, message: 'No puedes transferirte a ti mismo' }
  }

  // Verificar límite diario de transferencias
  const limitCheck = await checkTransferLimit(userId, amount)
  if (!limitCheck.allowed) {
    return { success: false, message: limitCheck.message ?? 'Límite diario de transferencias alcanzado' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get sender wallet
      const senderWallet = await tx.wallet.findUnique({
        where: { userId }
      })

      if (!senderWallet) {
        throw new Error('Wallet no encontrada')
      }

      const availableBalance = Number(senderWallet.balanceAvailable)
      if (availableBalance < amount) {
        throw new Error(`Balance insuficiente. Disponible: $${availableBalance.toFixed(2)}`)
      }

      // 2. Find destination user
      const destUser = await tx.user.findUnique({
        where: { email: destinationEmail.toLowerCase() },
        include: { wallet: true }
      })

      if (!destUser) {
        throw new Error('Usuario destino no encontrado')
      }

      // 3. Create transaction records
      const now = new Date()

      // Debit sender
      await tx.walletTransaction.create({
        data: {
          walletId: senderWallet.id,
          type: 'POINTS_TRANSFER',
          amount: -amount,
          status: 'VALIDATED',
          description: `Transferencia a ${destUser.email}`,
          createdAt: now
        }
      })

      // Credit receiver
      await tx.walletTransaction.create({
        data: {
          walletId: destUser.wallet!.id,
          type: 'DEPOSIT',
          amount: amount,
          status: 'AVAILABLE',
          description: `Transferencia de ${email}`,
          createdAt: now
        }
      })

      // 4. Update sender wallet
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: {
          balanceAvailable: { decrement: amount },
          balanceValidated: { decrement: amount }
        }
      })

      // 5. Update receiver wallet
      await tx.wallet.update({
        where: { id: destUser.wallet!.id },
        data: {
          balanceAvailable: { increment: amount },
          balanceValidated: { increment: amount }
        }
      })

      return { destUserEmail: destUser.email }
    })

    return { success: true, message: `Transferencia de $${amount.toFixed(2)} a ${result.destUserEmail} completada` }
  } catch (error: unknown) {
    console.error('Error during transfer:', error)
    const message = error instanceof Error ? error.message : 'Error al procesar la transferencia'
    return { success: false, message }
  }
}
