import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking database tables and row counts...')
  const tables: any[] = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `
  
  for (const table of tables) {
    const tableName = table.table_name
    try {
      const count: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "public"."${tableName}"`)
      console.log(`Table ${tableName}: ${count[0].count} rows`)
    } catch (e) {
      console.log(`Table ${tableName}: Error reading count`)
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
