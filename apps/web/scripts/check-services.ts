import { prisma } from '@saidonclub/database';

async function main() {
  const services = await prisma.service.findMany({
    include: {
      category: true,
      provider: true,
    }
  });

  console.log(`Found ${services.length} services.`);
  services.forEach(s => {
    console.log(`- [${s.id}] ${s.name} (${s.category?.name})`);
    console.log(`  Slug: ${s.slug}`);
    console.log(`  Images: ${JSON.stringify(s.images)}`);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
