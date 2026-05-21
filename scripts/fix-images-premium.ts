import { prisma } from '../packages/database/src/client';

/**
 * 🖼️ scripts/fix-images-premium.ts
 * Asigna imágenes premium y ultra-lujosas de Unsplash a productos y servicios 
 * con assets rotos o faltantes en SaidonClub.
 * 
 * Uso: npx tsx scripts/fix-images-premium.ts
 */

const IMAGE_BANK: Record<string, string[]> = {
  electronics: [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80', // Premium Smartwatch
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', // Studio Headphones
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80', // Sleek Ultrabook
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', // Mechanical Keyboard
  ],
  technology: [
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80', // Tech gadgets
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', // Professional Tablet
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', // Smart Speaker
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', // Stealth Drone
  ],
  hogar: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', // Luxury Living Room Furniture
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', // Modern Kitchen Appliances
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80', // Espresso Machine
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', // Design lighting
  ],
  beauty: [
    'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=800&q=80', // Luxury Skincare bottles
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80', // Cosmetics & perfume
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80', // Premium Organic Serum
  ],
  automotriz: [
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80', // Sleek Sports Car Detail
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', // Performance Wheel rim
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&q=80', // Sports Car Cockpit
  ],
  deportes: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80', // Carbon Gym Dumbbells
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80', // Fitness and Trail Running
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80', // Premium Yoga Gear
  ],
  gaming: [
    'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=800&q=80', // Next-Gen Console controller
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80', // RGB Gaming Setup
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', // Esports Arena Setup
  ],
  mascotas: [
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80', // Designer Dog collar & toy
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80', // Elegant Cat resting
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80', // Luxury Pet grooming
  ],
  moda: [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', // Luxury Designer clothes
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', // Elegant Boutique wear
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', // High-end Retail fashion
  ],
  calzado: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // Performance Sneaker
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80', // Luxury Leather shoes
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', // Premium Athletic shoes
  ],
  juguetes: [
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80', // Educational building blocks
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80', // Elegant Handcrafted Wooden Toy
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80', // Retro Collectible figure
  ],
  ferreteria: [
    'https://images.unsplash.com/photo-1581242163695-19d280331484?w=800&q=80', // Professional Steel tools
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80', // Modern DIY Toolkit
  ],
  papeleria: [
    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80', // Minimalist premium notebook and pen
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80', // Fine Art Calligraphy and pencils
  ],
  herramientas: [
    'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=800&q=80', // Heavy-duty power tools
    'https://images.unsplash.com/photo-1581242163695-19d280331484?w=800&q=80', // Carbon Wrenches & tools
  ],
  moviles: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', // Titanium Smartphone
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', // Premium Mobile phone showcase
  ],
  generic: [
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80', // Premium concept store
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80', // Luxury Shopping bags
    'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=800&q=80', // Elegant lifestyle
  ]
};

// Mapeo de términos de búsqueda en nombre/categoría a llaves de IMAGE_BANK
const MAP_KEYWORDS: Record<string, string> = {
  'electrónica': 'electronics',
  'tecnología': 'technology',
  'hogar': 'hogar',
  'belleza': 'beauty',
  'salud': 'beauty',
  'automotriz': 'automotriz',
  'deportes': 'deportes',
  'gaming': 'gaming',
  'juegos': 'gaming',
  'mascotas': 'mascotas',
  'moda': 'moda',
  'calzado': 'calzado',
  'zapatos': 'calzado',
  'juguetes': 'juguetes',
  'ferretería': 'ferreteria',
  'papelería': 'papeleria',
  'oficina': 'papeleria',
  'herramientas': 'herramientas',
  'móviles': 'moviles',
  'celular': 'moviles',
  'teléfono': 'moviles',
};

function selectPremiumImages(name: string, categoryName?: string): string[] {
  const searchName = name.toLowerCase();
  const searchCategory = (categoryName || '').toLowerCase();

  // Buscar coincidencia en KEYWORDS del nombre
  for (const [key, bankKey] of Object.entries(MAP_KEYWORDS)) {
    if (searchName.includes(key)) {
      const pool = IMAGE_BANK[bankKey];
      if (pool && pool.length > 0) {
        // Rotar usando hashing simple sobre la longitud y primer char del nombre
        const idx = (searchName.length + (name.charCodeAt(0) || 0)) % pool.length;
        return [pool[idx]];
      }
    }
  }

  // Buscar coincidencia en KEYWORDS de la categoría
  for (const [key, bankKey] of Object.entries(MAP_KEYWORDS)) {
    if (searchCategory.includes(key)) {
      const pool = IMAGE_BANK[bankKey];
      if (pool && pool.length > 0) {
        const idx = (searchName.length) % pool.length;
        return [pool[idx]];
      }
    }
  }

  // Fallback a banco genérico
  const genericPool = IMAGE_BANK.generic;
  const idx = searchName.length % genericPool.length;
  return [genericPool[idx]];
}

async function main() {
  console.log('💎 Iniciando actualización de assets visuales premium para SaidonClub...');

  // 1. Obtener productos
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  console.log(`📦 Auditando ${products.length} productos...`);
  let productsFixed = 0;

  for (const product of products) {
    // Si no tiene imágenes o el array está vacío o contiene cadenas vacías o tiene placeholders
    const hasValidImages = product.images && product.images.length > 0 && product.images.every(img => img.trim() !== '');

    if (!hasValidImages) {
      const categoryName = product.category?.name;
      const newImages = selectPremiumImages(product.name, categoryName);
      console.log(`🔧 Corrigiendo: [${product.name}] (Categoría: ${categoryName || 'N/A'})`);
      console.log(`   -> Asignando: ${newImages[0]}`);

      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages }
      });
      productsFixed++;
    }
  }

  console.log(`✅ Se actualizaron exitosamente ${productsFixed} productos con imágenes premium.`);

  // 2. Obtener servicios (por si acaso alguno tiene imágenes rotas o vacías)
  const services = await prisma.service.findMany({
    include: { category: true }
  });

  console.log(`🔧 Auditando ${services.length} servicios...`);
  let servicesFixed = 0;

  for (const service of services) {
    const hasValidImages = service.images && service.images.length > 0 && service.images.every(img => img.trim() !== '');

    if (!hasValidImages) {
      const categoryName = service.category?.name;
      const newImages = selectPremiumImages(service.name, categoryName);
      console.log(`🔧 Corrigiendo Servicio: [${service.name}] (Categoría: ${categoryName || 'N/A'})`);
      console.log(`   -> Asignando: ${newImages[0]}`);

      await prisma.service.update({
        where: { id: service.id },
        data: { images: newImages }
      });
      servicesFixed++;
    }
  }

  console.log(`✅ Se actualizaron exitosamente ${servicesFixed} servicios con imágenes premium.`);
  console.log('🎉 Auditoría visual y asignación de imágenes premium finalizada.');
}

main()
  .catch(err => {
    console.error('❌ Error al ejecutar fix-images-premium.ts:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
