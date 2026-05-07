
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- CIUDADES ---');
  const cities = await prisma.city.findMany();
  console.log(JSON.stringify(cities, null, 2));

  console.log('\n--- PRODUCTOS ---');
  const products = await prisma.product.findMany({
    include: { city: true }
  });
  console.log(JSON.stringify(products, null, 2));

  console.log('\n--- SERVICIOS ---');
  const services = await prisma.service.findMany({
    include: { city: true }
  });
  console.log(JSON.stringify(services, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
