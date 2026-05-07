import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    where: { type: 'SERVICE' }
  });
  
  const provider = await prisma.user.findFirst({
    where: { role: 'PROVIDER' }
  });

  console.log('--- CATEGORIES ---');
  console.log(JSON.stringify(categories, null, 2));
  console.log('--- PROVIDER ---');
  console.log(JSON.stringify(provider, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
