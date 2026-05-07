import { PrismaClient } from '../packages/database/src/generated/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true }
  })
  const services = await prisma.service.findMany({
    include: { category: true }
  })

  console.log('PRODUCTS:')
  products.forEach(p => {
    console.log(`- ID: ${p.id} | Name: ${p.name} | Category: ${p.category.name} | Images: ${JSON.stringify(p.images)}`)
  })

  console.log('\nSERVICES:')
  services.forEach(s => {
    console.log(`- ID: ${s.id} | Name: ${s.name} | Category: ${s.category.name} | Images: ${JSON.stringify(s.images)}`)
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
