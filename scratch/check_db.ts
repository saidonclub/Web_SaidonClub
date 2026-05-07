import { PrismaClient } from '../packages/database/src/generated/client_v2';

const prisma = new PrismaClient();

async function checkSeeding() {
  try {
    const countryCount = await prisma.country.count();
    const provinceCount = await prisma.province.count();
    const cityCount = await prisma.city.count();
    const districtCount = await prisma.district.count();

    console.log('Seeding Status:');
    console.log(`- Countries: ${countryCount}`);
    console.log(`- Provinces: ${provinceCount}`);
    console.log(`- Cities: ${cityCount}`);
    console.log(`- Districts: ${districtCount}`);

    if (countryCount > 0) {
      const sampleCountries = await prisma.country.findMany({ take: 5 });
      console.log('Sample Countries:', sampleCountries.map(c => c.name).join(', '));
    }
  } catch (error) {
    console.error('Error checking seeding status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSeeding();
