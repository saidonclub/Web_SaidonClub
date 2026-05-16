import { prisma } from './packages/database/src/client';

async function seedMissingServices() {
  const categories = [
    { slug: 'servicio-educacion-capacitacion', name: 'Educación & Capacitación', description: 'Cursos y talleres para tu crecimiento.' },
    { slug: 'servicio-salud-bienestar', name: 'Salud & Bienestar', description: 'Servicios médicos y de cuidado personal.' },
    { slug: 'servicio-asesoria-legal', name: 'Asesoría Legal', description: 'Expertos en leyes y trámites legales.' },
    { slug: 'servicio-turismo-experiencias', name: 'Turismo & Experiencias', description: 'Viajes y aventuras inolvidables.' },
    { slug: 'servicio-mantenimiento-hogar', name: 'Mantenimiento del Hogar', description: 'Reparaciones y mejoras para tu casa.' }
  ];

  const provider = await prisma.user.findFirst({ where: { role: 'PROVIDER_SERVICES' } });
  if (!provider) {
    console.error('No service provider found. Please seed users first.');
    return;
  }

  for (const catData of categories) {
    const category = await prisma.category.findUnique({ where: { slug: catData.slug } });
    if (!category) continue;

    const count = await prisma.service.count({ where: { categoryId: category.id } });
    if (count === 0) {
      await prisma.service.create({
        data: {
          name: `${catData.name} Premium`,
          description: `Servicio especializado de ${catData.name} con los mejores estándares de calidad en Ecuador.`,
          price: 45.00,
          status: 'ACTIVE',
          categoryId: category.id,
          providerId: provider.id,
          images: [`/images/carousel/carousel_services_1777332847559.png`],
          rating: 5.0,
          isFeatured: true
        }
      });
      console.log(`Created service for ${catData.name}`);
    }
  }
}

seedMissingServices()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
