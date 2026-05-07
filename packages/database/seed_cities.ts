import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding more cities...');

  const ecuador = await prisma.country.findFirst({
    where: { code: 'EC' }
  });

  if (!ecuador) {
    console.error('Ecuador not found. Run the main seed first.');
    return;
  }

  const cities = [
    { name: 'Guayaquil', countryId: ecuador.id },
    { name: 'Cuenca', countryId: ecuador.id },
    { name: 'Ambato', countryId: ecuador.id },
    { name: 'Manta', countryId: ecuador.id },
    { name: 'Ibarra', countryId: ecuador.id },
    { name: 'Loja', countryId: ecuador.id },
    { name: 'Santo Domingo', countryId: ecuador.id },
    { name: 'Portoviejo', countryId: ecuador.id },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name_countryId: { name: city.name, countryId: city.countryId } },
      update: {},
      create: city
    });
    console.log(`- ${city.name} created/updated`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
