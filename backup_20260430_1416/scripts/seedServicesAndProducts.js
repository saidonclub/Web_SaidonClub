const { PrismaClient } = require('../packages/database/src/generated/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const productImageMap = {
  'hogar-y-cocina': ['/images/products/hogar-cocina.png'],
  'salud-y-belleza': ['/images/products/salud-belleza.png'],
  'deportes-y-fitness': ['/images/products/deportes-fitness.png'],
  'moda-y-accesorios': ['/images/products/moda-accesorios.png'],
  'mascotas': ['/images/products/mascotas.png'],
  'herramientas-y-mejoras-del-hogar': ['/images/products/herramientas-hogar.png'],
  'juguetes-y-juegos': ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=1000'],
  'tecnologia-y-electronica': ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000']
};

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
  console.log('Starting seed script...');

  // 1. Create or find Country and City
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

  // 2. Create Global Provider for Dropshipping Products
  let productProvider = await prisma.user.findUnique({ where: { email: 'dropshipping@saidonclub.com' } });
  if (!productProvider) {
    productProvider = await prisma.user.create({
      data: {
        email: 'dropshipping@saidonclub.com',
        username: 'dropshipping_ec',
        name: 'SaidonClub Dropshipping Ecuador',
        role: 'PROVIDER',
        status: 'ACTIVE',
        affiliateCode: 'DROPSHIP_EC_001',
        providerProfile: {
          create: {
            companyName: 'SaidonClub Dropshipping',
            address: 'Av. Amazonas, Quito',
            whatsappPhone: '+593999999999',
            contactEmail: 'ventas@saidonclub.com'
          }
        }
      }
    });
  }

  // 3. Read and Import 300 Products
  const productsPath = path.join(__dirname, '..', 'ecuador-dropshipping-products-2026.json');
  if (fs.existsSync(productsPath)) {
    console.log('Importing dropshipping products...');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    for (let i = 0; i < productsData.length; i++) {
      if (i % 50 === 0) console.log(`Processing product ${i} of ${productsData.length}...`);
      const p = productsData[i];
      // Find or create category
      let category = await prisma.category.findUnique({ where: { slug: p.category.toLowerCase().replace(/\s+/g, '-') } });
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: p.category,
            slug: p.category.toLowerCase().replace(/\s+/g, '-'),
            type: 'PRODUCT'
          }
        });
      }

      // Format unique slug
      const slug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`;
      
      const existingProduct = await prisma.product.findUnique({ where: { slug } });
      if (!existingProduct) {
        await prisma.product.create({
          data: {
            name: p.name,
            description: p.name + ' - Excelente calidad.',
            slug,
            pricePVP: p.pricePVP,
            priceSaidon: p.pricePVP * 0.85,
            pointsEarned: p.score ? p.score * 2 : 10,
            cost: p.cost,
            margin: p.margin,
            stock: 100,
            category: { connect: { id: category.id } },
            provider: { connect: { id: productProvider.id } },
            city: { connect: { id: city.id } },
            status: 'ACTIVE',
            isActive: true,
            images: productImageMap[category.slug] || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000']
          }
        });
      }
    }
    console.log('Finished importing products.');
  } else {
    console.warn('Products JSON not found at:', productsPath);
  }

  // 4. Generate 100 Professional Services in Quito
  console.log('Generating 100 Professional Services...');
  
  const serviceCategories = ['Plomería', 'Electricidad', 'Asesoría Legal', 'Contabilidad', 'Diseño Gráfico', 'Desarrollo Web', 'Arquitectura', 'Limpieza', 'Consultoría de Negocios', 'Marketing Digital', 'Salud'];
  
  for (const catName of serviceCategories) {
    let category = await prisma.category.findUnique({ where: { slug: `srv-${catName.toLowerCase().replace(/\s+/g, '-')}` } });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: catName,
          slug: `srv-${catName.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'SERVICE'
        }
      });
    }

    // Create 10 services per category
    console.log(`Processing category: ${catName}...`);
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
        const price = 50 + Math.floor(Math.random() * 150); // Random price between 50 and 200
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

        const imgList = serviceImageMap[category.slug] || ['https://images.unsplash.com/photo-1454165833767-027eeef1593e?auto=format&fit=crop&q=80&w=1000'];
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

  console.log('Finished generating 100 services.');
  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
