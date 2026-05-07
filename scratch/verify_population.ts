import { prisma } from './packages/database/src';

async function main() {
  try {
    const servicesCount = await prisma.service.count({
      where: {
        images: {
          isEmpty: false
        }
      }
    });
    
    const productsCount = await prisma.product.count({
      where: {
        images: {
          isEmpty: false
        }
      }
    });

    console.log(`Services with images: ${servicesCount}`);
    console.log(`Products with images: ${productsCount}`);

    const sample = await prisma.service.findFirst({
      where: {
        images: {
          isEmpty: false
        }
      },
      select: { name: true, images: true }
    });
    console.log('Sample service image:', sample);

  } catch (error) {
    console.error('Error verifying images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
