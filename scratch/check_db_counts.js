const { PrismaClient } = require('../packages/database/src/generated/client');
const prisma = new PrismaClient();

async function main() {
  const serviceCount = await prisma.service.count();
  const productCount = await prisma.product.count();
  const categories = await prisma.category.findMany({
    where: { type: 'SERVICE' },
    include: { _count: { select: { services: true } } }
  });

  console.log('Database Summary:');
  console.log('-----------------');
  console.log(`Total Services: ${serviceCount}`);
  console.log(`Total Products: ${productCount}`);
  
  console.log('\nServices by Category:');
  categories.forEach(c => {
    console.log(`- ${c.name}: ${c._count.services}`);
  });

  const medicalServices = await prisma.service.findMany({
    where: { category: { name: 'Salud' } }
  });

  if (medicalServices.length > 0) {
    console.log('\nSample Medical Service:');
    console.log(`Name: ${medicalServices[0].name}`);
    console.log(`Price: $${medicalServices[0].pricePVP}`);
    console.log(`Saidon Price: $${medicalServices[0].priceSaidon}`);
    console.log(`Discount: ${(1 - medicalServices[0].priceSaidon / medicalServices[0].pricePVP) * 100}%`);
    console.log(`Image: ${medicalServices[0].images[0]}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
