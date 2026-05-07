const { prisma } = require('./dist');

async function checkData() {
  try {
    const servicesCount = await prisma.service.count();
    const activeServicesCount = await prisma.service.count({ where: { isActive: true } });
    const productsCount = await prisma.product.count();
    const activeProductsCount = await prisma.product.count({ where: { isActive: true } });

    console.log(`Total Services: ${servicesCount}`);
    console.log(`Active Services: ${activeServicesCount}`);
    console.log(`Total Products: ${productsCount}`);
    console.log(`Active Products: ${activeProductsCount}`);
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
