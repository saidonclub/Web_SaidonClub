const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const provinces = await prisma.province.findMany();
    console.log('Provinces found:', provinces.length);
  } catch (e) {
    console.error('Error querying province:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
