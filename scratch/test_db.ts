import { PrismaClient } from './packages/database/src/generated/client_v2';

const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({ take: 5 });
    console.log('Products found:', products.length);
    console.log(JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error connecting to DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
