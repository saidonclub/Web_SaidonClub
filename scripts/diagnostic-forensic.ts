import fs from 'fs';
import path from 'path';
import { prisma } from '../packages/database/src/client';

// =================================================================
// 🕵️ SaidonClub OS v7.0 — Forensic & SAST Audit Script
// =================================================================

interface AuditResult {
  sast: {
    exposedKeys: { file: string; line: number; type: string; snippet: string }[];
    missingTryCatch: { file: string; route: string; method: string }[];
  };
  dataConsistency: {
    emptyCategories: { id: string; name: string; type: string }[];
    productsWithoutImages: { id: string; name: string; slug: string }[];
    servicesWithoutImages: { id: string; name: string; slug: string }[];
    orphanWallets: string[];
    walletsWithNegativeBalances: { userId: string; pending: number; validated: number; available: number }[];
  };
  apiEndpoints: string[];
}

const ROOT_DIR = path.resolve(__dirname, '..');
const APPS_WEB_DIR = path.join(ROOT_DIR, 'apps', 'web');

// Regex para detectar claves, contraseñas en duro y secretos
const KEYS_REGEX = /(?:api_key|apikey|secret|password|passwd|private_key|token|auth_token)\s*=\s*['"`]([a-zA-Z0-9_\-+=]{10,})['"`]/gi;
const HARDCODED_SECRETS_EXCLUDE = ['.env', '.env.local', 'node_modules', '.next', 'dist', 'out', 'build', '.git', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'audit_results', 'docs'];

async function runSASTScan(): Promise<AuditResult['sast']> {
  const exposedKeys: AuditResult['sast']['exposedKeys'] = [];
  const missingTryCatch: AuditResult['sast']['missingTryCatch'] = [];

  function scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(ROOT_DIR, fullPath);

      if (HARDCODED_SECRETS_EXCLUDE.some(exclude => relativePath.includes(exclude) || file === exclude)) {
        continue;
      }

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && /\.(ts|tsx|js|jsx|json)$/.test(file)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // 1. Escanear por Secrets en duro
        let match;
        const lines = content.split('\n');
        lines.forEach((lineText, index) => {
          // Reiniciamos lastIndex para evitar problemas con flags globales
          KEYS_REGEX.lastIndex = 0;
          const matchLine = KEYS_REGEX.exec(lineText);
          if (matchLine) {
            // Ignorar variables de entorno falsas o simuladas en scripts de pruebas
            const val = matchLine[1].toLowerCase();
            if (!val.includes('mock') && !val.includes('test') && !val.includes('dummy') && !val.includes('example') && !val.includes('placeholder')) {
              exposedKeys.push({
                file: relativePath,
                line: index + 1,
                type: matchLine[0].split('=')[0].trim(),
                snippet: lineText.trim().substring(0, 100)
              });
            }
          }
        });

        // 2. Escanear endpoints de API sin try-catch
        if (relativePath.includes('app/api') && file.startsWith('route.')) {
          const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
          methods.forEach(method => {
            const methodRegex = new RegExp(`export\\s+async\\s+function\\s+${method}\\b`, 'i');
            if (methodRegex.test(content)) {
              // Si exporta el método pero no contiene "try" y "catch"
              const hasTryCatch = content.includes('try') && content.includes('catch');
              if (!hasTryCatch) {
                missingTryCatch.push({
                  file: relativePath,
                  route: relativePath.replace('apps/web/app/api/', '/api/').replace('/route.ts', '').replace('/route.js', ''),
                  method
                });
              }
            }
          });
        }
      }
    }
  }

  scanDirectory(ROOT_DIR);
  return { exposedKeys, missingTryCatch };
}

