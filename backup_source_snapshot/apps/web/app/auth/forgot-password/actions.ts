'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return redirect('/auth/forgot-password?error=' + encodeURIComponent('Ingresa tu correo electrónico'))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    // No revelar si el correo existe o no (seguridad)
  }

  // Siempre mostrar mensaje de éxito para evitar enumeración de emails
  return redirect(
    '/auth/forgot-password?message=' +
      encodeURIComponent(
        'Si ese correo está registrado, recibirás las instrucciones en breve. Revisa tu bandeja de entrada.'
      )
  )
}
