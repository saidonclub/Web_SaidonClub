import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const countries = await prisma.country.findMany();
    console.log('Countries count:', countries.length);
    if (countries.length > 0) {
      console.log('First country:', countries[0].name);
    }
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
