import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando respaldo de datos críticos...');

  const data = {
    timestamp: new Date().toISOString(),
    categories: await prisma.category.findMany(),
    products: await prisma.product.findMany({
      include: { category: true }
    }),
    services: await prisma.service.findMany({
      include: { category: true, provider: true }
    }),
    cities: await prisma.city.findMany(),
    systemConfig: await prisma.systemConfig.findMany(),
  };

  const backupPath = path.join(process.cwd(), 'docs/backups/database/SNAPSHOT_2026_04_25.json');
  
  // Asegurar que el directorio existe
  const dir = path.dirname(backupPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`✅ Respaldo completado exitosamente en: ${backupPath}`);
  console.log(`📊 Resumen: 
    - Categorías: ${data.categories.length}
    - Productos: ${data.products.length}
    - Servicios: ${data.services.length}
    - Ciudades: ${data.cities.length}
    - Configuración: ${data.systemConfig.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el respaldo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
