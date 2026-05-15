'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@saidonclub/database'

export async function register(_prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const affiliateCode = (formData.get('affiliateCode') as string)?.trim()

  // Validaciones básicas
  if (!name || !email || !password) {
    return { error: 'Todos los campos son obligatorios' }
  }

  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden' }
  }

  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres' }
  }

  // Buscar sponsor por código de afiliado
  let sponsorId: string | undefined = undefined
  if (affiliateCode) {
    const sponsor = await prisma.user.findUnique({
      where: { affiliateCode: affiliateCode.toUpperCase() },
      select: { id: true },
    })
    if (!sponsor) {
      return { error: 'Código de referido inválido' }
    }
    sponsorId = sponsor.id
  }

  // Crear usuario en Supabase Auth
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (authError || !authData.user) {
    const msg = authError?.message ?? 'Error al crear la cuenta'
    // Manejar casos comunes de error de Supabase
    if (msg.includes('rate limit')) return { error: 'Demasiados intentos. Intenta más tarde.' }
    if (msg.includes('valid email')) return { error: 'Formato de correo inválido.' }
    return { error: msg }
  }

  const user = authData.user

  // SECURITY: Prevent self-referral - user cannot sponsor themselves
  if (sponsorId && sponsorId === user.id) {
    console.warn(`[SECURITY] Self-referral attempt blocked. User ${user.id} tried to use their own affiliate code.`)
    sponsorId = undefined
  }

  // Generar código de afiliado único con entropía adicional para alta concurrencia
  const newAffiliateCode = `SC${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`

  // Crear perfil y wallet en Prisma usando una transacción
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: user.id,
          email,
          username: email.split('@')[0] + '_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
          name,
          affiliateCode: newAffiliateCode,
          sponsorId: sponsorId ?? null,
          role: 'CLIENT',
          status: 'ACTIVE',
        },
      })

      await tx.wallet.create({
        data: {
          userId: user.id,
          balancePending: 0,
          balanceValidated: 0,
          balanceAvailable: 0,
          balanceDebt: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
        },
      })
    })
  } catch (dbError) {
    console.error('Error creating user profile:', dbError)
    return { error: 'Error al configurar tu perfil. Contacta soporte.' }
  }

  redirect('/auth/login?message=' + encodeURIComponent('¡Cuenta creada! Revisa tu correo para confirmarla, luego inicia sesión.'))
}
