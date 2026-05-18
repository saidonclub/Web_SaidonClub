# 🧠 SAIDONCLUB OS v5.2 — MASTER CONTEXT DOCUMENT
> **LECTURA OBLIGATORIA** antes de ejecutar cualquier tarea. Este documento reemplaza briefings repetidos.
> **Última actualización:** 2026-04-25 | **Estado:** FASE 1 — Auditoría Premium UI y Respaldos completada

---

## ⚡ IDENTIDAD DEL PROYECTO (LEE ESTO PRIMERO)

| Campo | Valor |
|-------|-------|
| **Nombre** | SaidonClub OS v5.2 |
| **Propietario** | SaidonClub Global |
| **Contacto oficial** | +593 98 378 8477 |
| **Email admin** | admin@saidonclub.com |
| **Naturaleza** | Marketplace + MLM + Servicios (todo en uno) |
| **Stack** | Next.js 15 · Supabase · Prisma · Turborepo · pnpm |
| **Arquitectura** | Multi-país · Multi-ciudad · Multi-moneda |
| **Directorio** | `c:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub` |

---

## 🏗️ ARQUITECTURA DEL MONOREPO

```
saidonclub-os/
├── apps/web/                   # Next.js 15 App Router (Multi-language & Theme support)
├── packages/
│   ├── database/               # ✅ Prisma (Multi-schema: public/auth) + Supabase
│   ├── config-engine/          # ✅ ConfigManager singleton
│   ├── mlm-engine/             # 🔄 Motor MLM (Regalías, Rangos, Puntos)
│   ├── marketplace-core/       # ⏳ Lógica carrito con geolocalización
│   ├── auth/                   # ⏳ Autenticación con patrocinador
│   ├── types/                  # ✅ TypeScript contracts (Country, City, User roles)
│   ├── ui/                     # 🔄 Componentes (Dark/Light mode support)
│   └── ts-config/              # ✅ tsconfig compartido
├── supabase/functions/         # ⏳ Edge Functions (cron cierre)
├── package.json                # ✅ (v5.2.0)
├── pnpm-workspace.yaml         # ✅
└── turbo.json                  # ✅

Leyenda: ✅ COMPLETADO | 🔄 EN PROGRESO | ⏳ PENDIENTE
```

---

## 🔴 REGLAS INQUEBRANTABLES

### R1 — ZERO HARDCODING
```
❌ PROHIBIDO: const royaltyLevel = 8;
✅ OBLIGATORIO: const level = await config.get<number>('mlm_royalty_levels', 8);
```

### R2 — ACID PARA FINANZAS
Toda operación que toque Commission, Wallet, SeedBonus o FundsReserve DEBE ejecutarse dentro de `prisma.$transaction()`.

### R3 — SIEMPRE EN ESPAÑOL (UI) / INGLÉS (CODE)
Comunicación con usuario: español (default) + multi-idioma. Comentarios en código: español. Variables/funciones: inglés.

### R4 — SIN CREDENCIALES EN CÓDIGO
Solo en `.env.local`. Nunca en git.

### R5 — PATROCINADOR OBLIGATORIO
Sin `affiliateCode` válido, no hay registro. Sin excepciones (excepto primer usuario por Super Admin).

### R6 — VERIFICACIÓN VISUAL MANDATORIA
Ningún cambio de UI sin screenshot de confirmación. **USAR SIEMPRE `mcp_chrome-devtools-mcp_take_screenshot`** (NO el agente visual `browser_subagent` que consume cuotas y es inestable).

### R7 — CONTROL DE VERSIONES
Cada sesión termina con git commit. Formato: `feat(scope): descripción`

### R8 — NO MATAR PROCESOS AJENOS
Nunca `taskkill /IM chrome.exe`. Usar PID exacto si es necesario.

### R8.1 — NAVEGADOR OFICIAL ÚNICO
Solo se permite el uso del navegador que esté activamente logueado con la cuenta `saidonclub@gmail.com`. Está terminantemente prohibido abrir o utilizar cualquier otra instancia de navegador o modo incógnito que no comparta esta sesión.

### R9 — CONFIG ENGINE PRIMERO
Antes de implementar cualquier feature con valores configurable, crear el seed en SystemConfig.

### R10 — IMPORTS CANÓNICOS
```typescript
import { prisma } from '@saidonclub/database';
import { config } from '@saidonclub/config-engine';
```

---

## 👥 EQUIPO MULTI-AGENTE

