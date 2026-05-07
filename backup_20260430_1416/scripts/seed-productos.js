// Cargar .env manualmente
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
}

const { PrismaClient } = require('../packages/database/src/generated/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

const productosBase = [
  { nombre: 'Auriculares Bluetooth Premium', cat: 'electronica', pvp: 89.99, saidon: 45.00, pts: 200 },
  { nombre: 'Smartwatch Deportivo Pro', cat: 'electronica', pvp: 149.99, saidon: 75.00, pts: 350 },
  { nombre: 'Cámara de Seguridad WiFi 4K', cat: 'electronica', pvp: 119.99, saidon: 60.00, pts: 280 },
  { nombre: 'Parlante Bluetooth Waterproof', cat: 'electronica', pvp: 79.99, saidon: 40.00, pts: 180 },
  { nombre: 'Power Bank 20000mAh Solar', cat: 'electronica', pvp: 69.99, saidon: 35.00, pts: 160 },
  { nombre: 'Teclado Mecánico RGB Gaming', cat: 'electronica', pvp: 129.99, saidon: 65.00, pts: 300 },
  { nombre: 'Mouse Inalámbrico Ergonómico', cat: 'electronica', pvp: 59.99, saidon: 30.00, pts: 140 },
  { nombre: 'Drone FPV con Cámara HD', cat: 'electronica', pvp: 249.99, saidon: 125.00, pts: 580 },
  { nombre: 'Aro de Luz LED 18 pulgadas', cat: 'electronica', pvp: 89.99, saidon: 45.00, pts: 200 },
  { nombre: 'Proyector Portátil Mini 4K', cat: 'electronica', pvp: 199.99, saidon: 100.00, pts: 460 },
  { nombre: 'Tablet Android 10 pulgadas', cat: 'electronica', pvp: 299.99, saidon: 150.00, pts: 700 },
  { nombre: 'Audífonos Cancelación de Ruido', cat: 'electronica', pvp: 179.99, saidon: 90.00, pts: 420 },
  { nombre: 'Cargador Inalámbrico 15W', cat: 'electronica', pvp: 49.99, saidon: 25.00, pts: 115 },
  { nombre: 'Webcam HD 1080p con Micrófono', cat: 'electronica', pvp: 89.99, saidon: 45.00, pts: 200 },
  { nombre: 'Soporte para Laptop Aluminio', cat: 'electronica', pvp: 69.99, saidon: 35.00, pts: 160 },
  { nombre: 'Vestido Floral Verano', cat: 'moda', pvp: 49.99, saidon: 25.00, pts: 115 },
  { nombre: 'Jeans Skinny Mujer Premium', cat: 'moda', pvp: 69.99, saidon: 35.00, pts: 160 },
  { nombre: 'Camisa Oxford Hombre Slim Fit', cat: 'moda', pvp: 59.99, saidon: 30.00, pts: 140 },
  { nombre: 'Zapatillas Running Ultraligeras', cat: 'moda', pvp: 119.99, saidon: 60.00, pts: 280 },
  { nombre: 'Mochila Antirrobo USB', cat: 'moda', pvp: 79.99, saidon: 40.00, pts: 180 },
  { nombre: 'Gafas de Sol Polarizadas UV400', cat: 'moda', pvp: 39.99, saidon: 20.00, pts: 90 },
  { nombre: 'Reloj Hombre Acero Inoxidable', cat: 'moda', pvp: 149.99, saidon: 75.00, pts: 350 },
  { nombre: 'Bolso de Cuero Genuino Mujer', cat: 'moda', pvp: 129.99, saidon: 65.00, pts: 300 },
  { nombre: 'Chaqueta Impermeable Unisex', cat: 'moda', pvp: 99.99, saidon: 50.00, pts: 230 },
  { nombre: 'Vitaminas C 1000mg x90', cat: 'salud', pvp: 29.99, saidon: 15.00, pts: 70 },
  { nombre: 'Colágeno Hidrolizado con Biotina', cat: 'salud', pvp: 49.99, saidon: 25.00, pts: 115 },
  { nombre: 'Proteína Whey Premium 1kg', cat: 'salud', pvp: 89.99, saidon: 45.00, pts: 200 },
  { nombre: 'Masajeador Cervical Eléctrico', cat: 'salud', pvp: 79.99, saidon: 40.00, pts: 180 },
  { nombre: 'Tensiómetro Digital de Brazo', cat: 'salud', pvp: 59.99, saidon: 30.00, pts: 140 },
  { nombre: 'Purificador de Aire HEPA', cat: 'salud', pvp: 149.99, saidon: 75.00, pts: 350 },
  { nombre: 'Cepillo Sónico Dental Pro', cat: 'salud', pvp: 89.99, saidon: 45.00, pts: 200 },
  { nombre: 'Báscula Digital Smart Bluetooth', cat: 'salud', pvp: 49.99, saidon: 25.00, pts: 115 },
  { nombre: 'Omega 3 Ultra Concentrado x120', cat: 'salud', pvp: 39.99, saidon: 20.00, pts: 90 },
  { nombre: 'Aceite CBD Premium 1000mg', cat: 'salud', pvp: 79.99, saidon: 40.00, pts: 180 },
  { nombre: 'Depiladora Láser IPL Casera', cat: 'salud', pvp: 199.99, saidon: 100.00, pts: 460 },
  { nombre: 'Mancuernas Ajustables 20kg par', cat: 'deportes', pvp: 149.99, saidon: 75.00, pts: 350 },
  { nombre: 'Banda Elástica Resistencia Set', cat: 'deportes', pvp: 34.99, saidon: 17.50, pts: 80 },
  { nombre: 'Esterilla Yoga Antideslizante', cat: 'deportes', pvp: 44.99, saidon: 22.50, pts: 105 },
  { nombre: 'Cuerda de Saltar Pro Speed', cat: 'deportes', pvp: 24.99, saidon: 12.50, pts: 58 },
  { nombre: 'Guantes Boxeo Training', cat: 'deportes', pvp: 59.99, saidon: 30.00, pts: 140 },
  { nombre: 'Bicicleta Estática Plegable', cat: 'deportes', pvp: 349.99, saidon: 175.00, pts: 810 },
  { nombre: 'Chaleco Lastrado 10kg', cat: 'deportes', pvp: 99.99, saidon: 50.00, pts: 230 },
  { nombre: 'Kettlebell Cast Iron 16kg', cat: 'deportes', pvp: 79.99, saidon: 40.00, pts: 180 },
  { nombre: 'Casco Ciclismo Certificado', cat: 'deportes', pvp: 89.99, saidon: 45.00, pts: 200 },
  { nombre: 'Soporte Pull Up Puerta', cat: 'deportes', pvp: 49.99, saidon: 25.00, pts: 115 },
  { nombre: 'Licuadora Oster Profesional', cat: 'alimentos', pvp: 149.99, saidon: 75.00, pts: 350 },
  { nombre: 'Aceite de Coco Orgánico 500ml', cat: 'alimentos', pvp: 24.99, saidon: 12.50, pts: 58 },
  { nombre: 'Granola Artesanal Sin Azúcar 1kg', cat: 'alimentos', pvp: 19.99, saidon: 10.00, pts: 45 },
  { nombre: 'Miel de Abeja Pura 1kg', cat: 'alimentos', pvp: 29.99, saidon: 15.00, pts: 70 },
  { nombre: 'Café Tostado Origen Ecuador 500g', cat: 'alimentos', pvp: 22.99, saidon: 11.50, pts: 52 },
  { nombre: 'Proteína Vegana Chocolate 1kg', cat: 'alimentos', pvp: 79.99, saidon: 40.00, pts: 180 },
  { nombre: 'Spirulina Tabletas x200', cat: 'alimentos', pvp: 29.99, saidon: 15.00, pts: 70 },
  { nombre: 'Licuadora Portátil USB', cat: 'alimentos', pvp: 44.99, saidon: 22.50, pts: 105 },
  { nombre: 'Mix Frutos Secos Premium 1kg', cat: 'alimentos', pvp: 34.99, saidon: 17.50, pts: 80 },
  { nombre: 'Quinua Real Boliviana 1kg', cat: 'alimentos', pvp: 14.99, saidon: 7.50, pts: 35 },
  { nombre: 'Freidora de Aire 5.5L Digital', cat: 'hogar', pvp: 199.99, saidon: 100.00, pts: 460 },
  { nombre: 'Robot Aspiradora Inteligente', cat: 'hogar', pvp: 299.99, saidon: 150.00, pts: 700 },
  { nombre: 'Cafetera Espresso Automática', cat: 'hogar', pvp: 249.99, saidon: 125.00, pts: 580 },
  { nombre: 'Silla de Oficina Ergonómica', cat: 'hogar', pvp: 349.99, saidon: 175.00, pts: 810 },
  { nombre: 'Almohada Ortopédica Memory Foam', cat: 'hogar', pvp: 79.99, saidon: 40.00, pts: 180 },
  { nombre: 'Set Sábanas Microfibra Queen', cat: 'hogar', pvp: 59.99, saidon: 30.00, pts: 140 },
  { nombre: 'Luces LED RGB Habitación 10m', cat: 'hogar', pvp: 29.99, saidon: 15.00, pts: 70 },
  { nombre: 'Set Ollas Antiadherente 9pzs', cat: 'hogar', pvp: 149.99, saidon: 75.00, pts: 350 },
  { nombre: 'Difusor Aromas Ultrasónico', cat: 'hogar', pvp: 44.99, saidon: 22.50, pts: 105 },
  { nombre: 'Plancha Vapor Professional', cat: 'hogar', pvp: 89.99, saidon: 45.00, pts: 200 },
  { nombre: 'Espejo LED Baño con Antivaho', cat: 'hogar', pvp: 129.99, saidon: 65.00, pts: 300 },
  { nombre: 'Paquete Tour Galápagos 5 días', cat: 'viajes', pvp: 1299.99, saidon: 999.99, pts: 1250 },
  { nombre: 'Tour Cuenca + Ingapirca', cat: 'viajes', pvp: 299.99, saidon: 199.99, pts: 700 },
  { nombre: 'Tour Amazonia 3 días', cat: 'viajes', pvp: 499.99, saidon: 349.99, pts: 1150 },
  { nombre: 'Paseo en Globo Aerostático Quito', cat: 'viajes', pvp: 299.99, saidon: 219.99, pts: 700 },
  { nombre: 'Maleta Cabina Rígida 20 pulgadas', cat: 'viajes', pvp: 149.99, saidon: 75.00, pts: 350 },
  { nombre: 'Mochila Viajero 65L Impermeable', cat: 'viajes', pvp: 129.99, saidon: 65.00, pts: 300 },
  { nombre: 'Tour Ruta Volcanes 4 días', cat: 'viajes', pvp: 399.99, saidon: 279.99, pts: 950 },
];

const imgMap = {
  electronica: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  moda: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
  salud: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
  deportes: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
  alimentos: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
  hogar: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  viajes: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
};

async function main() {
  console.log('🚀 Iniciando seed de 300 productos dropshipping...');

  // Limpiar productos existentes
  try { await prisma.cartItem.deleteMany({}); } catch(e) {}
  try { await prisma.orderItem.deleteMany({}); } catch(e) {}
  await prisma.product.deleteMany({});
  console.log('✓ Productos anteriores eliminados');

  // Proveedor
  const provider = await prisma.user.findFirst({ where: { role: 'ADMIN' } }) || await prisma.user.findFirst();
  if (!provider) throw new Error('No hay usuarios admin en la BD');

  // Categorías
  const catNames = { electronica:'Electrónica', moda:'Moda', salud:'Salud', deportes:'Deportes', alimentos:'Alimentos', hogar:'Hogar', viajes:'Viajes' };
  const catMap = {};
  for (const [slug, name] of Object.entries(catNames)) {
    let cat = await prisma.category.findFirst({ where: { slug } });
    if (!cat) cat = await prisma.category.create({ data: { name, slug, type: 'PRODUCT' } });
    catMap[slug] = cat.id;
  }
  console.log('✓ Categorías listas');

  // Generar 300 productos
  const toCreate = [];
  for (let i = 0; i < 300; i++) {
    const base = productosBase[i % productosBase.length];
    const wave = Math.floor(i / productosBase.length);
    const suffix = wave > 0 ? ` Edición ${['Plus','Pro','Elite','Max','Ultra'][wave % 5]}` : '';
    const pvp = parseFloat((base.pvp * (1 + wave * 0.07)).toFixed(2));
    const saidon = parseFloat((base.saidon * (1 + wave * 0.04)).toFixed(2));

    toCreate.push({
      name: `${base.nombre}${suffix}`,
      description: `${base.nombre} de alta calidad disponible para envío a todo Ecuador. Producto verificado con garantía, ideal para dropshipping. Alta demanda en el mercado ecuatoriano con márgenes atractivos para revendedores SaidonClub.`,
      slug: `prod-${i + 1}-${base.cat}-${i}`,
      pricePVP: pvp,
      priceSaidon: saidon,
      pointsEarned: Math.round(base.pts * (1 + wave * 0.05)),
      cost: parseFloat((saidon * 0.55).toFixed(2)),
      margin: parseFloat((saidon * 0.30).toFixed(2)),
      tax: 0,
      logistics: 0,
      stock: 50 + Math.floor(Math.random() * 450),
      images: [imgMap[base.cat]],
      categoryId: catMap[base.cat],
      providerId: provider.id,
      status: 'APPROVED',
      isActive: true,
    });
  }

  // Insertar en lotes de 50
  for (let i = 0; i < toCreate.length; i += 50) {
    await prisma.product.createMany({ data: toCreate.slice(i, i + 50) });
    process.stdout.write(`\r✓ Insertados: ${Math.min(i + 50, toCreate.length)} / 300`);
  }

  console.log('\n✅ 300 productos de dropshipping creados exitosamente!');
  const total = await prisma.product.count();
  console.log(`📦 Total en BD: ${total} productos`);
}

main()
  .catch(e => { console.error('❌ Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
