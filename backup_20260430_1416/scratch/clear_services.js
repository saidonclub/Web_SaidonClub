const { PrismaClient } = require('../packages/database/src/generated/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning services...');
  await prisma.service.deleteMany({});
  console.log('Services cleaned.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
