import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const root = await prisma.user.findUnique({
    where: { email: 'root@saidonclub.com' }
  });
  console.log(JSON.stringify(root, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
