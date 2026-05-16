import { prisma } from './packages/database/src/client';

async function setupProviderAndServices() {
  let provider = await prisma.user.findFirst({
    where: { role: 'PROVIDER_SERVICES' }
  });

  if (!provider) {
    provider = await prisma.user.create({
      data: {
        email: 'provider_services@saidonclub.com',
        username: 'provider_services_elite',
        role: 'PROVIDER_SERVICES',
        name: 'Servicios Elite Ecuador',
        affiliateCode: 'PROV-SERV-001',
        status: 'ACTIVE'
      }
    });
    console.log('Created provider_services@saidonclub.com');
  }

  const categories = [
    { slug: 'servicio-educacion-capacitacion', name: 'Educación & Capacitación' },
    { slug: 'servicio-salud-bienestar', name: 'Salud & Bienestar' },
    { slug: 'servicio-asesoria-legal', name: 'Asesoría Legal' },
    { slug: 'servicio-turismo-experiencias', name: 'Turismo & Experiencias' },
    { slug: 'servicio-mantenimiento-hogar', name: 'Mantenimiento del Hogar' }
  ];

  for (const catData of categories) {
    const category = await prisma.category.findUnique({ where: { slug: catData.slug } });
    if (!category) {
      console.log(`Category ${catData.slug} not found, skipping.`);
      continue;
    }

    const count = await prisma.service.count({ where: { categoryId: category.id } });
    if (count === 0) {
      await prisma.service.create({
        data: {
          name: `${catData.name} Pro`,
          slug: `${catData.slug}-pro-${Math.floor(Math.random() * 1000)}`,
          description: `Servicio premium de ${catData.name} disponible en todo el Ecuador. Calidad garantizada.`,
          price: 60.00,
          status: 'ACTIVE',
          categoryId: category.id,
          providerId: provider.id,
          images: [`/images/carousel/carousel_services_1777332847559.png`],
          rating: 4.8,
          isFeatured: true
        }
      });
      console.log(`Created service for ${catData.name}`);
    }
  }
}

setupProviderAndServices()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
