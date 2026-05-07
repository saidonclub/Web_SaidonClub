import { PrismaClient } from './src/generated/client_v2';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando carga masiva de datos geográficos para Latinoamérica...');

  const dataDir = path.join(__dirname, 'data');
  
  // 1. Cargar Países
  const countries = JSON.parse(fs.readFileSync(path.join(dataDir, 'latam_countries.json'), 'utf8'));
  console.log(`🌍 Cargando ${countries.length} países...`);
  
  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.iso2 },
      update: {
        name: c.name,
        currency: c.currency || 'USD',
        phonePrefix: c.phonecode,
        flag: c.emoji,
        lat: parseFloat(c.latitude) || null,
        lon: parseFloat(c.longitude) || null,
        isActive: true,
      },
      create: {
        name: c.name,
        code: c.iso2,
        currency: c.currency || 'USD',
        phonePrefix: c.phonecode,
        flag: c.emoji,
        lat: parseFloat(c.latitude) || null,
        lon: parseFloat(c.longitude) || null,
        isActive: true,
      },
    });
  }

  // Mapeo de IDs de JSON a IDs de DB para relaciones
  const dbCountries = await prisma.country.findMany();
  const countryMap = new Map(dbCountries.map(c => [c.code, c.id]));

  // 2. Cargar Estados/Provincias
  const states = JSON.parse(fs.readFileSync(path.join(dataDir, 'latam_states.json'), 'utf8'));
  console.log(`🏞️ Cargando ${states.length} provincias/estados...`);
  
  for (const s of states) {
    const countryId = countryMap.get(s.country_code);
    if (!countryId) continue;

    await prisma.province.upsert({
      where: { name_countryId: { name: s.name, countryId } },
      update: {
        lat: parseFloat(s.latitude) || null,
        lon: parseFloat(s.longitude) || null,
        isActive: true,
      },
      create: {
        name: s.name,
        countryId,
        lat: parseFloat(s.latitude) || null,
        lon: parseFloat(s.longitude) || null,
        isActive: true,
      },
    });
  }

  // Mapeo de Provincias
  const dbProvinces = await prisma.province.findMany();
  const provinceMap = new Map(dbProvinces.map(p => [`${p.name}-${p.countryId}`, p.id]));

  // 3. Cargar Ciudades (Por lotes para rendimiento)
  const citiesRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'latam_cities.json'), 'utf8'));
  console.log(`🏙️ Procesando ${citiesRaw.length} ciudades...`);

  // Filtramos ciudades duplicadas en el JSON antes de procesar
  const seenCities = new Set();
  const citiesToInsert = citiesRaw.filter((c: any) => {
    const countryId = countryMap.get(c.country_code);
    if (!countryId) return false;
    const provinceId = provinceMap.get(`${c.state_name}-${countryId}`);
    const key = `${c.name}-${countryId}-${provinceId || 'none'}`;
    if (seenCities.has(key)) return false;
    seenCities.add(key);
    return true;
  });

  console.log(`📦 Insertando ${citiesToInsert.length} ciudades únicas...`);

  // Usamos un bucle con upsert para evitar errores de duplicados si se corre de nuevo
  // Procesamos en trozos de 100 para no saturar la conexión
  const chunkSize = 100;
  for (let i = 0; i < citiesToInsert.length; i += chunkSize) {
    const chunk = citiesToInsert.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (c: any) => {
      const countryId = countryMap.get(c.country_code);
      if (!countryId) return;
      const provinceId = provinceMap.get(`${c.state_name}-${countryId}`) || null;

      try {
        await prisma.city.upsert({
          where: { 
            name_countryId_provinceId: { 
              name: c.name, 
              countryId, 
              provinceId 
            } 
          },
          update: {
            lat: parseFloat(c.latitude) || null,
            lon: parseFloat(c.longitude) || null,
            isActive: true,
          },
          create: {
            name: c.name,
            countryId,
            provinceId,
            lat: parseFloat(c.latitude) || null,
            lon: parseFloat(c.longitude) || null,
            isActive: true,
          },
        });
      } catch (err) {
        // Ignorar errores puntuales de duplicidad o FK
      }
    }));
    if (i % 1000 === 0) console.log(`... ${i} ciudades procesadas`);
  }

  // 4. Cargar Sectores/Parroquias (Muestra profesional para capitales)
  console.log('🏘️ Cargando sectores y parroquias estratégicas...');
  
  const strategicDistricts: any = {
    'Quito': ['Cumbayá', 'Tumbaco', 'Iñaquito', 'La Carolina', 'Carcelén', 'Quitumbe', 'Conocoto', 'Calderón', 'Pomasqui', 'San Rafael'],
    'Guayaquil': ['Samborondón', 'Puerto Santa Ana', 'Urdesa', 'Ceibos', 'Vía a la Costa', 'Sauces', 'Alborada', 'Kenndy', 'Puerto Azul'],
    'Bogotá': ['Chapinero', 'Usaquén', 'Suba', 'Fontibón', 'Engativá', 'Teusaquillo', 'Kennedy', 'Bosa'],
    'Lima': ['Miraflores', 'San Isidro', 'Barranco', 'Surco', 'La Molina', 'San Borja', 'Lince', 'Magdalena'],
    'Buenos Aires': ['Palermo', 'Recoleta', 'Puerto Madero', 'Belgrano', 'Caballito', 'San Telmo', 'Villa Crespo'],
    'Santiago': ['Las Condes', 'Providencia', 'Vitacura', 'Lo Barnechea', 'Ñuñoa', 'Santiago Centro'],
    'Ciudad de México': ['Polanco', 'Condesa', 'Roma Norte', 'Santa Fe', 'Coyoacán', 'Tlalpan', 'Interlomas'],
  };

  for (const [cityName, districts] of Object.entries(strategicDistricts)) {
    const city = await prisma.city.findFirst({ where: { name: cityName } });
    if (city) {
      for (const dName of districts as string[]) {
        await prisma.district.upsert({
          where: { name_cityId: { name: dName, cityId: city.id } },
          update: { isActive: true },
          create: { name: dName, cityId: city.id, isActive: true },
        });
      }
    }
  }

  console.log('✨ ¡Carga completa y profesional de Latinoamérica finalizada!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
