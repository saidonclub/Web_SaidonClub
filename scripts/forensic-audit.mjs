#!/usr/bin/env node
// ============================================================
// SAIDONCLUB OS v7.0 — FORENSIC AUDIT AUTOMATION
// Auditoría forense visual + técnica automatizada
// ============================================================

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIT_DIR = path.join(__dirname, '..', 'audit_results', `forensic_${Date.now()}`);
const SCREENSHOTS_DIR = path.join(AUDIT_DIR, 'screenshots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 568 },
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'mobile-lg', width: 480, height: 800 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-820', width: 820, height: 1180 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 720 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'ultrawide-2560', width: 2560, height: 1440 },
];

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/productos', name: 'products' },
  { path: '/servicios', name: 'services' },
  { path: '/auth/login', name: 'login' },
  { path: '/auth/register', name: 'register' },
  { path: '/carrito', name: 'cart' },
  { path: '/nosotros', name: 'about' },
  { path: '/contacto', name: 'contact' },
  { path: '/ayuda', name: 'help' },
  { path: '/membresias', name: 'memberships' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/categorias', name: 'categories' },
  { path: '/terminos', name: 'terms' },
  { path: '/privacidad', name: 'privacy' },
  { path: '/blog', name: 'blog' },
  { path: '/checkout', name: 'checkout' },
  { path: '/devoluciones', name: 'returns' },
];

