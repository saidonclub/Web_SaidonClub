// ============================================================
// SEED OMEGA — SaidonClub Marketplace Data
// Usa client_v3 (ruta correcta desde schema.prisma)
// Ejecutar: pnpm --filter @saidonclub/database db:seed-omega
// ============================================================

import { PrismaClient } from '../src/generated/client_v3';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 SEED OMEGA — Iniciando población del marketplace...');

  // ─── GEOGRAFÍA ─────────────────────────────────────────────
  let country = await prisma.country.findFirst({ where: { code: 'EC' } });
  if (!country) {
    country = await prisma.country.create({
      data: { name: 'Ecuador', code: 'EC', currency: 'USD', phonePrefix: '+593' },
    });
    console.log('🌍 País Ecuador creado');
  } else {
    console.log('🌍 País Ecuador ya existe');
  }

  const cityNames = ['Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Loja'];
  const cityMap: Record<string, string> = {};

  for (const cityName of cityNames) {
    let city = await prisma.city.findFirst({
      where: { name: cityName, countryId: country.id },
    });
    if (!city) {
      city = await prisma.city.create({
        data: { name: cityName, countryId: country.id },
      });
    }
    cityMap[cityName] = city.id;
  }
  console.log(`🏙️  ${Object.keys(cityMap).length} ciudades listas`);

  // ─── PROVEEDORES ──────────────────────────────────────────
  const providerData = [
    { name: 'Saidon Tech Solutions', email: 'provider.uio@saidonclub.com', city: 'Quito' },
    { name: 'Urban Style Imports', email: 'provider.gye@saidonclub.com', city: 'Guayaquil' },
    { name: 'Hogar Diseño Cuenca', email: 'provider.cue@saidonclub.com', city: 'Cuenca' },
    { name: 'Outdoor Adventure Manta', email: 'provider.man@saidonclub.com', city: 'Manta' },
    { name: 'Gourmet Selection Loja', email: 'provider.loja@saidonclub.com', city: 'Loja' },
  ];

  const providerMap: Record<string, string> = {};
  for (const p of providerData) {
    let provider = await prisma.user.findUnique({ where: { email: p.email } });
    if (!provider) {
      const username = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30);
      const affiliateCode = `PROV-${p.city.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      try {
        provider = await prisma.user.create({
          data: {
            email: p.email,
            username,
            name: p.name,
            role: 'PROVIDER' as any,
            affiliateCode,
            cityId: cityMap[p.city],
          },
        });
        console.log(`👤 Proveedor ${p.name} creado`);
      } catch (e: any) {
        // Si el affiliateCode o username colisiona, intentar con uno diferente
        provider = await prisma.user.upsert({
          where: { email: p.email },
          update: {},
          create: {
            email: p.email,
            username: `${username}_${Date.now().toString().slice(-6)}`,
            name: p.name,
            role: 'PROVIDER' as any,
            affiliateCode: `P-${Date.now()}`,
            cityId: cityMap[p.city],
          },
        });
      }
    }
    providerMap[p.name] = provider.id;
  }

  // ─── CATEGORÍAS ───────────────────────────────────────────
  const categorySlugs = [
    { name: 'Tecnología & Innovación', slug: 'tecnologia-innovacion' },
    { name: 'Moda & Calzado', slug: 'moda-calzado' },
    { name: 'Hogar & Electrodomésticos', slug: 'hogar-electrodomesticos' },
    { name: 'Salud & Cuidado Personal', slug: 'salud-cuidado-personal' },
    { name: 'Deporte & Aventura', slug: 'deporte-aventura' },
    { name: 'Relojería & Joyería', slug: 'relojeria-joyeria' },
    { name: 'Gastronomía Gourmet', slug: 'gastronomia-gourmet' },
    { name: 'Accesorios de Viaje', slug: 'accesorios-viaje' },
    { name: 'Arte & Coleccionables', slug: 'arte-coleccionables' },
    { name: 'Mascotas Premium', slug: 'mascotas-premium' },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categorySlugs) {
    const existing = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug, type: 'PRODUCT' as any },
    });
    catMap[cat.slug] = existing.id;
  }
  console.log(`🏷️  ${Object.keys(catMap).length} categorías listas`);

  // ─── PRODUCTOS ────────────────────────────────────────────
  const productsData = [
    {
      code: 'SAID-PREM-001',
      slug: 'apple-iphone-15-pro-max-256gb',
      category: 'tecnologia-innovacion',
      name: 'Apple iPhone 15 Pro Max 256GB - Titanium Natural',
      description: 'El smartphone más avanzado de Apple. Fabricado en titanio aeroespacial con chip A17 Pro, cámara de 48MP y zoom óptico 5x. Pantalla Super Retina XDR de 6.7".',
      pricePVP: 1549, provider: 'Saidon Tech Solutions', city: 'Quito',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000', 'https://images.unsplash.com/photo-1695048132865-ec1375d31562?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-002',
      slug: 'nike-air-force-1-07-premium',
      category: 'moda-calzado',
      name: 'Nike Air Force 1 \'07 Premium - Edición Clásica',
      description: 'La leyenda sigue viva con las Nike Air Force 1 \'07. Revestimientos con costuras duraderas, acabados impecables y la cantidad perfecta de destello.',
      pricePVP: 145, provider: 'Urban Style Imports', city: 'Guayaquil',
      images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-003',
      slug: 'freidora-ninja-foodi-6in1-dual',
      category: 'hogar-electrodomesticos',
      name: 'Freidora de Aire Ninja Foodi 6-in-1 Dual Basket',
      description: 'Cocina dos alimentos de dos maneras diferentes y termina al mismo tiempo. Con tecnología DualZone, hasta 75% menos grasa. Capacidad 8 cuartos.',
      pricePVP: 249, provider: 'Hogar Diseño Cuenca', city: 'Cuenca',
      images: ['https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1000', 'https://images.unsplash.com/photo-1632233033502-df49f05a96ca?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-004',
      slug: 'set-skincare-la-roche-posay-effaclar',
      category: 'salud-cuidado-personal',
      name: 'Set Skincare La Roche-Posay Effaclar - Rutina Completa',
      description: 'Kit dermatológico para pieles grasas con tendencia acneica. Incluye Gel Limpiador, Tónico Astringente y Tratamiento Effaclar Duo+. Reduce imperfecciones.',
      pricePVP: 85, provider: 'Saidon Tech Solutions', city: 'Quito',
      images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-005',
      slug: 'garmin-fenix-7x-sapphire-solar',
      category: 'deporte-aventura',
      name: 'Garmin Fenix 7X Sapphire Solar - Smartwatch GPS',
      description: 'El reloj multideporte definitivo con carga solar y lente de zafiro. Mapas TopoActive, linterna LED y autonomía de hasta 37 días. Ideal para triatlón y trail.',
      pricePVP: 899, provider: 'Outdoor Adventure Manta', city: 'Manta',
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000', 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-006',
      slug: 'rolex-submariner-date-oystersteel-41mm',
      category: 'relojeria-joyeria',
      name: 'Rolex Submariner Date - Acero Oystersteel 41mm',
      description: 'El reloj de buceo de referencia desde 1953. Esfera negra y bisel Cerachrom giratorio. Movimiento calibre 3235. Símbolo de precisión y elegancia atemporal.',
      pricePVP: 12500, provider: 'Saidon Tech Solutions', city: 'Quito',
      images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000', 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-007',
      slug: 'cafe-especialidad-saidon-selection-loja',
      category: 'gastronomia-gourmet',
      name: 'Café de Especialidad Saidon Selection - Loja Edition',
      description: 'Café de altura cultivado a 1.900 msnm en Loja, Ecuador. Notas de chocolate negro y cítricos dulces. Tostado artesanal. Calificación 88 puntos SCA.',
      pricePVP: 22, provider: 'Gourmet Selection Loja', city: 'Loja',
      images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-008',
      slug: 'maleta-rimowa-original-cabin-aluminio',
      category: 'accesorios-viaje',
      name: 'Maleta Rimowa Original Cabin - Aluminio Anodizado',
      description: 'La maleta de aluminio más icónica del mundo. Fabricada en Colonia, Alemania para durar toda la vida. Sistema Multiwheel® y cierres TSA. Elegancia absoluta.',
      pricePVP: 1150, provider: 'Urban Style Imports', city: 'Guayaquil',
      images: ['https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?q=80&w=1000', 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-009',
      slug: 'lego-icons-titanic-9090-piezas',
      category: 'arte-coleccionables',
      name: 'Set LEGO Icons - Titanic (9,090 Piezas)',
      description: 'Uno de los modelos LEGO más grandes jamás creados. Réplica a escala 1:200. Incluye secciones con comedor de primera clase y la gran escalera icónica.',
      pricePVP: 799, provider: 'Saidon Tech Solutions', city: 'Quito',
      images: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=1000', 'https://images.unsplash.com/photo-1513364776144-60967b0f80df?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-010',
      slug: 'localizador-gps-tractive-perros-lte',
      category: 'mascotas-premium',
      name: 'Localizador GPS Tractive para Perros - Versión LTE',
      description: 'Seguimiento en tiempo real sin límite de distancia en más de 175 países. Define zonas seguras y recibe alertas. Resistente al agua, 7 días de batería.',
      pricePVP: 55, provider: 'Outdoor Adventure Manta', city: 'Manta',
      images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000', 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-011',
      slug: 'macbook-pro-14-m3-max-space-black',
      category: 'tecnologia-innovacion',
      name: 'MacBook Pro 14 M3 Max - Space Black',
      description: 'La laptop más potente para creativos. Chip M3 Max, 36GB memoria unificada, 1TB SSD. Pantalla Liquid Retina XDR ProMotion. Rendimiento extremo.',
      pricePVP: 3499, provider: 'Saidon Tech Solutions', city: 'Quito',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000', 'https://images.unsplash.com/photo-1611186871348-b1ec696e523f?q=80&w=1000'],
    },
    {
      code: 'SAID-PREM-012',
      slug: 'chaqueta-cuero-premium-the-rebel',
      category: 'moda-calzado',
      name: "Chaqueta de Cuero Premium 'The Rebel'",
      description: 'Confeccionada con cuero italiano de primera calidad. Forro de seda, cremalleras YKK y corte perfecto. Estilo atemporal para el aventurero urbano.',
      pricePVP: 850, provider: 'Urban Style Imports', city: 'Guayaquil',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000', 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1000'],
    },
  ];

  let createdProducts = 0;
  for (const p of productsData) {
    const pricePVP = p.pricePVP;
    const priceSaidon = pricePVP * 0.92;
    const cost = priceSaidon * 0.75;
    const margin = priceSaidon - cost;
    const pointsEarned = pricePVP * 0.12;

    await prisma.product.upsert({
      where: { code: p.code },
      update: {
        isActive: true,
        status: 'APPROVED' as any,
        name: p.name,
        images: p.images,
        slug: p.slug,
      },
      create: {
        code: p.code,
        name: p.name,
        description: p.description,
        slug: p.slug,
        pricePVP,
        priceSaidon,
        pointsEarned,
        cost,
        margin,
        stock: 25 + Math.floor(Math.random() * 50),
        categoryId: catMap[p.category],
        providerId: providerMap[p.provider],
        cityId: cityMap[p.city],
        status: 'APPROVED' as any,
        isActive: true,
        images: p.images,
        videos: [],
        options: [],
      },
    });
    createdProducts++;
  }
  console.log(`📦 ${createdProducts} productos procesados (upsert activo)`);

  // ─── CATEGORÍAS DE SERVICIOS ──────────────────────────────
  const serviceCategoriesData = [
    { name: 'Asesoría Financiera', slug: 'servicio-asesoria-financiera' },
    { name: 'Transformación Digital', slug: 'servicio-transformacion-digital' },
    { name: 'Arquitectura & Diseño', slug: 'servicio-arquitectura-diseno' },
  ];
  const svcCatMap: Record<string, string> = {};
  for (const sc of serviceCategoriesData) {
    const existing = await prisma.category.upsert({
      where: { slug: sc.slug },
      update: {},
      create: { name: sc.name, slug: sc.slug, type: 'SERVICE' as any },
    });
    svcCatMap[sc.slug] = existing.id;
  }

  // ─── SERVICIOS ─────────────────────────────────────────────
  const servicesData = [
    {
      code: 'SERV-OMEGA-001',
      slug: 'asesoria-financiera-patrimonial-elite',
      name: 'Asesoría Financiera & Patrimonial Elite',
      description: 'Planificación integral de activos, optimización fiscal internacional y gestión de legados para individuos de alto patrimonio. Sesiones privadas con expertos.',
      pricePVP: 500, priceSaidon: 420, points: 100,
      category: 'servicio-asesoria-financiera',
      provider: 'Saidon Tech Solutions', city: 'Quito',
      images: ['https://images.unsplash.com/photo-1591696208162-a977affd1743?q=80&w=1000', 'https://images.unsplash.com/photo-1454165833767-02a698d5874c?q=80&w=1000'],
      location: 'Av. de los Shyris N34-40, Edificio Spectrum, Quito',
    },
    {
      code: 'SERV-OMEGA-002',
      slug: 'transformacion-digital-ia-negocios',
      name: 'Transformación Digital & IA para Negocios',
      description: 'Implementación de ecosistemas de IA, automatización de procesos y estrategias de crecimiento digital basadas en datos. Lleva tu empresa al siguiente nivel.',
      pricePVP: 1200, priceSaidon: 980, points: 250,
      category: 'servicio-transformacion-digital',
      provider: 'Urban Style Imports', city: 'Guayaquil',
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000', 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1000'],
      location: 'Puerto Santa Ana, Edificio The Point, Piso 15, Guayaquil',
    },
    {
      code: 'SERV-OMEGA-003',
      slug: 'arquitectura-bioclimatica-diseno-lujo',
      name: 'Arquitectura Bioclimática & Diseño de Lujo',
      description: 'Diseño de espacios que fusionan vanguardia con sostenibilidad ambiental. Proyectos residenciales y comerciales de alta gama en el corazón de Cuenca.',
      pricePVP: 2500, priceSaidon: 2100, points: 500,
      category: 'servicio-arquitectura-diseno',
      provider: 'Hogar Diseño Cuenca', city: 'Cuenca',
      images: ['https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1000', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000'],
      location: 'Calle Larga y Borrero, Centro Histórico, Cuenca',
    },
  ];

  let createdServices = 0;
  for (const s of servicesData) {
    const existingSvc = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (existingSvc) {
      await prisma.service.update({
        where: { slug: s.slug },
        data: { isActive: true, status: 'APPROVED' as any },
      });
      continue;
    }
    await prisma.service.create({
      data: {
        code: s.code,
        name: s.name,
        description: s.description,
        slug: s.slug,
        pricePVP: s.pricePVP,
        priceSaidon: s.priceSaidon,
        pointsEarned: s.points,
        cost: s.priceSaidon * 0.6,
        categoryId: svcCatMap[s.category],
        providerId: providerMap[s.provider],
        cityId: cityMap[s.city],
        status: 'APPROVED' as any,
        isActive: true,
        location: s.location,
        images: s.images,
        videos: [],
      },
    });
    createdServices++;
  }
  console.log(`🛠️  ${createdServices} servicios nuevos creados`);

  // ─── RESUMEN ─────────────────────────────────────────────
  const totalProducts = await prisma.product.count({ where: { isActive: true } });
  const totalServices = await prisma.service.count({ where: { isActive: true } });
  console.log(`\n✅ SEED OMEGA COMPLETADO`);
  console.log(`📊 Marketplace activo: ${totalProducts} productos | ${totalServices} servicios`);
}

main()
  .catch((e) => {
    console.error('❌ Error en Seed Omega:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
