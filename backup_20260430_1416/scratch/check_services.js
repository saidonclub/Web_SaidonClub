const { PrismaClient } = require('../packages/database/src/generated/client');
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({
    where: { category: { slug: 'srv-salud' } },
    select: { name: true, images: true }
  });
  console.log(JSON.stringify(services, null, 2));
}

main().finally(() => prisma.$disconnect());
