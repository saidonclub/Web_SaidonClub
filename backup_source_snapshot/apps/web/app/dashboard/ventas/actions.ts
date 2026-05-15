'use server'

import { revalidatePath } from 'next/cache'
import { updateOrderItemStatus } from '@/lib/data/dashboard'

export async function updateStatus(orderId: string, status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED") {
  try {
    await updateOrderItemStatus(orderId, status)
    revalidatePath('/dashboard/ventas')
    return { success: true }
  } catch (error) {
    console.error('Error updating status:', error)
    return { success: false, error: 'No se pudo actualizar el estado' }
  }
}
