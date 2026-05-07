
import fs from 'fs';
import path from 'path';

const jsonPath = path.join(process.cwd(), 'ecuador-dropshipping-products-2026.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const products = JSON.parse(rawData);

// 1. Filter out perishable categories (Food/Alimentación)
// Based on current categories: Hogar y Cocina, Salud y Belleza, Deportes y Fitness, Moda y Accesorios, Mascotas, Herramientas y Mejoras del Hogar, Juguetes y Juegos, Tecnología y Electrónica.
// None of these are explicitly Food, but I will check names for safety.
const perishableKeywords = ['fruta', 'verdura', 'carne', 'pollo', 'pescado', 'leche', 'pan ', 'comida', 'alimento', 'snack', 'perecedero'];

const filteredProducts = products.filter(p => {
  const nameLower = p.name.toLowerCase();
  const categoryLower = p.category.toLowerCase();
  
  const isPerishable = perishableKeywords.some(kw => nameLower.includes(kw) || categoryLower.includes(kw));
  
  if (isPerishable) {
    console.log(`Removing perishable: ${p.name}`);
    return false;
  }
  return true;
});

// 2. Cap discounts at 30%
// Max discount means priceSaidon >= 0.7 * pricePVP
const fixedProducts = filteredProducts.map(p => {
  const minSaidonPrice = p.pricePVP * 0.7;
  
  if (p.priceSaidon < minSaidonPrice) {
    console.log(`Capping discount for ${p.name}: ${p.priceSaidon} -> ${minSaidonPrice.toFixed(2)}`);
    const newPriceSaidon = Number(minSaidonPrice.toFixed(2));
    const newMargin = Number((newPriceSaidon - p.priceCost).toFixed(2));
    
    return {
      ...p,
      priceSaidon: newPriceSaidon,
      margin: newMargin
    };
  }
  return p;
});

fs.writeFileSync(jsonPath, JSON.stringify(fixedProducts, null, 2));
console.log('JSON fixed successfully.');
