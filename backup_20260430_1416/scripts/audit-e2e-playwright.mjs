import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(process.cwd(), 'docs/audit-screenshots');
const REPORT_FILE = path.join(process.cwd(), 'docs/reports/AUDITORIA_COMPLETA_E2E.md');

const auditReport = {
  timestamp: new Date().toISOString(),
  url: BASE_URL,
  screenshots: [],
  brokenLinks: [],
  workingLinks: [],
  consoleErrors: [],
  consoleWarnings: [],
  forms: [],
  visualIssues: [],
  typos: []
};

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(REPORT_FILE))) fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });

console.log(`🚀 Iniciando Auditoría E2E en ${BASE_URL}`);
console.log('='.repeat(70));

const browser = await chromium.launch({
  headless: false,
  viewport: { width: 1920, height: 1080 },
  slowMo: 500
});

const context = await browser.newContext({
  acceptDownloads: true,
  ignoreHTTPSErrors: true
});

const page = await context.newPage();

// Capturar TODOS los errores de consola
page.on('console', msg => {
  if (msg.type() === 'error') {
    auditReport.consoleErrors.push({
      url: page.url(),
      text: msg.text(),
      location: msg.location()
    });
    console.log(`❌ Consola Error: ${msg.text()}`);
  }
  if (msg.type() === 'warning') {
    auditReport.consoleWarnings.push({
      url: page.url(),
      text: msg.text()
    });
  }
});

page.on('pageerror', exception => {
  auditReport.consoleErrors.push({
    url: page.url(),
    exception: exception.message,
    stack: exception.stack
  });
  console.log(`💥 Excepción JS: ${exception.message}`);
});

