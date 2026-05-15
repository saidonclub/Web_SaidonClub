import { prisma } from '../lib/prisma';

async function main() {
  try {
    const services = await prisma.service.findMany({
      take: 10,
      select: {
        slug: true,
        name: true,
        isActive: true
      }
    });
    console.log('--- VALID SLUGS ---');
    console.log(JSON.stringify(services, null, 2));
    console.log('-------------------');
  } catch (error) {
    console.error('Error fetching services:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
