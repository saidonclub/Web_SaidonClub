import { PrismaClient } from './src/generated/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '.env') })

const prisma = new PrismaClient()

async function main() {
  const email = 'test_user@saidonclub.com'
  const VerificationType = { AUTH: 'AUTH' } as any
  
  console.log('Prisma keys:', Object.keys(prisma).filter(k => !k.startsWith('_')))
  console.log('VerificationToken model exists:', !!(prisma as any).verificationToken)
  
  // Create user if not exists
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      username: 'test_user_2026',
      name: 'Test User',
      affiliateCode: 'TEST_2026_ABC'
    }
  })
  
  console.log('User created/found:', user.id)
  
  // Create token
  const pin = '123456'
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  
  await prisma.verificationToken.upsert({
    where: {
      identifier_token: {
        identifier: email,
        token: pin
      }
    },
    update: {
      expiresAt,
      type: VerificationType.AUTH
    },
    create: {
      identifier: email,
      token: pin,
      type: VerificationType.AUTH,
      expiresAt
    }
  })
  
  console.log('Verification PIN created: 123456')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
