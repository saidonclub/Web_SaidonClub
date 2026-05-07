const path = require('path');
const { PrismaClient } = require(path.join(process.cwd(), 'packages/database/src/generated/client'));

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding locations...');

  // 1. Countries
  const countriesData = [
    { code: 'EC', name: 'Ecuador', phonePrefix: '+593', flag: '🇪🇨', lat: -1.8312, lon: -78.1834 },
    { code: 'CO', name: 'Colombia', phonePrefix: '+57', flag: '🇨🇴', lat: 4.5709, lon: -74.2973 },
    { code: 'PE', name: 'Perú', phonePrefix: '+51', flag: '🇵🇪', lat: -9.19, lon: -75.0152 },
    { code: 'AR', name: 'Argentina', phonePrefix: '+54', flag: '🇦🇷', lat: -38.4161, lon: -63.6167 },
    { code: 'CL', name: 'Chile', phonePrefix: '+56', flag: '🇨🇱', lat: -35.6751, lon: -71.543 },
    { code: 'MX', name: 'México', phonePrefix: '+52', flag: '🇲🇽', lat: 23.6345, lon: -102.5528 },
    { code: 'ES', name: 'España', phonePrefix: '+34', flag: '🇪🇸', lat: 40.4637, lon: -3.7492 },
    { code: 'US', name: 'Estados Unidos', phonePrefix: '+1', flag: '🇺🇸', lat: 37.0902, lon: -95.7129 },
  ];

  for (const c of countriesData) {
    await prisma.country.upsert({
      where: { name: c.name },
      update: c,
      create: c,
    });
  }

  const ecuador = await prisma.country.findUnique({ where: { name: 'Ecuador' } });

  if (!ecuador) return;

  // 2. Ecuador Provinces & Capitals (Cities)
  const ecuadorData = [
    { province: 'Azuay', capital: 'Cuenca', lat: -2.9001, lon: -79.0059 },
    { province: 'Bolívar', capital: 'Guaranda', lat: -1.5926, lon: -79.001 },
    { province: 'Cañar', capital: 'Azogues', lat: -2.7397, lon: -78.8486 },
    { province: 'Carchi', capital: 'Tulcán', lat: 0.8119, lon: -77.7173 },
    { province: 'Chimborazo', capital: 'Riobamba', lat: -1.6709, lon: -78.6477 },
    { province: 'Cotopaxi', capital: 'Latacunga', lat: -0.9316, lon: -78.6143 },
    { province: 'El Oro', capital: 'Machala', lat: -3.2581, lon: -79.9605 },
    { province: 'Esmeraldas', capital: 'Esmeraldas', lat: 0.9682, lon: -79.6517 },
    { province: 'Galápagos', capital: 'Puerto Baquerizo Moreno', lat: -0.9016, lon: -89.6102 },
    { province: 'Guayas', capital: 'Guayaquil', lat: -2.1894, lon: -79.8891 },
    { province: 'Imbabura', capital: 'Ibarra', lat: 0.3517, lon: -78.1222 },
    { province: 'Loja', capital: 'Loja', lat: -3.9931, lon: -79.2042 },
    { province: 'Los Ríos', capital: 'Babahoyo', lat: -1.8022, lon: -79.5344 },
    { province: 'Manabí', capital: 'Portoviejo', lat: -1.0545, lon: -80.4544 },
    { province: 'Morona Santiago', capital: 'Macas', lat: -2.3087, lon: -78.1114 },
    { province: 'Napo', capital: 'Tena', lat: -0.9938, lon: -77.8129 },
    { province: 'Orellana', capital: 'Puerto Francisco de Orellana', lat: -0.4665, lon: -76.9872 },
    { province: 'Pastaza', capital: 'Puyo', lat: -1.4837, lon: -77.9991 },
    { province: 'Pichincha', capital: 'Quito', lat: -0.1807, lon: -78.4678 },
    { province: 'Santa Elena', capital: 'Santa Elena', lat: -2.2262, lon: -80.8584 },
    { province: 'Santo Domingo de los Tsáchilas', capital: 'Santo Domingo', lat: -0.253, lon: -79.1754 },
    { province: 'Sucumbíos', capital: 'Nueva Loja', lat: 0.0847, lon: -76.8828 },
    { province: 'Tungurahua', capital: 'Ambato', lat: -1.2491, lon: -78.6167 },
    { province: 'Zamora Chinchipe', capital: 'Zamora', lat: -4.0692, lon: -78.9567 },
  ];

  for (const data of ecuadorData) {
    const province = await prisma.province.upsert({
      where: { name_countryId: { name: data.province, countryId: ecuador.id } },
      update: { lat: data.lat, lon: data.lon },
      create: { name: data.province, countryId: ecuador.id, lat: data.lat, lon: data.lon },
    });

    const city = await prisma.city.upsert({
      where: { name_countryId_provinceId: { name: data.capital, countryId: ecuador.id, provinceId: province.id } },
      update: { lat: data.lat, lon: data.lon },
      create: { name: data.capital, countryId: ecuador.id, provinceId: province.id, lat: data.lat, lon: data.lon },
    });

    // Add some districts for Quito
    if (data.capital === 'Quito') {
      const districts = [
        { name: 'Cumbayá', lat: -0.201, lon: -78.434 },
        { name: 'Tumbaco', lat: -0.212, lon: -78.402 },
        { name: 'Carcelén', lat: -0.098, lon: -78.481 },
        { name: 'El Condado', lat: -0.115, lon: -78.502 },
        { name: 'Calderón', lat: -0.095, lon: -78.432 },
        { name: 'Centro Histórico', lat: -0.22, lon: -78.512 },
        { name: 'La Carolina', lat: -0.18, lon: -78.484 },
        { name: 'Villa Flora', lat: -0.245, lon: -78.525 },
        { name: 'Chillogallo', lat: -0.285, lon: -78.555 },
      ];
      for (const d of districts) {
        await prisma.district.upsert({
          where: { name_cityId: { name: d.name, cityId: city.id } },
          update: { lat: d.lat, lon: d.lon },
          create: { name: d.name, cityId: city.id, lat: d.lat, lon: d.lon },
        });
      }
    }
  }

  console.log('Location seeding complete!');
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
