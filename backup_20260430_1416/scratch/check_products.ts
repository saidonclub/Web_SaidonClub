
import { PrismaClient } from './src/generated/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    take: 10,
    select: {
      name: true,
      images: true,
    }
  });
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
