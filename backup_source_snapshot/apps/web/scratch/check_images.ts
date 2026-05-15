
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const productsWithoutImages = await prisma.product.findMany({
    where: {
      OR: [
        { image_url: null },
        { image_url: '' },
      ],
    },
    select: { id: true, name: true, type: true },
  });

  const servicesWithoutImages = await prisma.service.findMany({
    where: {
      OR: [
        { image_url: null },
        { image_url: '' },
      ],
    },
    select: { id: true, name: true },
  });

  console.log('Products without images:', JSON.stringify(productsWithoutImages, null, 2));
  console.log('Services without images:', JSON.stringify(servicesWithoutImages, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
