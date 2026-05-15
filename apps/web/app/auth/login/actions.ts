'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createVerificationToken, sendVerificationPIN } from '@/lib/auth/security'
import { VerificationType } from '@saidonclub/database'

async function checkTwoFactorEnabled(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('two_factor_enabled')
    .eq('id', userId)
    .single()
  
  return data?.two_factor_enabled ?? false
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/auth/login?error=' + encodeURIComponent(error.message))
  }

  // BYPASS 2FA en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] 2FA bypass activado para: ${email} — redirigiendo al dashboard`)
    return redirect('/dashboard')
  }

  // Verificar si usuario tiene 2FA habilitado
  if (authData.user) {
    const has2FA = await checkTwoFactorEnabled(supabase, authData.user.id)
    
    if (has2FA) {
      // 2FA habilitado: generar token TOTP y redirigir a verify-2fa
      try {
        const pin = await createVerificationToken(email, VerificationType.AUTH)
        await sendVerificationPIN(email, pin, VerificationType.AUTH)
        return redirect(`/auth/verify?email=${encodeURIComponent(email)}`)
      } catch (err) {
        console.error('Error in 2FA flow:', err)
        return redirect('/auth/login?error=Error al generar código de seguridad')
      }
    }
  }

  // Sin 2FA: redirigir directamente al dashboard
  return redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect('/auth/login?error=' + encodeURIComponent(error.message))
  }

  return redirect('/auth/login?message=Check your email to continue')
}
export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return redirect('/auth/login?error=' + encodeURIComponent(error.message))
  }

  if (data.url) {
    return redirect(data.url)
  }
}
