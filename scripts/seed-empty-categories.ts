import { prisma } from '../packages/database/src/client';

async function main() {
  console.log('🌱 Starting Seeding for Empty Categories...');

  // 1. Target Categories definitions
  const targetCategories = [
    {
      id: '6e7a40f7-21ae-4d29-bae7-5854601390f1',
      name: 'Educación & Capacitación',
      service: {
        name: 'Programa de Mentoría en Liderazgo y Alta Dirección',
        slug: 'mentoria-liderazgo-alta-direccion',
        description: 'Un programa educativo exclusivo diseñado para fundadores, CEOs y directivos de alto nivel. Aprenda estrategias de escalamiento, toma de decisiones críticas y gestión de equipos globales.',
        pricePVP: 2500.00,
        priceSaidon: 1950.00,
        pointsEarned: 750.00,
        cost: 1000.00,
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
        cityId: '6a244390-b41e-4e6f-99d1-8ca2865e72ac' // Quito
      }
    },
    {
      id: '0ac27397-5b44-4b8e-8516-76aec89e9752',
      name: 'Salud & Bienestar',
      service: {
        name: 'Membresía Wellness & Spa Premium',
        slug: 'membresia-wellness-spa-premium',
        description: 'Acceso ilimitado a nuestro santuario de bienestar. Incluye sesiones personalizadas de yoga, masajes terapéuticos, terapias de sauna infrarrojo y asesoría nutricional semanal.',
        pricePVP: 450.00,
        priceSaidon: 360.00,
        pointsEarned: 120.00,
        cost: 180.00,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000',
        cityId: '3e0353c5-7c52-46ce-86b2-e7b788c21c4e' // Guayaquil
      }
    },
    {
      id: '227691c6-6355-4b6c-8b9e-3bce44099adc',
      name: 'Asesoría Legal',
      service: {
        name: 'Constitución de Fideicomisos y Protección de Activos',
        slug: 'fideicomisos-proteccion-activos',
        description: 'Asesoría legal corporativa especializada para la estructuración y protección legal de patrimonios familiares y empresariales en Ecuador y jurisdicciones internacionales.',
        pricePVP: 1800.00,
        priceSaidon: 1450.00,
        pointsEarned: 550.00,
        cost: 600.00,
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000',
        cityId: '03af2972-061e-467f-bb12-08c4e5a5b387' // Cuenca
      }
    },
    {
      id: 'e2bbd3eb-b4ab-4d79-ac06-10a02ad2e280',
      name: 'Turismo & Experiencias',
      service: {
        name: 'Glamping de Lujo en Galápagos & Tours Privados',
        slug: 'glamping-lujo-galapagos-privado',
        description: 'Viva una experiencia inmersiva única en el archipiélago de Galápagos. Alojamiento en domos de lujo ecológicos, excursiones de snorkel guiadas y cena gourmet privada bajo las estrellas.',
        pricePVP: 3500.00,
        priceSaidon: 2850.00,
        pointsEarned: 1100.00,
        cost: 1500.00,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
        cityId: '6a244390-b41e-4e6f-99d1-8ca2865e72ac' // Quito
      }
    },
    {
      id: '9af05f17-5393-4192-bc24-29c6e6ce3185',
      name: 'Mantenimiento del Hogar',
      service: {
        name: 'Mantenimiento Preventivo Residencial VIP',
        slug: 'mantenimiento-preventivo-residencial',
        description: 'Inspección y mantenimiento completo bimestral para su hogar: revisión de instalaciones eléctricas con termografía, plomería preventiva, limpieza de sistemas de climatización y retoques estéticos.',
        pricePVP: 290.00,
        priceSaidon: 220.00,
        pointsEarned: 70.00,
        cost: 100.00,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1000',
        cityId: '6a244390-b41e-4e6f-99d1-8ca2865e72ac' // Quito
      }
    }
  ];

  // 2. Identify the service provider
  const provider = await prisma.user.findFirst({
    where: { email: 'provider_services@saidonclub.com' }
  });

  if (!provider) {
    throw new Error('Provider user provider_services@saidonclub.com not found. Seed user first.');
  }

  console.log(`Using provider: ${provider.name} (${provider.id})`);

  for (const item of targetCategories) {
    const category = await prisma.category.findUnique({
      where: { id: item.id }
    });

    if (!category) {
      console.warn(`Category not found: ${item.name} (${item.id}). Skipping...`);
      continue;
    }

    console.log(`Processing category: ${category.name}...`);

    // Create or update service
    const s = item.service;
    const upserted = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        pricePVP: s.pricePVP,
        priceSaidon: s.priceSaidon,
        pointsEarned: s.pointsEarned,
        cost: s.cost,
        categoryId: category.id,
        providerId: provider.id,
        cityId: s.cityId,
        status: 'ACTIVE',
        isActive: true
      },
      create: {
        name: s.name,
        description: s.description,
        slug: s.slug,
        pricePVP: s.pricePVP,
        priceSaidon: s.priceSaidon,
        pointsEarned: s.pointsEarned,
        cost: s.cost,
        categoryId: category.id,
        providerId: provider.id,
        cityId: s.cityId,
        status: 'ACTIVE',
        isActive: true
      }
    });

    console.log(`✅ Upserted service: ${upserted.name} (Slug: ${upserted.slug})`);

    // Use raw SQL to set images to avoid Prisma client out-of-sync array mapping issues
    const imagesSql = `{${s.image}}`;
    await prisma.$executeRawUnsafe(
      `UPDATE public.services SET images = $1::text[] WHERE id = $2`,
      imagesSql,
      upserted.id
    );
    console.log(`   └─ Set image successfully.`);
  }

  console.log('🎉 Seeding empty categories completed successfully!');
}

main()
  .catch(err => {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
