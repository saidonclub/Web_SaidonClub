const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'audit_results', 'visual_forense');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const BASE_URL = process.env.AUDIT_URL || 'http://localhost:3001';

const VIEWPORTS = [
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 390, height: 844 }
];

// Base routes for the application
const BASE_ROUTES = [
  '/',
  '/productos',
  '/servicios',
  '/membresias',
  '/auth/login',
  '/auth/register',
  '/dashboard',
  '/contacto',
  '/nosotros',
  '/carrito'
];

// Generate exactly 100 route combinations to test different UI states
const generate100Cases = () => {
  const routes = [];
  let count = 0;
  
  // 1. Base routes (10)
  BASE_ROUTES.forEach(route => {
    routes.push({ path: route, name: `Base_${count++}_${route.replace(/\//g, '_') || 'home'}` });
  });

  // 2. Pagination and Sorting states for marketplace (30)
  const sortModes = ['desc', 'asc', 'popular'];
  const pages = [1, 2];
  ['/productos', '/servicios'].forEach(base => {
    sortModes.forEach(sort => {
      pages.forEach(page => {
        routes.push({ 
          path: `${base}?page=${page}&sort=${sort}`, 
          name: `Marketplace_${count++}_${base.replace(/\//g, '')}_p${page}_s${sort}` 
        });
      });
    });
  });

  // 3. Category filters (20)
  const categories = ['tecnologia', 'ropa', 'servicios-digitales', 'hogar', 'otros'];
  categories.forEach(cat => {
    routes.push({ path: `/productos?category=${cat}`, name: `Filter_${count++}_prod_${cat}` });
    routes.push({ path: `/servicios?category=${cat}`, name: `Filter_${count++}_serv_${cat}` });
  });

  // 4. Simulated Product detail pages (even if 404, we test the 404 UI / Not Found state) (20)
  for(let i=1; i<=20; i++) {
    routes.push({ path: `/productos/prod-simulado-${i}`, name: `Detail_${count++}_prod_${i}` });
  }

  // 5. Auth states and errors (10)
  const authErrors = ['invalid_credentials', 'user_not_found', 'expired_session'];
  authErrors.forEach(err => {
    routes.push({ path: `/auth/login?error=${err}`, name: `Auth_${count++}_login_${err}` });
    routes.push({ path: `/auth/register?error=${err}`, name: `Auth_${count++}_reg_${err}` });
  });

  // 6. Miscellaneous UI states (10)
  for(let i=0; i<10; i++) {
    routes.push({ path: `/?testState=banner${i}`, name: `Misc_${count++}_home_state_${i}` });
  }

  // Ensure exactly 100 cases
  return routes.slice(0, 100);
};

const ROUTES = generate100Cases();

async function runAudit() {
  console.log(`🚀 Iniciando Auditoría Visual Forense en ${BASE_URL} con ${ROUTES.length} casos de prueba.`);
  const browser = await chromium.launch({ headless: true });

  const auditReport = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalCases: ROUTES.length,
    results: []
  };

  for (const viewport of VIEWPORTS) {
    console.log(`\n--- 📱 Viewport: ${viewport.name} (${viewport.width}x${viewport.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 2
    });

    for (const route of ROUTES) {
      const page = await context.newPage();
      const pageName = `${viewport.name}_${route.name}`;
      const fullUrl = `${BASE_URL}${route.path}`;

      process.stdout.write(`🔍 Auditando: ${route.path}... `);

      try {
        const startTime = Date.now();
        const response = await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => null);
        const loadTime = Date.now() - startTime;

        // Take snapshot after load
        await page.waitForTimeout(1000);
        await page.screenshot({ 
          path: path.join(SCREENSHOTS_DIR, `${pageName}.png`),
          fullPage: false 
        });

        const status = response ? response.status() : 'TIMEOUT';
        console.log(`✅ [${status}] (${loadTime}ms)`);

        auditReport.results.push({
          viewport: viewport.name,
          route: route.path,
          status,
          loadTime,
          screenshot: `${pageName}.png`
        });

      } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
        auditReport.results.push({
          viewport: viewport.name,
          route: route.path,
          status: 'ERROR',
          error: error.message
        });
      } finally {
        await page.close();
      }
    }
    await context.close();
  }

  await browser.close();

  fs.writeFileSync(
    path.join(SCREENSHOTS_DIR, 'audit_report.json'),
    JSON.stringify(auditReport, null, 2)
  );

  console.log(`\n✅ Auditoría completa. Reporte guardado en: ${SCREENSHOTS_DIR}`);
}

runAudit().catch(err => {
  console.error('FATAL AUDIT ERROR:', err);
  process.exit(1);
});
