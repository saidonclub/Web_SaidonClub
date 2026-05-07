const { PrismaClient } = require('../packages/database/src/generated/client');
const prisma = new PrismaClient();

const serviceImageMap = {
  'srv-plomeria': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1504148455328-4972bbfdf05d?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-electricidad': [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1558210834-473f430c09ac?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-asesoria-legal': [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-contabilidad': [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-diseno-grafico': [
    'https://images.unsplash.com/photo-1572044162444-ad60f128bde7?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-desarrollo-web': [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-arquitectura': [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1503387762-592965313f89?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-limpieza': [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1528740561666-dc2479da08ad?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-consultoria-de-negocios': [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-marketing-digital': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=1000'
  ],
  'srv-salud': [
    'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1579154273801-e91e35495566?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000'
  ]
};

async function main() {
  console.log('Starting services-only seed...');

  let country = await prisma.country.findUnique({ where: { code: 'EC' } });
  if (!country) {
    country = await prisma.country.create({
      data: { name: 'Ecuador', code: 'EC', currency: 'USD', phonePrefix: '+593', isActive: true }
    });
  }

  let city = await prisma.city.findFirst({ where: { name: 'Quito', countryId: country.id } });
  if (!city) {
    city = await prisma.city.create({
      data: { name: 'Quito', countryId: country.id, isActive: true }
    });
  }

  console.log(`Using City: ${city.name}, Country: ${country.name}`);

  const serviceCategories = ['Plomería', 'Electricidad', 'Asesoría Legal', 'Contabilidad', 'Diseño Gráfico', 'Desarrollo Web', 'Arquitectura', 'Limpieza', 'Consultoría de Negocios', 'Marketing Digital', 'Salud'];
  
  for (const catName of serviceCategories) {
    const catSlug = `srv-${catName.toLowerCase().replace(/\s+/g, '-')}`;
    let category = await prisma.category.findUnique({ where: { slug: catSlug } });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: catName,
          slug: catSlug,
          type: 'SERVICE'
        }
      });
    }

    console.log(`Seeding category: ${catName}...`);

    for (let i = 1; i <= 10; i++) {
      const companyName = `${catName} Profesional Quito ${i}`;
      const email = `contacto${i}@${catName.toLowerCase().replace(/\s+/g, '')}quito.com`;
      const username = `srv_${catName.toLowerCase().replace(/\s+/g, '')}_${i}`;
      
      let serviceProvider = await prisma.user.findUnique({ where: { email } });
      if (!serviceProvider) {
        serviceProvider = await prisma.user.create({
          data: {
            email,
            username,
            name: companyName,
            role: 'PROVIDER',
            status: 'ACTIVE',
            affiliateCode: `SRV_${username.toUpperCase()}`,
            providerProfile: {
              create: {
                companyName,
                address: `Av. Principal y Calle Secundaria, Sector ${i}, Quito`,
                whatsappPhone: `+5939${Math.floor(10000000 + Math.random() * 90000000)}`,
                contactEmail: email,
                googleMapsUrl: 'https://maps.google.com/?q=-0.180653,-78.467838'
              }
            }
          }
        });
      }

      const slug = `srv-${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const existingService = await prisma.service.findUnique({ where: { slug } });
      if (!existingService) {
        const price = 50 + Math.floor(Math.random() * 150);
        const isMedical = catName === 'Salud';
        const discount = isMedical ? 0.30 : 0.10;
        const priceSaidon = price * (1 - discount);

        const medicalServices = [
          'Consulta Pediatría', 'Odontología Integral', 'Laboratorio Clínico', 
          'Ginecología Preventiva', 'Cardiología Especializada', 'Dermatología Avanzada',
          'Nutrición y Bienestar', 'Fisioterapia Deportiva', 'Oftalmología', 'Psicología Clínica'
        ];

        const serviceName = isMedical 
          ? (medicalServices[i-1] || `Especialidad Médica ${i}`)
          : `Servicio de ${catName} Especializado - Plan ${i}`;

        const imgList = serviceImageMap[catSlug] || ['https://images.unsplash.com/photo-1454165833767-027eeef1593e?auto=format&fit=crop&q=80&w=1000'];
        const serviceImages = [imgList[(i - 1) % imgList.length]];

        await prisma.service.create({
          data: {
            name: serviceName,
            description: isMedical 
              ? `Servicio profesional de ${serviceName} con especialistas verificados de SaidonClub. Calidad y confianza para tu bienestar.` 
              : `Ofrecemos los mejores servicios de ${catName} en toda la ciudad de Quito. Atención rápida, garantizada y profesional.`,
            slug,
            pricePVP: price,
            priceSaidon: priceSaidon,
            pointsEarned: 10 + i,
            cost: price * 0.7,
            category: { connect: { id: category.id } },
            provider: { connect: { id: serviceProvider.id } },
            city: { connect: { id: city.id } },
            location: `Quito, Sector ${i}`,
            status: 'ACTIVE',
            isActive: true,
            commissionRate: 0.10,
            images: serviceImages
          }
        });
      }
    }
  }

  console.log('Services seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
