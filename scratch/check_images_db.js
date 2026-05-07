const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, images: true } });
  const services = await prisma.service.findMany({ select: { id: true, name: true, images: true } });
  
  console.log('--- PRODUCTS ---');
  console.log(JSON.stringify(products, null, 2));
  console.log('--- SERVICES ---');
  console.log(JSON.stringify(services, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
