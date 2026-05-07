
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      images: true,
    }
  });

  console.log('--- Services Image Audit ---');
  services.forEach(s => {
    console.log(`Service: ${s.name}`);
    console.log(`Images: ${JSON.stringify(s.images)}`);
    console.log('---');
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
