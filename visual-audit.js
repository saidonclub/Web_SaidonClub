const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'visual-audit-screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const PAGES = [
  { url: '/', name: '01-home' },
  { url: '/productos', name: '02-productos' },
  { url: '/servicios', name: '03-servicios' },
  { url: '/membresias', name: '04-membresias' },
  { url: '/auth/login', name: '05-login' },
  { url: '/auth/register', name: '06-register' },
  { url: '/contacto', name: '07-contacto' },
  { url: '/nosotros', name: '08-nosotros' },
  { url: '/terminos', name: '09-terminos' },
  { url: '/privacidad', name: '10-privacidad' },
];

const BASE = 'http://localhost:3000';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  const results = [];

  for (const page of PAGES) {
    const pg = await context.newPage();

    // Collect console errors
    const consoleErrors = [];
    pg.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    pg.on('pageerror', err => consoleErrors.push('PAGE ERROR: ' + err.message));

    try {
      const res = await pg.goto(BASE + page.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const status = res ? res.status() : 'NO_RESPONSE';

      // Wait a bit for JS to hydrate
      await pg.waitForTimeout(2000);

      // Full page screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, page.name + '.png');
      await pg.screenshot({ path: screenshotPath, fullPage: true });

      results.push({ url: page.url, status, consoleErrors, screenshot: screenshotPath });
      console.log(`[${status}] ${page.url} → ${screenshotPath}${consoleErrors.length ? ' | ERRORS: ' + consoleErrors.join('; ') : ''}`);
    } catch (err) {
      results.push({ url: page.url, status: 'TIMEOUT/ERROR', error: err.message, consoleErrors });
      console.log(`[ERROR] ${page.url}: ${err.message}`);
    }

    await pg.close();
  }

  // Special: test home page scrolled to TrustSection + Footer
  const pg2 = await context.newPage();
  await pg2.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await pg2.waitForTimeout(3000);
  // Scroll to bottom
  await pg2.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pg2.waitForTimeout(1000);
  await pg2.screenshot({ path: path.join(SCREENSHOTS_DIR, '01b-home-footer.png'), fullPage: false });
  console.log('[SCROLL] Home footer screenshot saved');

  // Scroll to trust section
  await pg2.evaluate(() => {
    const el = document.querySelector('section');
    const sections = document.querySelectorAll('section');
    if (sections.length > 0) sections[sections.length - 1].scrollIntoView();
  });
  await pg2.waitForTimeout(500);
  await pg2.screenshot({ path: path.join(SCREENSHOTS_DIR, '01c-home-trust.png'), fullPage: false });
  console.log('[SCROLL] TrustSection screenshot saved');
  await pg2.close();

  // Test newsletter form
  const pg3 = await context.newPage();
  await pg3.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await pg3.waitForTimeout(2000);
  await pg3.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pg3.waitForTimeout(1000);
  try {
    await pg3.fill('input[type="email"]', 'visual-audit@test.com');
    await pg3.click('button[type="submit"]');
    await pg3.waitForTimeout(2000);
    await pg3.screenshot({ path: path.join(SCREENSHOTS_DIR, '01d-newsletter-submitted.png'), fullPage: false });
    console.log('[FORM] Newsletter form submitted, screenshot saved');
  } catch (err) {
    console.log('[FORM] Newsletter form test failed:', err.message);
  }
  await pg3.close();

  await browser.close();
  console.log('\n=== AUDIT COMPLETE ===');
  console.log('Results:', JSON.stringify(results.map(r => ({ url: r.url, status: r.status, errors: r.consoleErrors })), null, 2));
}

run().catch(err => { console.error('FATAL:', err); process.exit(1); });
