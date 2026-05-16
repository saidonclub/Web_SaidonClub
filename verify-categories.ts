import { prisma } from './packages/database/src/client';

async function verifyCategories() {
  console.log('--- Verifying Product Categories ---');
  const productCategories = await prisma.category.findMany({
    where: { type: 'PRODUCT' },
    include: { _count: { select: { products: true } } }
  });
  
  for (const cat of productCategories) {
    console.log(`${cat.name} (${cat.slug}): ${cat._count.products} products`);
  }

  console.log('\n--- Verifying Service Categories ---');
  const serviceCategories = await prisma.category.findMany({
    where: { type: 'SERVICE' },
    include: { _count: { select: { services: true } } }
  });
  
  for (const cat of serviceCategories) {
    console.log(`${cat.name} (${cat.slug}): ${cat._count.services} services`);
  }
}

verifyCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
