'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@saidonclub/database'
import { config } from '@saidonclub/config-engine'
import { exchangeBalanceToPoints } from '@saidonclub/mlm-engine'

/**
 * Obtiene los datos necesarios para la interfaz de canje.
 */
export async function getExchangeData(userId: string) {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: { balanceAvailable: true }
    })

    const exchangeRate = await config.get<number>('POINTS_EXCHANGE_RATE', 100)

    return {
      balanceAvailable: wallet?.balanceAvailable.toNumber() || 0,
      exchangeRate
    }
  } catch (error) {
    console.error('Error fetching exchange data:', error)
    return {
      balanceAvailable: 0,
      exchangeRate: 100
    }
  }
}

/**
 * Ejecuta el canje de puntos.
 */
export async function executeExchange(userId: string, amount: number) {
  try {
    const result = await exchangeBalanceToPoints(userId, amount)
    
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/exchange-points')
    
    return {
      success: true,
      message: `¡Canje exitoso! Has obtenido ${result.pointsEarned} SaidonPoints.`,
      data: result
    }
  } catch (error: unknown) {
    console.error('Error executing exchange:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error inesperado al procesar el canje.'
    }
  }
}
