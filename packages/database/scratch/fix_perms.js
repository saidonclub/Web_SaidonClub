
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixPermissions() {
  try {
    console.log('Granting permissions...')
    await prisma.$executeRawUnsafe('GRANT USAGE ON SCHEMA public TO anon, authenticated;')
    await prisma.$executeRawUnsafe('GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;')
    console.log('Permissions granted successfully.')
  } catch (error) {
    console.error('Error granting permissions:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixPermissions()