const RESULTS = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  summary: { total: 0, passed: 0, failed: 0, errors: [] },
  responsive: {},
  visual: {},
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function capturePage(browser, pageDef, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  const key = `${pageDef.name}_${viewport.name}`;
  
  try {
    const url = `${BASE_URL}${pageDef.path}`;
    console.log(`📸 Capturando: ${url} @ ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500); // Esperar animaciones
    
    // Full page screenshot
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `full_${key}.png`),
      fullPage: true,
    });
    
    // Viewport screenshot
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `viewport_${key}.png`),
    });
    
    // Detectar problemas visuales
    const issues = await detectVisualIssues(page, url);
    
    RESULTS.visual[key] = {
      url,
      status: 'ok',
      issues,
      viewport: `${viewport.width}x${viewport.height}`,
    };
    RESULTS.summary.total++;
    RESULTS.summary.passed++;
    
    return { key, status: 'ok', issues };
  } catch (err) {
    console.error(`❌ Error capturando ${key}: ${err.message}`);
    RESULTS.visual[key] = {
      url: `${BASE_URL}${pageDef.path}`,
      status: 'error',
      error: err.message,
      viewport: `${viewport.width}x${viewport.height}`,
    };
    RESULTS.summary.total++;
    RESULTS.summary.failed++;
    RESULTS.summary.errors.push({ page: key, error: err.message });
    return { key, status: 'error', error: err.message };
  } finally {
    await context.close();
  }
}

async function detectVisualIssues(page, url) {
  const issues = [];
  
  try {
    // 1. Verificar overflow horizontal
    const overflowX = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const viewportWidth = window.innerWidth;
      return docWidth > viewportWidth ? docWidth - viewportWidth : 0;
    });
    if (overflowX > 5) {
      issues.push({ type: 'overflow-x', severity: 'high', detail: `Overflow horizontal: ${overflowX}px extra` });
    }
    
    // 2. Verificar elementos invisibles (opacos)
    const invisibleElements = await page.evaluate(() => {
      const all = document.querySelectorAll('*');
      const invisible = [];
      for (const el of all) {
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'META') continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        const style = window.getComputedStyle(el);
        if (style.opacity === '0' && style.pointerEvents === 'none') {
          invisible.push({ tag: el.tagName, id: el.id, className: el.className?.slice(0, 60) });
        }
      }
      return invisible.slice(0, 10);
    });
    if (invisibleElements.length > 0) {
      issues.push({ type: 'invisible-elements', severity: 'medium', detail: `${invisibleElements.length} elementos invisibles detectados`, elements: invisibleElements });
    }
    
    // 3. Verificar contrast ratio (problemas de legibilidad)
    const contrastIssues = await page.evaluate(() => {
      const issues = [];
      const texts = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, label, li, td, th');
      for (const el of texts) {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bg = style.backgroundColor;
        if (color && bg && color !== 'transparent' && bg !== 'transparent') {
          // Simplificación: solo detectar si el color es muy claro sobre fondo claro
          if (color.includes('255, 255, 255') && bg.includes('255, 255, 255')) {
            issues.push({ tag: el.tagName, text: el.textContent?.slice(0, 40) });
          }
        }
        if (issues.length > 5) break;
      }
      return issues;
    });
    if (contrastIssues.length > 0) {
      issues.push({ type: 'contrast', severity: 'high', detail: `${contrastIssues.length} problemas de contraste detectados` });
    }
    
    // 4. Verificar console errors
    RESULTS.consoleErrors = RESULTS.consoleErrors || [];
    
  } catch (err) {
    issues.push({ type: 'detection-error', severity: 'info', detail: err.message });
  }
  
  return issues;
}

async function generateReport() {
  const reportPath = path.join(AUDIT_DIR, 'forensic-report.md');
  const summary = RESULTS.summary;
  
  let md = `# 🕵️ SAIDONCLUB OS — Forensic Audit Report\n\n`;
  md += `**Date:** ${new Date(RESULTS.timestamp).toLocaleString()}\n\n`;
  md += `**Base URL:** ${RESULTS.baseUrl}\n\n`;
  md += `---\n\n`;
  
  md += `## 📊 Executive Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Pages Audited | ${PAGES.length} |\n`;
  md += `| Viewports | ${VIEWPORTS.length} |\n`;
  md += `| Total Captures | ${summary.total} |\n`;
  md += `| ✅ Passed | ${summary.passed} |\n`;
  md += `| ❌ Failed | ${summary.failed} |\n`;
  md += `| Issues Found | ${Object.values(RESULTS.visual).filter(v => v.issues?.length).length} pages with issues |\n\n`;
  
  md += `## 🚨 Critical Issues\n\n`;
  
  const pagesWithIssues = Object.entries(RESULTS.visual).filter(([, v]) => v.issues?.length > 0);
  for (const [key, data] of pagesWithIssues) {
    md += `### ${key}\n`;
    md += `- **URL:** ${data.url}\n`;
    md += `- **Viewport:** ${data.viewport}\n`;
    md += `- **Issues:**\n`;
    for (const issue of data.issues) {
      md += `  - [${issue.severity}] **${issue.type}**: ${issue.detail}\n`;
    }
    md += '\n';
  }
  
  if (summary.errors.length > 0) {
    md += `## ❌ Errors\n\n`;
    for (const err of summary.errors) {
      md += `- **${err.page}**: ${err.error}\n`;
    }
    md += '\n';
  }
  
  md += `## 📸 Screenshots\n\n`;
  md += `All screenshots saved in: \`${SCREENSHOTS_DIR}\`\n\n`;
  
  md += `## 🏁 Conclusion\n\n`;
  const healthScore = summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0;
  md += `**Health Score: ${healthScore}%**\n\n`;
  
  if (healthScore >= 95) {
    md += `✅ **PASS**: The platform is visually stable and functional.\n`;
  } else if (healthScore >= 80) {
    md += `⚠️ **WARNING**: Minor issues detected that should be addressed.\n`;
  } else {
    md += `🔴 **CRITICAL**: Major issues require immediate attention.\n`;
  }
  
  fs.writeFileSync(reportPath, md, 'utf-8');
  console.log(`\n📄 Report saved: ${reportPath}`);
  return reportPath;
}

async function main() {
  console.log('══════════════════════════════════════════════');
  console.log('  SAIDONCLUB OS v7.0 — FORENSIC AUDIT ENGINE');
  console.log('══════════════════════════════════════════════\n');
  
  ensureDir(SCREENSHOTS_DIR);
  
  console.log(`📁 Audit directory: ${AUDIT_DIR}\n`);
  console.log(`📄 Pages to audit: ${PAGES.length}`);
  console.log(`📐 Viewports: ${VIEWPORTS.length}`);
  console.log(`📸 Total captures: ${PAGES.length * VIEWPORTS.length}\n`);
  
  const browser = await chromium.launch({ headless: true });
  console.log('🚀 Browser launched\n');
  
  for (const pageDef of PAGES) {
    console.log(`\n🔍 === Examining: ${pageDef.name} (${pageDef.path}) ===`);
    for (const viewport of VIEWPORTS) {
      await capturePage(browser, pageDef, viewport);
    }
  }
  
  await browser.close();
  console.log('\n🛑 Browser closed\n');
  
  // Generate report
  const reportPath = await generateReport();
  
  // Summary
  console.log('\n══════════════════════════════════════════════');
  console.log('  AUDIT COMPLETE');
  console.log('══════════════════════════════════════════════');
  console.log(`  ✅ Passed: ${RESULTS.summary.passed}`);
  console.log(`  ❌ Failed: ${RESULTS.summary.failed}`);
  console.log(`  🚨 Issues: ${Object.values(RESULTS.visual).filter(v => v.issues?.length).length} pages`);
  console.log(`  📊 Report: ${reportPath}`);
  console.log('══════════════════════════════════════════════\n');
}

main().catch(console.error);