async function runDataConsistencyAudit(): Promise<AuditResult['dataConsistency']> {
  // 1. Categorías vacías (sin productos ni servicios asociados)
  const allCategories = await prisma.category.findMany({
    include: {
      products: { select: { id: true } },
      services: { select: { id: true } }
    }
  });

  const emptyCategories = allCategories
    .filter(cat => cat.products.length === 0 && cat.services.length === 0)
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      type: cat.type
    }));

  // 2. Productos sin imágenes o con arrays vacíos/rotos
  const allProducts = await prisma.product.findMany();
  const productsWithoutImages = allProducts.filter(p => {
    return !p.images || p.images.length === 0 || p.images.some(img => img.trim() === '' || img.includes('placeholder-broken'));
  }).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug
  }));

  // 3. Servicios sin imágenes o con arrays vacíos/rotos
  const allServices = await prisma.service.findMany();
  const servicesWithoutImages = allServices.filter(s => {
    return !s.images || s.images.length === 0 || s.images.some(img => img.trim() === '' || img.includes('placeholder-broken'));
  }).map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug
  }));

  // 4. Búsqueda de Carteras Huérfanas (sin User existente)
  const wallets = await prisma.wallet.findMany({
    select: { userId: true }
  });
  const users = await prisma.user.findMany({
    select: { id: true }
  });
  const userIdsSet = new Set(users.map(u => u.id));
  const orphanWallets = wallets
    .filter(w => !userIdsSet.has(w.userId))
    .map(w => w.userId);

  // 5. Carteras con balances inconsistentes/negativos
  const inconsistentWallets = await prisma.wallet.findMany({
    where: {
      OR: [
        { balancePending: { lt: 0 } },
        { balanceValidated: { lt: 0 } },
        { balanceAvailable: { lt: 0 } }
      ]
    }
  });
  const walletsWithNegativeBalances = inconsistentWallets.map(w => ({
    userId: w.userId,
    pending: Number(w.balancePending),
    validated: Number(w.balanceValidated),
    available: Number(w.balanceAvailable)
  }));

  return {
    emptyCategories,
    productsWithoutImages,
    servicesWithoutImages,
    orphanWallets,
    walletsWithNegativeBalances
  };
}

function mapApiEndpoints(): string[] {
  const endpoints: string[] = [];
  const apiPath = path.join(APPS_WEB_DIR, 'app', 'api');

  function findRoutes(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findRoutes(fullPath);
      } else if (stat.isFile() && (file === 'route.ts' || file === 'route.js')) {
        const rel = path.relative(apiPath, fullPath);
        const endpoint = '/api/' + rel.replace(/[\\/]route\.(ts|js)$/, '').replace(/\\/g, '/');
        endpoints.push(endpoint);
      }
    }
  }

  findRoutes(apiPath);
  return endpoints;
}

async function main() {
  console.log('=====================================================');
  console.log('🕵️ Iniciando Diagnóstico Forense y de Seguridad...');
  console.log('=====================================================');

  try {
    const sastResults = await runSASTScan();
    console.log(`[SAST] Escaneo estático completado.`);
    console.log(`  - Claves expuestas detectadas: ${sastResults.exposedKeys.length}`);
    console.log(`  - Endpoints de API sin try-catch: ${sastResults.missingTryCatch.length}`);

    const dbResults = await runDataConsistencyAudit();
    console.log(`[DATA] Auditoría de base de datos completada.`);
    console.log(`  - Categorías vacías: ${dbResults.emptyCategories.length}`);
    console.log(`  - Productos sin assets visuales: ${dbResults.productsWithoutImages.length}`);
    console.log(`  - Servicios sin assets visuales: ${dbResults.servicesWithoutImages.length}`);
    console.log(`  - Wallets huérfanas: ${dbResults.orphanWallets.length}`);
    console.log(`  - Wallets con balances negativos: ${dbResults.walletsWithNegativeBalances.length}`);

    const apiEndpoints = mapApiEndpoints();
    console.log(`[API] Endpoints mapeados: ${apiEndpoints.length}`);

    // Exportar informe completo a JSON para consumo del reporte final
    const auditReport: AuditResult = {
      sast: sastResults,
      dataConsistency: dbResults,
      apiEndpoints
    };

    const outputPath = path.join(ROOT_DIR, 'audit_results', 'forensic_report.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(auditReport, null, 2), 'utf8');
    console.log(`\n[SUCCESS] Resultados de auditoría guardados en: ${outputPath}`);

  } catch (error) {
    console.error('[ERROR] Fallo crítico durante la ejecución de la auditoría:', error);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
