const { PrismaClient } = require('./packages/database/src/generated/client');
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({ take: 5, select: { slug: true, name: true } });
  const products = await prisma.product.findMany({ take: 5, select: { slug: true, name: true } });
  console.log('Services Slugs:', services);
  console.log('Products Slugs:', products);
}

main().catch(console.error).finally(() => prisma.$disconnect());
