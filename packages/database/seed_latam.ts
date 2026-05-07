import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LATAM_COUNTRIES = [
  { name: 'Ecuador', code: 'EC', flag: '🇪🇨', currency: 'USD', phonePrefix: '593' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴', currency: 'COP', phonePrefix: '57' },
  { name: 'Perú', code: 'PE', flag: '🇵🇪', currency: 'PEN', phonePrefix: '51' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷', currency: 'ARS', phonePrefix: '54' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱', currency: 'CLP', phonePrefix: '56' },
  { name: 'México', code: 'MX', flag: '🇲🇽', currency: 'MXN', phonePrefix: '52' },
  { name: 'Panamá', code: 'PA', flag: '🇵🇦', currency: 'PAB', phonePrefix: '507' },
  { name: 'República Dominicana', code: 'DO', flag: '🇩🇴', currency: 'DOP', phonePrefix: '1' },
  { name: 'Costa Rica', code: 'CR', flag: '🇨🇷', currency: 'CRC', phonePrefix: '506' },
  { name: 'Uruguay', code: 'UY', flag: '🇺🇾', currency: 'UYU', phonePrefix: '598' },
  { name: 'Bolivia', code: 'BO', flag: '🇧🇴', currency: 'BOB', phonePrefix: '591' },
  { name: 'Paraguay', code: 'PY', flag: '🇵🇾', currency: 'PYG', phonePrefix: '595' },
];

const ECUADOR_PROVINCES = [
  { name: 'Pichincha', cities: ['Quito', 'Sangolquí', 'Cayambe'] },
  { name: 'Guayas', cities: ['Guayaquil', 'Durán', 'Samborondón', 'Daule'] },
  { name: 'Azuay', cities: ['Cuenca', 'Gualaceo'] },
  { name: 'Manabí', cities: ['Manta', 'Portoviejo', 'Chone'] },
  { name: 'Tungurahua', cities: ['Ambato', 'Baños'] },
  { name: 'Loja', cities: ['Loja', 'Catamayo'] },
  { name: 'Imbabura', cities: ['Ibarra', 'Otavalo'] },
  { name: 'Santo Domingo de los Tsáchilas', cities: ['Santo Domingo'] },
  { name: 'El Oro', cities: ['Machala', 'Pasaje'] },
  { name: 'Los Ríos', cities: ['Quevedo', 'Babahoyo'] },
];

// Muestra de parroquias para Quito y Guayaquil
const QUITO_DISTRICTS = ['Cumbayá', 'Tumbaco', 'Iñaquito', 'La Carolina', 'Carcelén', 'Quitumbe', 'Conocoto', 'Calderón'];
const GUAYAQUIL_DISTRICTS = ['Samborondón', 'Puerto Santa Ana', 'Urdesa', 'Ceibos', 'Vía a la Costa', 'Sauces', 'Alborada'];

async function main() {
  console.log('🚀 Seeding Latin America Geo-Data...');

  for (const countryData of LATAM_COUNTRIES) {
    const country = await prisma.country.upsert({
      where: { code: countryData.code },
      update: countryData,
      create: countryData,
    });
    console.log(`✅ Country: ${country.name}`);

    if (country.code === 'EC') {
      for (const provinceData of ECUADOR_PROVINCES) {
        const province = await prisma.province.upsert({
          where: { name_countryId: { name: provinceData.name, countryId: country.id } },
          update: {},
          create: { name: provinceData.name, countryId: country.id },
        });

        for (const cityName of provinceData.cities) {
          const city = await prisma.city.upsert({
            where: { name_countryId_provinceId: { name: cityName, countryId: country.id, provinceId: province.id } },
            update: {},
            create: { name: cityName, countryId: country.id, provinceId: province.id },
          });

          // Add districts for main cities
          if (cityName === 'Quito') {
            for (const d of QUITO_DISTRICTS) {
              await prisma.district.upsert({
                where: { name_cityId: { name: d, cityId: city.id } },
                update: {},
                create: { name: d, cityId: city.id },
              });
            }
          }
          if (cityName === 'Guayaquil') {
            for (const d of GUAYAQUIL_DISTRICTS) {
              await prisma.district.upsert({
                where: { name_cityId: { name: d, cityId: city.id } },
                update: {},
                create: { name: d, cityId: city.id },
              });
            }
          }
        }
      }
    } else {
      // Create at least the capital for other countries
      const capitalName = getCapital(country.code);
      if (capitalName) {
        await prisma.city.upsert({
          where: { name_countryId_provinceId: { name: capitalName, countryId: country.id, provinceId: null } },
          update: {},
          create: { name: capitalName, countryId: country.id },
        });
      }
    }
  }

  console.log('✨ LatAm Seeding finished.');
}

function getCapital(code: string) {
  const capitals: Record<string, string> = {
    'CO': 'Bogotá',
    'PE': 'Lima',
    'AR': 'Buenos Aires',
    'CL': 'Santiago',
    'MX': 'Ciudad de México',
    'PA': 'Panamá',
    'DO': 'Santo Domingo',
    'CR': 'San José',
    'UY': 'Montevideo',
    'BO': 'La Paz',
    'PY': 'Asunción',
  };
  return capitals[code];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