| # | Agente | Scope | Estado |
|---|--------|-------|--------|
| 0 | **ANTIGRAVITY (Orquestador)** | Todo el proyecto | Activo |
| 1 | **DB Architect** | `packages/database/` | Semana 1-2 (Multi-schema) |
| 2 | **Backend Engineer** | `apps/web/actions/` · `api/` | Semana 2-3 |
| 3 | **MLM/Math Engineer** | `packages/mlm-engine/` | Semana 1-2 |
| 4 | **Frontend Engineer** | `apps/web/` · `packages/ui/` | Semana 2-5 (Theme/i18n) |
| 10 | **Documentation** | Docs · README · Comentarios | Continuo |

---

## 📅 PLAN DE TRABAJO — FASE "EXPANSIÓN GLOBAL"

### ✅ FASE 0: Cimentación (COMPLETADA)
- [x] Turborepo + pnpm + workspace
- [x] ConfigManager con cache
- [x] `prisma generate` exitoso

### 🔄 FASE 1: Infraestructura Multi-Geográfica (COMPLETADA)
**Hitos Alcanzados:**
- [x] Migración a Multi-schema (public/auth) en Prisma.
- [x] **Auditoría de DB y Autenticación:** [Reporte 23-04](docs/reports/database_auth_audit_2026-04-23.md).
- [x] **Auditoría Premium UI:** [Reporte 25-04](docs/reports/UI_PREMIUM_AUDIT_2026_04_25.md) (Restauración de branding y Motor de Temas).
- [x] Modelos `Country` y `City` implementados.
- [x] **Seed Maestro:** 300 productos y 100 servicios cargados.
- [x] **Estrategia de Respaldos:** Snapshot JSON generado.

### ⏳ FASE 2: Marketplace Dinámico y Checkout
- [ ] **Geolocalización Automática:** Detectar IP para pre-seleccionar ciudad.
- [ ] **Filtros de Búsqueda Avanzados:** Categoría, rango de precio y cercanía.
- [ ] **Carrito de Compras Premium:**
    - [ ] Persistencia en `localStorage` sincronizada con DB.
    - [ ] Manejo de múltiples monedas (USD / SaidonPoints).
- [ ] **Checkout Integration:**
    - [ ] Pasarela Stripe (Pagos externos).
    - [ ] SaidonWallet (Pagos internos con puntos).
    - [ ] Webhooks para confirmación de pedido.

### ⏳ FASE 3: Motor MLM y Finanzas (El Corazón del Negocio)
- [ ] **Visualizador de Red (Genealogía):**
    - [ ] Vista de árbol (Canvas/SVG) para Pioneros.
    - [ ] Buscador de descendientes por ID/Nombre.
- [ ] **Motor de Liquidación Semanal:**
    - [ ] Script de cálculo de regalías por niveles.
    - [ ] Reparto de Pool Global.
    - [ ] Automatización de Cierre (Viernes 17:00).
- [ ] **Wallet de Usuario:**
    - [ ] Historial de transacciones (Depósitos, Retiros, Comisiones).
    - [ ] Sistema de retiro a cuenta bancaria (Solicitud -> Admin).

### ⏳ FASE 4: Dashboards y Perfiles
- [ ] **Dashboard Pionero:** Resumen de red, puntos del mes, rango actual y meta de ascenso.
- [ ] **Dashboard Proveedor:** Gestión de servicios, edición de precios y fotos.
- [ ] **Dashboard Admin:** Monitor de sistema, gestión de tickets y aprobación de retiros.
- [ ] **Perfil Público:** Tarjeta de presentación para proveedores de servicios con reseñas y geolocalización.

---

## 💰 REGLAS DE NEGOCIO MLM (REFERENCIA RÁPIDA)

| Concepto | Valor | Config Key |
|----------|-------|------------|
| Membresía Preferente | $39 | `membership_preferente_price` |
| Membresía Pionero | $129 | `membership_pionero_price` |
| Productos incluidos Preferente | $10 | `membership_preferente_products_value` |
| Productos incluidos Pionero | $30 | `membership_pionero_products_value` |
| Niveles de regalías | 8 | `mlm_royalty_levels` |
| % margen para pool | 50% | `mlm_royalty_percentage` |
| Regalías N1 | 15% del pool | `mlm_royalty_l1_pct` |
| Regalías N2 | 10% del pool | `mlm_royalty_l2_pct` |
| Bono Semilla Preferente N1 | $10 | `mlm_seed_preferente_n1` |
| Bono Semilla Pionero N1 | $43 | `mlm_seed_pionero_n1` |
| Bono Semilla Upgrade N1 | $33 | `mlm_seed_upgrade_n1` |
| Activación rolling | 30 días | `mlm_activation_rolling_days` |
| Puntos mínimos | 50 pts | `mlm_activation_min_points` |
| Día cierre semanal | Viernes | `closure_day_of_week` |
| Hora cierre | 17:00 Ecuador | `closure_hour` |

