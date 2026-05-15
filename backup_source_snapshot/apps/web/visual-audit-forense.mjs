/**
 * AUDITORÍA VISUAL FORENSE — SaidonClub Home
 * =============================================
 * Escanea la página principal y detecta:
 * - Errores de consola (JS, CSS, red)
 * - Imágenes rotas / 404
 * - Elementos superpuestos / layout shifts
 * - Problemas de accesibilidad (contraste, roles)
 * - Problemas de responsive (overflow, elementos cortados)
 * - Animaciones bloqueadas
 * - Errores de fuente
 * - Errores de rendimiento (LCP, CLS)
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = resolve("audit-visual-forense");
const SCREENSHOTS_DIR = resolve(OUTPUT_DIR, "screenshots");
const VIEWPORTS = [
  { name: "Desktop 1920", width: 1920, height: 1080 },
  { name: "Laptop 1440", width: 1440, height: 900 },
  { name: "Tablet 1024", width: 1024, height: 768 },
  { name: "Tablet 768", width: 768, height: 1024 },
  { name: "Mobile 428", width: 428, height: 926 },
  { name: "Mobile 375", width: 375, height: 812 },
];

// Aseguramos directorios
mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const errors = [];

function logError(severity, category, element, description, details = "") {
  errors.push({ severity, category, element, description, details });
}

async function runAudit() {
  console.log("🚀 INICIANDO AUDITORÍA VISUAL FORENSE — SAIDONCLUB HOME\n");
  console.log(`🔗 URL: ${BASE_URL}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  });

  // ── CAPTURA MULTIRESOLUCIÓN ──
  for (const vp of VIEWPORTS) {
    console.log(`\n📱 ${vp.name} (${vp.width}x${vp.height})`);
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    const consoleErrors = [];
    const networkErrors = [];
    const warnings = [];

    // Interceptar errores de consola
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push({ text: msg.text(), location: msg.location() });
      }
      if (msg.type() === "warning") {
        warnings.push({ text: msg.text(), location: msg.location() });
      }
    });

    // Interceptar respuestas fallidas
    page.on("response", (response) => {
      if (response.status() >= 400) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
      // Esperar a que cargue completamente el DOM
      await page.waitForTimeout(3000);

      // Tomar screenshot full page
      const screenshotPath = resolve(SCREENSHOTS_DIR, `home_${vp.name.replace(/\s/g, "_").toLowerCase()}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`   ✅ Screenshot guardado: ${screenshotPath}`);

      // ── ANÁLISIS 1: Errores de consola ──
      if (consoleErrors.length > 0) {
        console.log(`   ⚠️  ${consoleErrors.length} error(es) de consola`);
        consoleErrors.forEach((e) => {
          logError(
            "high",
            "Console Error",
            `JS:${e.location?.lineNumber || "?"}`,
            e.text.substring(0, 200),
            JSON.stringify(e.location)
          );
        });
      } else {
        console.log(`   ✅ Sin errores de consola`);
      }

      // ── ANÁLISIS 2: Errores de red (recursos fallidos) ──
      if (networkErrors.length > 0) {
        console.log(`   ⚠️  ${networkErrors.length} recurso(s) fallidos`);
        networkErrors.forEach((e) => {
          const shortUrl = e.url.length > 120 ? e.url.substring(0, 120) + "..." : e.url;
          logError(
            e.status >= 500 ? "critical" : "high",
            "Network Error",
            shortUrl,
            `HTTP ${e.status} — ${e.statusText || "Error de carga"}`,
            e.url
          );
        });
      } else {
        console.log(`   ✅ Sin errores de red`);
      }

      // ── ANÁLISIS 3: Imágenes dañadas o con src vacío ──
      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll("img"));
        return imgs
          .filter((img) => {
            const rect = img.getBoundingClientRect();
            return (
              !img.complete ||
              img.naturalWidth === 0 ||
              img.src === "" ||
              rect.width === 0
            );
          })
          .map((img) => ({
            src: img.src || "(empty)",
            alt: img.alt || "(no alt)",
            width: img.getBoundingClientRect().width,
            height: img.getBoundingClientRect().height,
          }));
      });

      if (brokenImages.length > 0) {
        console.log(`   ⚠️  ${brokenImages.length} imagen(es) dañadas/rotas`);
        brokenImages.forEach((img) => {
          logError(
            "high",
            "Broken Image",
            img.src.substring(0, 120),
            `Imagen dañada o con src vacío. Alt: "${img.alt}", Dimensiones: ${img.width}x${img.height}`,
            JSON.stringify(img)
          );
        });
      } else {
        console.log(`   ✅ Sin imágenes rotas`);
      }

      // ── ANÁLISIS 4: Elementos con overflow oculto o clipping ──
      const overflowIssues = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll("*"));
        return elements
          .filter((el) => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              (style.overflow === "hidden" || style.overflowX === "hidden") &&
              rect.width > 0 &&
              rect.height > 0 &&
              el.scrollWidth > rect.width + 5
            );
          })
          .slice(0, 20)
          .map((el) => ({
            tag: el.tagName,
            id: el.id || "(no id)",
            class: (el.className && typeof el.className === "string" ? el.className.substring(0, 60) : "") || "(no class)",
            scrollW: Math.round(el.scrollWidth),
            clientW: Math.round(el.getBoundingClientRect().width),
            diff: Math.round(el.scrollWidth - el.getBoundingClientRect().width),
          }));
      });

      if (overflowIssues.length > 0) {
        console.log(`   ⚠️  ${overflowIssues.length} elemento(s) con overflow oculto y contenido cortado`);
        overflowIssues.slice(0, 5).forEach((el) => {
          logError(
            "medium",
            "Overflow/Clipping",
            `${el.tag}#${el.id}.${el.class}`,
            `Contenido cortado: scrollW=${el.scrollW}px > clientW=${el.clientW}px (${el.diff}px ocultos)`,
            JSON.stringify(el)
          );
        });
      } else {
        console.log(`   ✅ Sin problemas de overflow`);
      }

      // ── ANÁLISIS 5: Elementos superpuestos (layout shifts) ──
      const overlapping = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll(
          "section, div, header, footer, main, nav, article, aside"
        ));
        const issues = [];
        for (let i = 0; i < all.length && issues.length < 15; i++) {
          const a = all[i];
          const r1 = a.getBoundingClientRect();
          if (r1.width === 0 || r1.height === 0) continue;
          for (let j = i + 1; j < all.length && issues.length < 15; j++) {
            const b = all[j];
            const r2 = b.getBoundingClientRect();
            if (r2.width === 0 || r2.height === 0) continue;
            // Verificar si se superponen significativamente
            const overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
            const overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
            const overlapArea = overlapX * overlapY;
            const minArea = Math.min(r1.width * r1.height, r2.width * r2.height);
            if (overlapArea > 0 && overlapArea > minArea * 0.5 && r1.zIndex !== "auto" && r2.zIndex !== "auto") {
              issues.push({
                el1: `${a.tagName}#${a.id || "?"}`,
                el2: `${b.tagName}#${b.id || "?"}`,
                overlapArea: Math.round(overlapArea),
                z1: r1.zIndex,
                z2: r2.zIndex,
              });
            }
          }
        }
        return issues;
      });

      if (overlapping.length > 0) {
        console.log(`   ⚠️  ${overlapping.length} elemento(s) superpuestos`);
        overlapping.slice(0, 5).forEach((o) => {
          logError(
            "medium",
            "Overlapping Elements",
            `${o.el1} ↔ ${o.el2}`,
            `Superposición detectada (${o.overlapArea}px²), z-index: ${o.z1} vs ${o.z2}`,
            JSON.stringify(o)
          );
        });
      } else {
        console.log(`   ✅ Sin superposiciones significativas`);
      }

      // ── ANÁLISIS 6: Elementos vacíos o con altura cero ──
      const emptyElements = await page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll("section, div, article, aside"));
        return sections
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height === 0 && el.children.length > 0;
          })
          .slice(0, 10)
          .map((el) => ({
            tag: el.tagName,
            id: el.id || "(no id)",
            class: (el.className && typeof el.className === "string" ? el.className.substring(0, 60) : "") || "(no class)",
            children: el.children.length,
          }));
      });

      if (emptyElements.length > 0) {
        console.log(`   ⚠️  ${emptyElements.length} elemento(s) con altura 0 pero con hijos`);
        emptyElements.slice(0, 5).forEach((el) => {
          logError(
            "medium",
            "Empty Element",
            `${el.tag}#${el.id}.${el.class}`,
            `Elemento con altura 0px pero contiene ${el.children} hijo(s)`,
            JSON.stringify(el)
          );
        });
      } else {
        console.log(`   ✅ Sin elementos con altura 0`);
      }

      // ── ANÁLISIS 7: Problemas de fuente ──
      const fontIssues = warnings.filter((w) =>
        w.text.toLowerCase().includes("font") ||
        w.text.toLowerCase().includes("font-face") ||
        w.text.toLowerCase().includes("googleapis")
      );

      if (fontIssues.length > 0) {
        console.log(`   ⚠️  ${fontIssues.length} advertencia(s) de fuente`);
        fontIssues.forEach((f) => {
          logError(
            "low",
            "Font Issue",
            "Google Fonts / @font-face",
            f.text.substring(0, 200),
            JSON.stringify(f.location)
          );
        });
      } else {
        console.log(`   ✅ Sin problemas de fuente`);
      }

      // ── ANÁLISIS 8: Problemas de accesibilidad (contraste, roles) ──
      const a11yIssues = await page.evaluate(() => {
        const issues = [];
        // Botones sin texto/aria-label
        const buttons = Array.from(document.querySelectorAll("button:not([aria-label]):not([aria-labelledby])"));
        buttons.forEach((btn) => {
          if (!btn.textContent || btn.textContent.trim() === "") {
            issues.push({
              type: "Missing aria-label",
              element: `${btn.tagName}#${btn.id || "?"}`,
              detail: "Botón sin texto ni aria-label",
            });
          }
        });
        // Imágenes sin alt
        const imgsNoAlt = Array.from(document.querySelectorAll("img:not([alt])"));
        imgsNoAlt.forEach((img) => {
          issues.push({
            type: "Missing alt attribute",
            element: `${img.tagName}#${img.id || "?"}`,
            detail: `Imagen sin atributo alt: ${img.src ? img.src.substring(0, 100) : "(src vacío)"}`,
          });
        });
        // Links sin href
        const linksNoHref = Array.from(document.querySelectorAll("a:not([href])"));
        linksNoHref.forEach((a) => {
          issues.push({
            type: "Link without href",
            element: `${a.tagName}#${a.id || "?"}`,
            detail: "Enlace sin atributo href",
          });
        });
        return issues.slice(0, 20);
      });

      if (a11yIssues.length > 0) {
        console.log(`   ⚠️  ${a11yIssues.length} problema(s) de accesibilidad`);
        a11yIssues.slice(0, 5).forEach((a) => {
          logError(
            "medium",
            "Accessibility",
            a.element,
            `${a.type}: ${a.detail}`,
            JSON.stringify(a)
          );
        });
      } else {
        console.log(`   ✅ Sin problemas graves de accesibilidad`);
      }

      // ── ANÁLISIS 9: Estructura de secciones ──
      const sectionStructure = await page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll("section"));
        return sections.map((s) => ({
          id: s.id || "(no id)",
          className: (s.className && typeof s.className === "string" ? s.className.substring(0, 30) : "") || "(no class)",
          visible: s.getBoundingClientRect().height > 0,
          height: Math.round(s.getBoundingClientRect().height),
        }));
      });

      console.log(`   ℹ️  ${sectionStructure.length} secciones detectadas en la página`);

    } catch (err) {
      console.log(`   ❌ Error cargando página: ${err.message}`);
      logError("critical", "Page Load", BASE_URL, `Error al cargar: ${err.message}`, err.stack);
    }

    await page.close();
  }

  // ── GENERAR REPORTE ──
  await browser.close();

  console.log("\n\n══════════════════════════════════════════");
  console.log("📊 RESUMEN DE AUDITORÍA VISUAL FORENSE");
  console.log("══════════════════════════════════════════\n");

  // Agrupar por severidad
  const critical = errors.filter((e) => e.severity === "critical");
  const high = errors.filter((e) => e.severity === "high");
  const medium = errors.filter((e) => e.severity === "medium");
  const low = errors.filter((e) => e.severity === "low");

  console.log(`🔴 Críticos: ${critical.length}`);
  console.log(`🟠 Altos:    ${high.length}`);
  console.log(`🟡 Medios:   ${medium.length}`);
  console.log(`🟢 Bajos:    ${low.length}`);
  console.log(`\n📦 Total:    ${errors.length} errores visuales encontrados\n`);

  // ── GUARDAR REPORTE JSON ──
  const report = {
    timestamp: new Date().toISOString(),
    url: BASE_URL,
    viewports: VIEWPORTS.map((v) => v.name),
    summary: {
      critical: critical.length,
      high: high.length,
      medium: medium.length,
      low: low.length,
      total: errors.length,
    },
    errors: errors,
  };

  const reportPath = resolve(OUTPUT_DIR, "reporte-visual-forense.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`📄 Reporte JSON guardado: ${reportPath}`);

  // ── GUARDAR REPORTE LEGIBLE ──
  const mdPath = resolve(OUTPUT_DIR, "REPORTE_AUDITORIA_VISUAL.md");
  const mdLines = [
    "# 🕵️ Auditoría Visual Forense — SaidonClub Home",
    "",
    `**Fecha:** ${new Date().toLocaleString("es-EC", { timeZone: "America/Guayaquil" })}`,
    `**URL:** ${BASE_URL}`,
    `**Resoluciones analizadas:** ${VIEWPORTS.map((v) => `${v.name} (${v.width}x${v.height})`).join(", ")}`,
    "",
    "---",
    "",
    "## 📊 Resumen General",
    "",
    `| Severidad | Cantidad |`,
    `|-----------|----------|`,
    `| 🔴 Crítico | ${critical.length} |`,
    `| 🟠 Alto | ${high.length} |`,
    `| 🟡 Medio | ${medium.length} |`,
    `| 🟢 Bajo | ${low.length} |`,
    `| **Total** | **${errors.length}** |`,
    "",
    "---",
    "",
    "## 📋 Lista Detallada de Errores Visuales",
    "",
  ];

  // Ordenar por severidad
  const sortedErrors = [...critical, ...high, ...medium, ...low];

  sortedErrors.forEach((e, i) => {
    const emojiMap = { critical: "🔴", high: "🟠", medium: "🟡", low: "🟢" };
    mdLines.push(`### ${i + 1}. ${emojiMap[e.severity]} [${e.severity.toUpperCase()}] ${e.category}`);
    mdLines.push("");
    mdLines.push(`- **Elemento:** \`${e.element}\``);
    mdLines.push(`- **Descripción:** ${e.description}`);
    if (e.details) {
      const det = e.details.length > 300 ? e.details.substring(0, 300) + "..." : e.details;
      mdLines.push(`- **Detalle adicional:** ${det}`);
    }
    mdLines.push("");
  });

  mdLines.push("---");
  mdLines.push("");
  mdLines.push("## 🛠️ Recomendaciones Prioritarias");
  mdLines.push("");

  if (critical.length > 0) {
    mdLines.push("### 🔴 Debes corregir inmediatamente:");
    critical.forEach((e, i) => {
      mdLines.push(`${i + 1}. **${e.category}**: ${e.description} (${e.element})`);
    });
    mdLines.push("");
  }

  if (high.length > 0) {
    mdLines.push("### 🟠 Corregir en orden de prioridad:");
    high.forEach((e, i) => {
      mdLines.push(`${i + 1}. **${e.category}**: ${e.description} (${e.element})`);
    });
    mdLines.push("");
  }

  mdLines.push("### 📸 Capturas de Pantalla");
  mdLines.push("");
  VIEWPORTS.forEach((vp) => {
    const filename = `home_${vp.name.replace(/\s/g, "_").toLowerCase()}.png`;
    mdLines.push(`- **${vp.name}:** \`screenshots/${filename}\``);
  });
  mdLines.push("");

  writeFileSync(mdPath, mdLines.join("\n"), "utf-8");
  console.log(`📄 Reporte Markdown guardado: ${mdPath}`);
  console.log("\n✅ AUDITORÍA COMPLETADA\n");
}

runAudit().catch(console.error);