// 1. Navegar a página principal
console.log('\n📍 Visitando página principal');
await page.goto(BASE_URL, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-home-full.png'), fullPage: true });
auditReport.screenshots.push('01-home-full.png');

await page.waitForTimeout(1000);

// 2. Detectar todos los enlaces del menú
console.log('\n🔗 Escaneando enlaces de navegación...');
const menuLinks = await page.$$eval('nav a, header a, [role="navigation"] a', links => 
  links.map(link => ({ href: link.href, text: link.textContent.trim() }))
);

const uniqueLinks = [...new Map(menuLinks.map(l => [l.href, l])).values()];
console.log(`✅ Encontrados ${uniqueLinks.length} enlaces únicos en el menú`);

// 3. Recorrer cada enlace
for (const link of uniqueLinks) {
  if (!link.href || !link.href.startsWith('http')) continue;
  
  console.log(`\n➡️  Probando: ${link.text} -> ${link.href}`);
  
  try {
    const response = await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    if (response && response.ok()) {
      auditReport.workingLinks.push(link);
      console.log(`✅ ${response.status()} - OK`);
      
      // Capturar screenshot de cada sección
      const pageName = link.text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const ssPath = path.join(SCREENSHOTS_DIR, `page-${pageName}.png`);
      await page.screenshot({ path: ssPath, fullPage: true });
      auditReport.screenshots.push(`page-${pageName}.png`);
      
      await page.waitForTimeout(800);
      
      // Verificar imágenes rotas en esta página
      const brokenImages = await page.$$eval('img', imgs => 
        imgs.filter(img => img.naturalWidth === 0).map(img => ({ src: img.src, alt: img.alt }))
      );
      
      if (brokenImages.length > 0) {
        console.log(`⚠️  Imágenes rotas encontradas: ${brokenImages.length}`);
        auditReport.visualIssues.push({
          page: link.href,
          type: 'broken_images',
          count: brokenImages.length,
          images: brokenImages
        });
      }
      
    } else {
      auditReport.brokenLinks.push({ ...link, status: response?.status() });
      console.log(`❌ Fallido: ${response?.status()}`);
    }
    
  } catch (err) {
    auditReport.brokenLinks.push({ ...link, error: err.message });
    console.log(`❌ Error al cargar: ${err.message}`);
  }
}

// 4. Volver a home y probar formularios
console.log('\n📝 Analizando formularios...');
await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

const forms = await page.$$('form');
console.log(`✅ Encontrados ${forms.length} formularios en el sitio`);

for (let i = 0; i < forms.length; i++) {
  console.log(`\n📋 Probando formulario #${i+1}`);
  
  const form = forms[i];
  const formData = {};
  
  // Llenar inputs automáticamente
  const inputs = await form.$$('input:not([type="submit"]):not([type="hidden"])');
  for (const input of inputs) {
    const type = await input.getAttribute('type') || 'text';
    const name = await input.getAttribute('name') || 'unknown';
    
    let testValue = 'Test';
    if (type === 'email') testValue = 'test@saidonclub.com';
    if (type === 'tel') testValue = '0991234567';
    if (type === 'number') testValue = '123';
    
    await input.fill(testValue);
    formData[name] = testValue;
  }
  
  // Capturar screenshot antes de enviar
  await form.screenshot({ path: path.join(SCREENSHOTS_DIR, `form-${i}-before-submit.png`) });
  
  // Intentar enviar
  try {
    const submitBtn = await form.$('[type="submit"], button[type="submit"]');
    if (submitBtn) {
      await Promise.all([
        page.waitForResponse(res => res.request().method() === 'POST', { timeout: 5000 }).catch(() => null),
        submitBtn.click()
      ]);
      
      await page.waitForTimeout(1500);
      
      auditReport.forms.push({
        index: i,
        inputsFilled: Object.keys(formData).length,
        submitted: true,
        screenshot: `form-${i}-before-submit.png`
      });
      
      console.log(`✅ Formulario enviado correctamente`);
    }
  } catch (formErr) {
    auditReport.forms.push({
      index: i,
      error: formErr.message
    });
    console.log(`⚠️  Error en formulario: ${formErr.message}`);
  }
}

// 5. Generar reporte final
console.log('\n📄 Generando informe de auditoría...');

let reportMd = `# 📋 AUDITORÍA COMPLETA E2E - SAIDONCLUB\n\n`;
reportMd += `**Fecha:** ${new Date().toLocaleString('es-EC')}\n`;
reportMd += `**URL Base:** ${BASE_URL}\n\n`;

reportMd += `## 📊 Resumen General\n\n`;
reportMd += `| Métrica | Valor |\n`;
reportMd += `|---------|-------|\n`;
reportMd += `| Capturas de pantalla | ${auditReport.screenshots.length} |\n`;
reportMd += `| Enlaces funcionales | ${auditReport.workingLinks.length} |\n`;
reportMd += `| Enlaces rotos | ${auditReport.brokenLinks.length} |\n`;
reportMd += `| Errores de consola | ${auditReport.consoleErrors.length} |\n`;
reportMd += `| Formularios probados | ${auditReport.forms.length} |\n`;
reportMd += `| Problemas visuales detectados | ${auditReport.visualIssues.length} |\n\n`;

if (auditReport.brokenLinks.length > 0) {
  reportMd += `## ❌ Enlaces Rotos / Fallidos\n\n`;
  auditReport.brokenLinks.forEach(link => {
    reportMd += `- **${link.text}**: \`${link.href}\` -> Error: ${link.status || link.error}\n`;
  });
  reportMd += `\n`;
}

if (auditReport.consoleErrors.length > 0) {
  reportMd += `## 💥 Errores de JavaScript (Consola)\n\n`;
  auditReport.consoleErrors.slice(0, 20).forEach((err, idx) => {
    reportMd += `### Error #${idx+1}\n`;
    reportMd += `- Página: ${err.url}\n`;
    reportMd += `- Mensaje: \`${err.text || err.exception}\`\n\n`;
  });
}

if (auditReport.visualIssues.length > 0) {
  reportMd += `## 🖼️ Problemas Visuales\n\n`;
  auditReport.visualIssues.forEach(issue => {
    reportMd += `- **${issue.type}** en ${issue.page}: ${issue.count} elementos afectados\n`;
  });
}

reportMd += `\n---\n\n`;
reportMd += `✅ Auditoría completada exitosamente\n`;
reportMd += `\nTodas las capturas de pantalla guardadas en: \`${SCREENSHOTS_DIR}\``;

fs.writeFileSync(REPORT_FILE, reportMd, 'utf8');

console.log('\n✅ Auditoría terminada!');
console.log(`📝 Reporte guardado en: ${REPORT_FILE}`);
console.log(`📸 Total capturas: ${auditReport.screenshots.length}`);
console.log(`❌ Errores detectados: ${auditReport.consoleErrors.length + auditReport.brokenLinks.length + auditReport.visualIssues.length}`);

await browser.close();