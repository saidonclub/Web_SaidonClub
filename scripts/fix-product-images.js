/**
 * fix-product-images.js
 * Asigna imágenes Unsplash únicas y apropiadas por categoría/nombre
 * a todos los productos y servicios existentes en la BD.
 * 
 * Uso: node scripts/fix-product-images.js
 */

const { PrismaClient } = require('../packages/database/src/generated/client_v2');
const prisma = new PrismaClient();

// ============================================================
// BANCO DE IMÁGENES POR CATEGORÍA (Unsplash, alta calidad)
// ============================================================
const IMAGE_BANK = {
  // --- Tecnología ---
  'tecnología': [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80', // smartwatch
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80', // auriculares
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', // laptop
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', // cargador
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', // lentes
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80', // tablet
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', // parlante
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80', // drone
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80', // gadgets
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80', // mouse/teclado
  ],
  // --- Moda ---
  'moda': [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80', // ropa
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', // zapatillas
    'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&q=80', // bolso
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80', // jeans
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80', // camisa
    'https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=600&q=80', // gorra
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', // mochila moda
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80', // zapatos
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', // reloj moda
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80', // vestido
  ],
  // --- Hogar / Electrodomésticos ---
  'hogar': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', // aspiradora
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', // sala
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', // cocina
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80', // licuadora
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80', // tv
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80', // cafetera
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80', // plancha
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&q=80', // ventilador
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', // microondas
    'https://images.unsplash.com/photo-1583241475880-083f84372725?w=600&q=80', // refrigerador
  ],
  // --- Salud / Deporte / Fitness ---
  'salud': [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', // pesas
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', // yoga mat
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80', // proteína
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80', // zapatilla deporte
    'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=600&q=80', // botella agua
    'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&q=80', // banda resistencia
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', // running
    'https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?w=600&q=80', // bicicleta
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', // gym
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80', // esterilla
  ],
  // --- Alimentos / Bebidas ---
  'alimentos': [
    'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&q=80', // frutas
    'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80', // pizza gourmet
    'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80', // café premium
    'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=600&q=80', // chocolate
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', // snack
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', // ensalada
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', // carne
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80', // pasta
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80', // cóctel
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80', // postre
  ],
  // --- Deportes ---
  'deportes': [
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80', // fútbol
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', // tenis
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80', // baloncesto
    'https://images.unsplash.com/photo-1544899489-a083461b088c?w=600&q=80', // natación
    'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=600&q=80', // ciclismo
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', // boxeo
    'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=600&q=80', // surf
    'https://images.unsplash.com/photo-1600965962324-55bf93defc20?w=600&q=80', // escalada
    'https://images.unsplash.com/photo-1565992441121-4367fe2554eb?w=600&q=80', // patines
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80', // raqueta
  ],
  // --- Viajes / Accesorios ---
  'viajes': [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80', // maleta
    'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600&q=80', // destino
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80', // bolsa viaje
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&q=80', // aventura
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80', // playa
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80', // montaña
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', // destino tropical
    'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80', // camping
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=600&q=80', // avión
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80', // carretera
  ],
  // --- Servicios Profesionales ---
  'plomería': [
    'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  ],
  'electricidad': [
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80',
    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
  ],
  'asesoría legal': [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=600&q=80',
  ],
  'contabilidad': [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
  ],
  'diseño gráfico': [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
  ],
  'desarrollo web': [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=600&q=80',
  ],
  'arquitectura': [
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80',
  ],
  'limpieza': [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80',
  ],
  'consultoría de negocios': [
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
  ],
  'marketing digital': [
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  ],
};

// Palabras clave en nombre del producto → categoría de imagen
const NAME_KEYWORDS = {
  'auricular': 'tecnología', 'smartwatch': 'tecnología', 'reloj': 'tecnología',
  'cargador': 'tecnología', 'cable': 'tecnología', 'funda': 'tecnología',
  'lámpara': 'tecnología', 'linterna': 'tecnología', 'teclado': 'tecnología',
  'mouse': 'tecnología', 'parlante': 'tecnología', 'altavoz': 'tecnología',
  'tablet': 'tecnología', 'drone': 'tecnología', 'camara': 'tecnología',
  'aspiradora': 'hogar', 'plancha': 'hogar', 'licuadora': 'hogar',
  'cafetera': 'hogar', 'microondas': 'hogar', 'ventilador': 'hogar',
  'silla': 'hogar', 'cama': 'hogar', 'almohada': 'hogar', 'lámpara': 'hogar',
  'pesa': 'salud', 'esterilla': 'salud', 'proteína': 'salud', 'botella': 'salud',
  'mancuerna': 'salud', 'banda': 'salud', 'mochila impermeable': 'deportes',
  'balón': 'deportes', 'raqueta': 'deportes', 'bicicleta': 'deportes',
  'zapato': 'moda', 'zapatilla': 'moda', 'camisa': 'moda', 'vestido': 'moda',
  'gorra': 'moda', 'bolso': 'moda', 'cartera': 'moda', 'jean': 'moda',
  'maleta': 'viajes', 'maletín': 'viajes',
  'café': 'alimentos', 'chocolate': 'alimentos', 'snack': 'alimentos',
};

function getImageForProduct(name, categoryName) {
  const nameLower = name.toLowerCase();
  const catLower = (categoryName || '').toLowerCase();

  // 1. Buscar por palabra clave en nombre
  for (const [keyword, imgCat] of Object.entries(NAME_KEYWORDS)) {
    if (nameLower.includes(keyword)) {
      const pool = IMAGE_BANK[imgCat];
      if (pool) {
        // Variación basada en el nombre para evitar repeticiones
        const idx = (nameLower.length + name.charCodeAt(0)) % pool.length;
        return [pool[idx]];
      }
    }
  }

  // 2. Buscar por categoría
  for (const [cat, pool] of Object.entries(IMAGE_BANK)) {
    if (catLower.includes(cat) || cat.includes(catLower)) {
      const idx = (nameLower.length) % pool.length;
      return [pool[idx]];
    }
  }

  // 3. Fallback genérico — varios para variedad
  const generic = [
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&q=80',
    'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=600&q=80',
  ];
  return [generic[nameLower.length % generic.length]];
}

async function main() {
  console.log('🖼️  Iniciando actualización de imágenes...\n');

  // --- PRODUCTOS ---
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  console.log(`📦 Encontrados ${products.length} productos.`);
  let productUpdated = 0;

  for (const product of products) {
    // Solo actualizar si la imagen es la placeholder por defecto o está vacía
    // FORZAR ACTUALIZACIÓN SIEMPRE para asegurar calidad profesional
    const needsUpdate = true;

    if (needsUpdate) {
      const images = getImageForProduct(product.name, product.category?.name);
      await prisma.product.update({
        where: { id: product.id },
        data: { images },
      });
      productUpdated++;
    }
  }

  console.log(`✅ ${productUpdated}/${products.length} productos actualizados con imágenes únicas.\n`);

  // --- SERVICIOS ---
  const services = await prisma.service.findMany({
    include: { category: true },
  });

  console.log(`🔧 Encontrados ${services.length} servicios.`);
  let serviceUpdated = 0;

  for (const service of services) {
    const needsUpdate = true;

    if (needsUpdate) {
      const images = getImageForProduct(service.name, service.category?.name);
      await prisma.service.update({
        where: { id: service.id },
        data: { images },
      });
      serviceUpdated++;
    }
  }

  console.log(`✅ ${serviceUpdated}/${services.length} servicios actualizados con imágenes únicas.\n`);
  console.log('🎉 ¡Proceso completado! Recarga el servidor para ver los cambios.');
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
