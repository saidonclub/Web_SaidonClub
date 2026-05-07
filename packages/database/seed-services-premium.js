const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Premium Services Seed ---');

  // 1. Get Cities
  const cities = await prisma.city.findMany();
  const quito = cities.find(c => c.name.includes('Quito')) || cities[0];
  const guayaquil = cities.find(c => c.name.includes('Guayaquil')) || cities[1] || quito;
  const cuenca = cities.find(c => c.name.includes('Cuenca')) || cities[2] || quito;

  // 2. Get/Create Provider User
  const provider = await prisma.user.findFirst({
    where: { email: 'provider@saidonclub.com' }
  });

  if (!provider) {
    console.error('Default provider not found. Please run main seed first.');
    return;
  }

  // 3. Define Categories
  const categoriesData = [
    { name: 'Asesoría Financiera', slug: 'asesoria-financiera', type: 'SERVICE' },
    { name: 'Marketing & Estrategia', slug: 'marketing-digital', type: 'SERVICE' },
    { name: 'Arquitectura & Diseño', slug: 'diseno-branding', type: 'SERVICE' },
    { name: 'Tecnología & Cloud', slug: 'desarrollo-software', type: 'SERVICE' },
    { name: 'Salud & Wellness', slug: 'salud', type: 'SERVICE' },
    { name: 'Legal & Corporativo', slug: 'srv-asesoría-legal', type: 'SERVICE' },
    { name: 'Hogar & Mantenimiento', slug: 'hogar-servicios', type: 'SERVICE' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { type: 'SERVICE' },
      create: cat,
    });
  }

  // 4. Define Services
  const servicesData = [
    // Tech
    {
      name: 'Arquitectura Cloud & IA',
      slug: 'cloud-ia-architecture',
      description: 'Implementación de infraestructuras escalables en la nube con optimización mediante Inteligencia Artificial. Auditoría de seguridad y despliegue continuo.',
      pricePVP: 1200,
      priceSaidon: 950,
      pointsEarned: 450,
      cost: 500,
      categoryId: categories['desarrollo-software'].id,
      images: ['/images/services/tech.png'],
      cityId: quito.id,
    },
    {
      name: 'Desarrollo Web Full-Stack Premium',
      slug: 'fullstack-premium-dev',
      description: 'Creación de plataformas web de alto rendimiento utilizando Next.js, React y Node.js. Diseño UX/UI enfocado en conversión y estética premium.',
      pricePVP: 2500,
      priceSaidon: 1900,
      pointsEarned: 1000,
      cost: 1000,
      categoryId: categories['desarrollo-software'].id,
      images: ['/images/services/tech.png'],
      cityId: quito.id,
    },
    // Finance
    {
      name: 'Gestión de Patrimonios VIP',
      slug: 'wealth-management-vip',
      description: 'Asesoría financiera personalizada para la protección y crecimiento de activos. Estrategias fiscales internacionales y diversificación de cartera.',
      pricePVP: 500,
      priceSaidon: 350,
      pointsEarned: 200,
      cost: 150,
      categoryId: categories['asesoria-financiera'].id,
      images: ['/images/services/finance.png'],
      cityId: guayaquil.id,
    },
    // Marketing
    {
      name: 'Branding & Identidad Corporativa',
      slug: 'branding-identity-luxury',
      description: 'Desarrollo de marca integral para empresas que buscan posicionarse en el sector de lujo. Logotipos, manual de marca y estrategia de comunicación.',
      pricePVP: 800,
      priceSaidon: 600,
      pointsEarned: 300,
      cost: 200,
      categoryId: categories['marketing-digital'].id,
      images: ['/images/services/marketing.png'],
      cityId: guayaquil.id,
    },
    // Health
    {
      name: 'Medicina Concierge 24/7',
      slug: 'concierge-medical-care',
      description: 'Atención médica personalizada y exclusiva con disponibilidad inmediata. Seguimiento proactivo de salud y coordinación de especialistas.',
      pricePVP: 300,
      priceSaidon: 220,
      pointsEarned: 150,
      cost: 100,
      categoryId: categories['salud'].id,
      images: ['/images/services/health.png'],
      cityId: quito.id,
    },
    // Legal
    {
      name: 'Protección de Activos & Legal Tech',
      slug: 'asset-protection-legal',
      description: 'Consultoría legal especializada en la protección de patrimonio familiar y empresarial. Estructuras offshore y cumplimiento normativo internacional.',
      pricePVP: 1500,
      priceSaidon: 1100,
      pointsEarned: 500,
      cost: 400,
      categoryId: categories['srv-asesoría-legal'].id,
      images: ['/images/services/legal.png'],
      cityId: cuenca.id,
    },
    // Home/Arch
    {
      name: 'Diseño de Interiores Inteligentes',
      slug: 'smart-interior-design',
      description: 'Transformación de espacios residenciales con integración de domótica avanzada y estética minimalista de alta gama.',
      pricePVP: 3000,
      priceSaidon: 2400,
      pointsEarned: 1200,
      cost: 1200,
      categoryId: categories['diseno-branding'].id,
      images: ['/images/services/home.png'],
      cityId: quito.id,
    },
    {
      name: 'Mantenimiento Concierge de Propiedades',
      slug: 'property-concierge-maint',
      description: 'Gestión integral y preventiva de residencias de lujo. Electricidad, plomería y climatización con estándares institucionales.',
      pricePVP: 200,
      priceSaidon: 150,
      pointsEarned: 80,
      cost: 50,
      categoryId: categories['hogar-servicios'].id,
      images: ['/images/services/home.png'],
      cityId: guayaquil.id,
    }
  ];

  for (const service of servicesData) {
    const { images, ...serviceWithoutImages } = service;
    
    const upserted = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        ...serviceWithoutImages,
        providerId: provider.id,
        status: 'ACTIVE',
        isActive: true,
      },
      create: {
        ...serviceWithoutImages,
        providerId: provider.id,
        status: 'ACTIVE',
        isActive: true,
      },
    });

    // Manually update images using raw SQL because the Prisma client is stale
    if (images && images.length > 0) {
      const imagesSql = `{${images.join(',')}}`;
      await prisma.$executeRawUnsafe(
        `UPDATE public.services SET images = $1::text[] WHERE id = $2`,
        imagesSql,
        upserted.id
      );
    }

    console.log(`Synced service: ${service.name}`);
  }

  console.log('--- Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
