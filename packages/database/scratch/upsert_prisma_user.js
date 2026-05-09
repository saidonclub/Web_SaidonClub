
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function upsertUser() {
  const userId = '6539a13b-b230-412a-b76c-595699667024'
  const email = 'admin_audit@saidonclub.com'
  
  console.log(`Upserting user ${email} in Prisma...`)
  
  try {
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      },
      create: {
        id: userId,
        email: email,
        username: 'admin_audit',
        name: 'Admin Audit',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        affiliateCode: 'AUDIT_ADMIN_CODE'
      }
    })
    
    // Also create wallet
    await prisma.wallet.upsert({
      where: { userId: userId },
      update: {},
      create: {
        userId: userId,
        balancePending: 0,
        balanceValidated: 0,
        balanceAvailable: 1000, // Give some fake money for testing
        balanceDebt: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
      }
    })
    
    console.log('User upserted successfully in Prisma.')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

upsertUser()
