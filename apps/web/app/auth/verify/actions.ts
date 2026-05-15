'use server'

import { createClient } from '@/utils/supabase/server'
import { verifyToken, createVerificationToken, sendVerificationPIN } from '@/lib/auth/security'
import { VerificationType } from '@saidonclub/database'

export async function verifyPinAction(email: string, pin: string) {
  const isValid = await verifyToken(email, pin, VerificationType.AUTH)

  if (!isValid) {
    return { success: false, message: 'PIN incorrecto o ha expirado' }
  }

  // Si el PIN es válido, el usuario ya debería tener una sesión activa 
  // (porque lo logueamos antes de mandarlo aquí)
  // Pero para estar seguros, comprobamos la sesión
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Sesión no encontrada. Por favor inicia sesión de nuevo.' }
  }

  return { success: true }
}

export async function resendPinAction(email: string) {
  try {
    const pin = await createVerificationToken(email, VerificationType.AUTH)
    await sendVerificationPIN(email, pin, VerificationType.AUTH)
    return { success: true }
  } catch (error) {
    console.error('Error resending PIN:', error)
    return { success: false, message: 'No se pudo reenviar el PIN' }
  }
}
