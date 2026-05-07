#!/usr/bin/env node
/**
 * SaidonClub OS v5.2 — Startup Protector
 * Archivo: scripts/startup-guard.js
 * 
 * Este script se ejecuta ANTES de `next dev` para garantizar
 * que el entorno está limpio y no hay caché corrupta.
 * 
 * Uso: node scripts/startup-guard.js && npm run dev
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..', 'apps', 'web');
const NEXT_DIR = path.join(ROOT, '.next');
const GLOBALS_CSS = path.join(ROOT, 'app', 'globals.css');
const LAYOUT_TSX = path.join(ROOT, 'app', 'layout.tsx');

const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';

let errors = 0;
let fixes  = 0;

console.log(`\n${CYAN}╔════════════════════════════════════╗`);
console.log(`║  SaidonClub Startup Guard v1.0     ║`);
console.log(`╚════════════════════════════════════╝${RESET}\n`);

// ── 1. Verificar globals.css ──────────────────────────────────
process.stdout.write('Verificando globals.css... ');
if (!fs.existsSync(GLOBALS_CSS)) {
  console.log(`${RED}FALTA${RESET}`);
  console.error(`  ERROR: ${GLOBALS_CSS} no existe`);
  errors++;
} else {
  const css = fs.readFileSync(GLOBALS_CSS, 'utf8');
  const tokens = ['--clr-orange', '--clr-bg-base', 'Inter', 'Obsidian'];
  const missing = tokens.filter(t => !css.includes(t));
  if (missing.length > 0) {
    console.log(`${RED}CORRUPTO${RESET}`);
    console.error(`  ERROR: Tokens faltantes: ${missing.join(', ')}`);
    errors++;
  } else {
    console.log(`${GREEN}OK${RESET} (${css.length} bytes, tokens completos)`);
  }
}

// ── 2. Verificar import en layout.tsx ────────────────────────
process.stdout.write('Verificando layout.tsx import... ');
if (!fs.existsSync(LAYOUT_TSX)) {
  console.log(`${RED}FALTA${RESET}`);
  errors++;
} else {
  const layout = fs.readFileSync(LAYOUT_TSX, 'utf8');
  if (!layout.includes('globals.css')) {
    console.log(`${RED}SIN IMPORT${RESET}`);
    console.error('  ERROR: layout.tsx no importa globals.css');
    errors++;
  } else {
    console.log(`${GREEN}OK${RESET}`);
  }
}

// ── 3. Detectar caché .next corrupta ─────────────────────────
process.stdout.write('Verificando caché .next... ');
if (fs.existsSync(NEXT_DIR)) {
  const cssStaticDir = path.join(NEXT_DIR, 'static', 'css');
  if (fs.existsSync(cssStaticDir)) {
    const cssFiles = fs.readdirSync(cssStaticDir);
    const emptyFiles = cssFiles.filter(f => {
      const fullPath = path.join(cssStaticDir, f);
      return fs.statSync(fullPath).size === 0;
    });
    if (emptyFiles.length > 0) {
      console.log(`${YELLOW}CORRUPTA (${emptyFiles.length} CSS vacíos)${RESET}`);
      console.log(`  Limpiando caché corrupta...`);
      fs.rmSync(NEXT_DIR, { recursive: true, force: true });
      console.log(`  ${GREEN}Caché eliminada — recompilación limpia${RESET}`);
      fixes++;
    } else {
      console.log(`${GREEN}OK${RESET} (${cssFiles.length} archivos CSS)`);
    }
  } else {
    console.log(`${YELLOW}Sin CSS compilado aún — normal en primera ejecución${RESET}`);
  }
} else {
  console.log(`${YELLOW}No existe — primera compilación${RESET}`);
}

// ── 4. Verificar next.config.js ──────────────────────────────
process.stdout.write('Verificando next.config.js... ');
const nextConfig = path.join(ROOT, 'next.config.js');
if (!fs.existsSync(nextConfig)) {
  console.log(`${RED}FALTA${RESET}`);
  errors++;
} else {
  console.log(`${GREEN}OK${RESET}`);
}

// ── 5. Resumen ────────────────────────────────────────────────
console.log(`\n${'─'.repeat(42)}`);
if (errors > 0) {
  console.log(`${RED}✗ ${errors} error(s) críticos encontrados${RESET}`);
  console.log(`${RED}  El servidor NO debería iniciar en este estado${RESET}`);
  process.exit(1);
} else if (fixes > 0) {
  console.log(`${YELLOW}⚠ ${fixes} problema(s) corregido(s) automáticamente${RESET}`);
  console.log(`${GREEN}✓ Sistema listo para iniciar${RESET}\n`);
  process.exit(0);
} else {
  console.log(`${GREEN}✓ Sistema completamente saludable — iniciando servidor...${RESET}\n`);
  process.exit(0);
}