**Rangos MLM:**
| Rango | Puntos | Bono Mensual |
|-------|--------|--------------|
| Plata | 500 | $50 |
| Oro | 1,500 | $150 |
| Zafiro | 5,000 | $500 |
| Esmeralda | 10,000 | $1,000 |
| Rubí | 25,000 | $2,500 |
| Diamante | 50,000 | $5,000 |
| Diamante Azul | 100,000 | $10,000 |

---

## 🎨 DISEÑO — PALETA OBSIDIAN & ORANGE (INMUTABLE)

```css
--color-primary: #FF6B00;
--color-primary-dark: #E55A00;
--color-bg-dark: #0A0A0A;
--color-bg-card: #141414;
--color-text-primary: #F5F5F5;
--color-text-secondary: #A0A0A0;
--color-border: #2A2A2A;
--color-success: #22C55E;
--color-error: #EF4444;
```

Fuente: Inter (Google Fonts). Sin cambiar paleta sin aprobación explícita.

---

## 🔐 VARIABLES DE ENTORNO REQUERIDAS

```bash
DATABASE_URL=postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

Las credenciales reales están en `Datos relevantes, Credenciales y APIs de SaidonClub.txt`

---

## 🛠️ HERRAMIENTAS Y PROTOCOLOS

### 🚨 PROTOCOLO DE NAVEGACIÓN OFICIAL: `chrome-devtools-mcp`
> **PROHIBIDO** usar `browser_subagent` (visual/screenshot-based) para QA o testing. Es lento, consume cuotas y es inestable. **OBLIGATORIO** usar el servidor MCP directo.

| Herramienta MCP | Propósito |
|---|---|
| `mcp_chrome-devtools-mcp_navigate_page` | Navegar a URL o recargar |
| `mcp_chrome-devtools-mcp_take_snapshot` | Leer DOM completo con UIDs (PREFERIR sobre screenshot) |
| `mcp_chrome-devtools-mcp_take_screenshot` | Verificación visual post-cambio UI (R6) |
| `mcp_chrome-devtools-mcp_click` | Clic preciso por `uid` del snapshot |
| `mcp_chrome-devtools-mcp_fill` | Rellenar inputs/forms |
| `mcp_chrome-devtools-mcp_evaluate_script` | Ejecutar JS directo en página |
| `mcp_chrome-devtools-mcp_list_console_messages` | Detectar errores JS en runtime |
| `mcp_chrome-devtools-mcp_lighthouse_audit` | Auditoría accesibilidad/SEO |
| `mcp_chrome-devtools-mcp_emulate` | Testing responsive mobile/desktop |
| `mcp_chrome-devtools-mcp_wait_for` | Esperar texto en pantalla antes de interactuar |

**Flujo estándar de QA:**
```
1. navigate_page → URL objetivo
2. take_snapshot  → Obtener UIDs del DOM
3. click/fill      → Interactuar con uid exacto
4. evaluate_script → Validar estado JS (localStorage, cart, auth)
5. take_screenshot → Captura visual solo para confirmación final
6. list_console_messages → Verificar cero errores en consola
```

### Control de Calidad (QA Gate — antes de avanzar semana)
```bash
pnpm typecheck   # Sin errores TypeScript
pnpm lint        # Sin warnings ESLint
pnpm db:generate # Schema Prisma válido
```

### Formato de Commits Git
```
feat(scope): descripción en español
fix(scope): descripción
docs(scope): descripción
refactor(scope): descripción
test(scope): descripción
```

---

## 🔄 PROTOCOLO DE INICIO DE SESIÓN (MANDATORIO)

```
1. Leer este archivo completo
2. Verificar "Estado actual" en docs/architecture/CURRENT_STATE.md
3. Identificar primera tarea pendiente de la semana
4. Ejecutar: pnpm typecheck (detectar errores previos)
5. Verificar que localhost:3000 responde (Test-NetConnection -Port 3000)
6. Inicializar QA con: mcp_chrome-devtools-mcp_navigate_page → http://localhost:3000
7. Ejecutar tareas en orden de prioridad usando chrome-devtools-mcp
8. Al finalizar: take_screenshot final + actualizar CURRENT_STATE.md + git commit
```

**NO preguntar al usuario por contexto que está aquí.**
**NO repetir trabajo ya realizado.**

---

*Owner: SaidonClub Global | admin@saidonclub.com*
*Antigravity — SaidonClub OS v5.2 | Última actualización: 2026-04-25*
*Testing Engine: chrome-devtools-mcp (Playwright CDP) — PROTOCOLO OFICIAL*
