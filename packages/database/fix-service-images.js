const { PrismaClient } = require('./src/generated/client_v3');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning up Service Images ---');

  const services = await prisma.service.findMany({
    include: { category: true }
  });

  const categoryMap = {
    'desarrollo-software': '/images/services/tech.png',
    'asesoria-financiera': '/images/services/finance.png',
    'marketing-digital': '/images/services/marketing.png',
    'salud': '/images/services/health.png',
    'srv-asesoría-legal': '/images/services/legal.png',
    'hogar-servicios': '/images/services/home.png',
    'diseno-branding': '/images/services/home.png',
    'mantenimiento': '/images/services/home.png',
  };

  const defaultImage = '/images/services/tech.png';

  for (const service of services) {
    const slug = service.category?.slug;
    const targetImage = categoryMap[slug] || defaultImage;

    console.log(`Updating ${service.name} (${slug}) to ${targetImage}`);

    // Raw SQL update to bypass Prisma client issues and ensure array format
    const imagesSql = `{${targetImage}}`;
    await prisma.$executeRawUnsafe(
      `UPDATE public.services SET images = $1::text[] WHERE id = $2`,
      imagesSql,
      service.id
    );
  }

  console.log('--- Cleanup Completed ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
