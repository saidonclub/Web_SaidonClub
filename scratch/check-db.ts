import { PrismaClient } from '../packages/database/src/generated/client_v2';

async function main() {
  const prisma = new PrismaClient();
  try {
    const productsCount = await prisma.product.count();
    const servicesCount = await prisma.service.count();
    const categoriesCount = await prisma.category.count();
    const usersCount = await prisma.user.count();

    console.log('--- DB Connection Check ---');
    console.log(`Products: ${productsCount}`);
    console.log(`Services: ${servicesCount}`);
    console.log(`Categories: ${categoriesCount}`);
    console.log(`Users: ${usersCount}`);
    
    if (categoriesCount === 0) {
      console.log('WARNING: No categories found. Marketplace needs categories to function.');
    }
    
  } catch (error) {
    console.error('ERROR connecting to DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
