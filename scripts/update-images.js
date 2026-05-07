const { PrismaClient } = require('../packages/database/src/generated/client');
const prisma = new PrismaClient();

const PRODUCT_GALLERY = {
  'tecnologia': [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000'
  ],
  'hogar': [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1556911223-e1520288629b?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1000'
  ],
  'salud': [
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1511174511547-44026607548c?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000'
  ],
  'moda': [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=1000'
  ],
  'deportes': [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1461896736544-7c9c80211a3d?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1000'
  ],
  'mascotas': [
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=1000'
  ],
  'alimentos': [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000'
  ],
  'lujo': [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000'
  ]
};

const SERVICE_GALLERY = {
  'legal': [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1000'
  ],
  'contabilidad': [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1454165833767-131ef24896c3?auto=format&fit=crop&q=80&w=1000'
  ],
  'tecnologia': [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000'
  ],
  'diseno': [
    'https://images.unsplash.com/photo-1572044162444-ad60f128bde7?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000'
  ],
  'arquitectura': [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1503387762-592dea58dd27?auto=format&fit=crop&q=80&w=1000'
  ],
  'negocios': [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000'
  ],
  'marketing': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1533750516457-a7f992034fce?auto=format&fit=crop&q=80&w=1000'
  ]
};

function getCategoryKeyword(slug) {
  if (slug.includes('tecnologia') || slug.includes('electronica') || slug.includes('software')) return 'tecnologia';
  if (slug.includes('hogar') || slug.includes('cocina') || slug.includes('muebles') || slug.includes('limpieza')) return 'hogar';
  if (slug.includes('salud') || slug.includes('belleza') || slug.includes('bienestar') || slug.includes('medicina')) return 'salud';
  if (slug.includes('moda') || slug.includes('accesorios') || slug.includes('ropa')) return 'moda';
  if (slug.includes('deporte') || slug.includes('fitness') || slug.includes('aventura')) return 'deportes';
  if (slug.includes('mascotas')) return 'mascotas';
  if (slug.includes('alimento') || slug.includes('gastronomia') || slug.includes('gourmet')) return 'alimentos';
  if (slug.includes('lujo') || slug.includes('premium') || slug.includes('estilo-vida')) return 'lujo';
  if (slug.includes('legal') || slug.includes('ley')) return 'legal';
  if (slug.includes('contabilidad') || slug.includes('financiera') || slug.includes('finanzas')) return 'contabilidad';
  if (slug.includes('diseno') || slug.includes('branding')) return 'diseno';
  if (slug.includes('arquitectura') || slug.includes('construccion')) return 'arquitectura';
  if (slug.includes('negocios') || slug.includes('estrategica') || slug.includes('consultoria')) return 'negocios';
  if (slug.includes('marketing')) return 'marketing';
  return null;
}

async function main() {
  console.log('--- RE-MAPPING ALL IMAGES FOR PREMIUM AESTHETICS ---');

  // Update Products
  const products = await prisma.product.findMany({ include: { category: true } });
  console.log(`Processing ${products.length} products...`);
  
  let pCount = 0;
  for (const product of products) {
    const keyword = getCategoryKeyword(product.category.slug);
    const gallery = PRODUCT_GALLERY[keyword] || PRODUCT_GALLERY['lujo']; // Default to luxury if no keyword matches
    
    // Use product ID to pick a deterministic but varied image from the gallery
    const charSum = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIdx = charSum % gallery.length;
    const images = [gallery[imageIdx]];

    await prisma.product.update({
      where: { id: product.id },
      data: { images }
    });
    pCount++;
    if (pCount % 50 === 0) console.log(`Updated ${pCount} products...`);
  }

  // Update Services
  const services = await prisma.service.findMany({ include: { category: true } });
  console.log(`Processing ${services.length} services...`);
  
  let sCount = 0;
  for (const service of services) {
    const keyword = getCategoryKeyword(service.category.slug);
    const gallery = SERVICE_GALLERY[keyword] || SERVICE_GALLERY['negocios'];
    
    const charSum = service.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imageIdx = charSum % gallery.length;
    const images = [gallery[imageIdx]];

    await prisma.service.update({
      where: { id: service.id },
      data: { images }
    });
    sCount++;
    if (sCount % 20 === 0) console.log(`Updated ${sCount} services...`);
  }

  console.log('--- IMAGE RE-MAPPING COMPLETE ---');
  console.log(`Total Products: ${pCount}`);
  console.log(`Total Services: ${sCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
