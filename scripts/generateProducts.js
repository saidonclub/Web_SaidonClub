const fs = require('fs');

const categories = [
  'Tecnología y Electrónica',
  'Hogar y Cocina',
  'Salud y Belleza',
  'Deportes y Fitness',
  'Moda y Accesorios',
  'Mascotas',
  'Herramientas y Mejoras del Hogar',
  'Juguetes y Juegos'
];

const adjectives = ['Inteligente', 'Portátil', 'Inalámbrico', 'Profesional', 'Premium', 'Ergonómico', 'Ecológico', 'Multifuncional', 'Avanzado', 'Compacto', 'Ultra-rápido', 'Impermeable', 'Recargable', 'Digital', 'Automático'];
const baseProducts = [
  'Auriculares', 'Reloj', 'Cámara', 'Cargador', 'Soporte', 'Altavoz', 'Batería', 'Humidificador', 'Licuadora', 'Aspiradora',
  'Masajeador', 'Depiladora', 'Secador', 'Plancha', 'Banda de Resistencia', 'Esterilla', 'Pesa', 'Mochila', 'Gafas', 'Cartera',
  'Collar', 'Cama', 'Correa', 'Dispensador', 'Taladro', 'Juego de Destornilladores', 'Linterna', 'Drone', 'Consola', 'Rompecabezas'
];

const brands = ['TechMax', 'HomePro', 'BeautyGlow', 'FitLife', 'StyleIcon', 'PetJoy', 'ToolMaster', 'ToyWorld', 'EcuadorDropship', 'SaidonBrands'];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPrice(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

const products = [];

for (let i = 1; i <= 300; i++) {
  const category = categories[i % categories.length];
  const adjective = getRandomItem(adjectives);
  const baseProduct = getRandomItem(baseProducts);
  const brand = getRandomItem(brands);
  
  const name = `${baseProduct} ${adjective} ${brand}`;
  const cost = parseFloat(getRandomPrice(5, 50));
  const priceSaidon = cost * 1.5; // 50% markup for wholesale
  const pricePVP = cost * 2.5; // 150% markup for retail
  const margin = pricePVP - cost;
  
  products.push({
    id: i,
    name: name,
    slug: name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') + '-' + i,
    description: `Descubre el nuevo ${name}. Ideal para el mercado ecuatoriano en 2026. Calidad superior y diseño innovador garantizado por ${brand}.`,
    category: category,
    pricePVP: parseFloat(pricePVP.toFixed(2)),
    priceSaidon: parseFloat(priceSaidon.toFixed(2)),
    cost: parseFloat(cost.toFixed(2)),
    margin: parseFloat(margin.toFixed(2)),
    stock: Math.floor(Math.random() * 500) + 50,
    images: [`https://via.placeholder.com/500?text=${encodeURIComponent(baseProduct)}`],
    provider: 'SaidonClub Dropshipping',
    isActive: true
  });
}

fs.writeFileSync('ecuador-dropshipping-products-2026.json', JSON.stringify(products, null, 2));
console.log('Se generaron 300 productos y se guardaron en ecuador-dropshipping-products-2026.json');
