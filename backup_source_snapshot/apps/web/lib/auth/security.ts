import { Resend } from 'resend'
import { prisma, VerificationType } from '@saidonclub/database'
import { randomBytes } from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Genera un PIN de 6 dígitos criptográficamente seguro
 */
export function generatePIN(): string {
  const random = randomBytes(3) // 3 bytes = 24 bits, gives us 0-16777215
  const num = parseInt(random.toString('hex').slice(0, 6), 16) % 900000
  return (100000 + num).toString()
}

/**
 * Envía el PIN por correo electrónico
 */
export async function sendVerificationPIN(email: string, pin: string, type: VerificationType) {
  const typeLabels: Record<VerificationType, string> = {
    TRANSACTION: 'Transacción',
    WITHDRAWAL: 'Retiro de Fondos',
    TRANSFER: 'Transferencia',
    AUTH: 'Inicio de Sesión'
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] PIN for ${email} (${typeLabels[type]}): ${pin}`)
    // En desarrollo, no enviamos el email real para evitar bloqueos por API key no configurada
    return { id: 'dev-mock-email-id' }
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'SaidonClub <noreply@saidonclub.com>',
    to: [email],
    subject: `Tu PIN de seguridad para ${typeLabels[type]}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #FF6B00; text-align: center;">SaidonClub Security</h2>
        <p>Hola,</p>
        <p>Se ha solicitado un PIN de seguridad para confirmar una acción de <strong>${typeLabels[type]}</strong> en tu cuenta.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${pin}</span>
        </div>
        <p style="font-size: 14px; color: #666;">Este PIN expirará en 10 minutos. Si no has solicitado este PIN, por favor ignora este correo o contacta a soporte.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">© 2026 SaidonClub. Todos los derechos reservados.</p>
      </div>
    `
  })

  if (error) {
    console.error('Error sending email:', error)
    throw new Error('No se pudo enviar el correo de verificación')
  }

  return data
}

/**
 * Crea y almacena un nuevo token de verificación
 */
export async function createVerificationToken(identifier: string, type: VerificationType) {
  const pin = generatePIN()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

  await prisma.verificationToken.create({
    data: {
      identifier,
      token: pin,
      type,
      expiresAt
    }
  })

  return pin
}

/**
 * Verifica si un PIN es válido
 */
export async function verifyToken(identifier: string, token: string, type: VerificationType) {
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier,
      token,
      type,
      expiresAt: {
        gt: new Date()
      }
    }
  })

  if (!record) {
    return false
  }

  // Eliminar el token tras su uso exitoso (opcional, pero recomendado)
  await prisma.verificationToken.delete({
    where: {
      id: record.id
    }
  })

  return true
}
