# PLAN MAESTRO — SAIDONCLUB OMEGA OS
## Preparación para Producción y Despliegue en la Nube

---

## RESUMEN EJECUTIVO

**Estado actual del sistema:** ~70-75% completo para producción  
**Módulos críticos faltantes:** Service Marketplace Engine, Booking Engine, QA Testing  
**Seguridad:** 3 issues críticos de SSR migration pendientes  
**Build:** Compila exitosamente (con type-checking diferido)  
**Tests:** 27/27 pasan  
**Lint:** 0 errores, 40 warnings  

---

## FASE 0 — CORRECCIONES INMEDIATAS (DÍAS 1-2)

### Prioridad CRÍTICA — Seguridad

| # | Tarea | Archivos | Esfuerzo |
|---|-------|----------|----------|
| 0.1 | Rotar credenciales expuestas (GitHub token, Supabase) | CI/CD, .env | 1h |
| 0.2 | Migrar AuthContext de `createClient()` a `createClientComponentClient()` | `context/AuthContext.tsx` | 30min |
| 0.3 | Migrar `lib/auth/core.ts` a SSR-safe `getUser()` | `lib/auth/core.ts` | 1h |
| 0.4 | Remover hardcode de cookie name `sb-access-token` en middleware | `middleware.ts` | 30min |
| 0.5 | Agregar rate-limiting global en API routes | `lib/rate-limit.ts`, middleware | 2h |

### Prioridad ALTA — Funcionalidad

| # | Tarea | Archivos | Esfuerzo |
|---|-------|----------|----------|
| 0.6 | **Fix botón "Sistema de Tickets"** en página de Ayuda | `components/help/` o redirigir a contacto | 15min |
| 0.7 | **Fix link "Volver arriba"** en Home (href="#") | Componente Footer o breadcrumbs | 15min |
| 0.8 | Hacer pública la página de métodos de pago `/pagos` (hoy redirige a login) | `app/pagos/page.tsx` layout | 30min |
| 0.9 | Agregar `error.tsx` y `not-found.tsx` globales | `app/error.tsx`, `app/not-found.tsx` | 1h |
| 0.10 | Quitar `typescript.ignoreBuildErrors` y corregir tipos | ~30 archivos | 4h |

---

## FASE 1 — SERVICE MARKETPLACE ENGINE (DÍAS 3-7)

> Este es el módulo más grande faltante. Requiere implementación completa.

### Backend (Días 3-4)

| # | Tarea | Descripción |
|---|-------|-------------|
| 1.1 | ServiceProvider CRUD completo | Perfiles con categoría profesional, KYC por categoría, horarios |
| 1.2 | ServiceListing CRUD completo | 3-tier pricing (publicPrice, memberPrice, internalPrice) |
| 1.3 | Booking Engine (Máquina de Estados) | State machine: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED |
| 1.4 | QR Validation System | JWT-based QR con expiración 24h |
| 1.5 | Bipartite Form (doble firma digital) | Provider llena → Client acepta/rechaza |
| 1.6 | Facturación PDF (IVA 15%) | @react-pdf/renderer, numeración secuencial |
| 1.7 | Transacción ACID service→wallet→commission→invoice | Prisma atomic transaction |
| 1.8 | Proteger internalPrice del frontend | Filter/serializer layer |

### Frontend (Días 5-7)

| # | Tarea | Descripción |
|---|-------|-------------|
| 1.9 | UI de Servicios: Hero, filtros, grilla responsive | 3 cols desktop, 2 tablet, 1 mobile |
| 1.10 | Provider Schedule UI | Selección de horario con slot generation |
| 1.11 | QR Scanner para validación | Cámara + validación JWT |
| 1.12 | Panel de Proveedor: finanzas, citas, KYC | Dashboard de proveedor completo |
| 1.13 | Sistema de Beneficiarios Familiares | Máx 5 por cuenta, QR cubre todos |
| 1.14 | Sistema de Reputación Bidireccional | ProviderReview (pública) + ClientReview (invisible) |

---

## FASE 2 — CORRECCIONES VISUALES Y UX (DÍAS 8-9)

> **POLÍTICA INQUEBRANTABLE:** 
> 1. Imágenes representativas EXCLUSIVAS de marketplace general (prohibidas abstractas o ambientes irrelevantes).
> 2. Navbar limpio: Sin botones extra de "Ver Todo", las categorías son los enlaces.
> 3. Dashboard ERP: El Dashboard debe operar como un ERP completo (finanzas, MLM, roles), no solo como panel de usuario.

| # | Tarea | Prioridad |
|---|-------|-----------|
| 2.1 | Revisar y corregir estados vacíos en todas las listas | ALTA |
| 2.2 | Agregar skeleton loaders en componentes de datos | ALTA |
| 2.3 | Verificar contraste WCAG AA en modo claro/oscuro | ALTA |
| 2.4 | Botones sin handlers: inventario y corrección | MEDIA |
| 2.5 | Servicios sin imágenes: placeholder genérico | MEDIA |
| 2.6 | Responsive: testear 375px, 768px, 1024px, 1440px | ALTA |
| 2.7 | Micro-animaciones y glassmorphism faltantes | BAJA |
| 2.8 | Galería de thumbnails en detalle de producto/servicio | MEDIA |
| 2.9 | Selector de cantidad en detalle de producto | BAJA |
| 2.10 | Soporte para video en galería multimedia | BAJA |

---

## FASE 3 — SEO Y COPY (DÍAS 10-11)

| # | Tarea | Estado actual |
|---|-------|---------------|
| 3.1 | JSON-LD hardening (Organization, Product, Service, FAQ) | Pendiente |
| 3.2 | Dynamic sitemap.xml | Pendiente |
| 3.3 | robots.txt optimizado | Pendiente |
| 3.4 | Open Graph tags por página | Parcial |
| 3.5 | Canonical URLs | Pendiente |
| 3.6 | Breadcrumbs structured data | Pendiente |
| 3.7 | Meta keywords/description por página dinámica | Parcial |
| 3.8 | Internal linking engine | Pendiente |

---

## FASE 4 — QA Y TESTING (DÍAS 12-14)

| # | Tarea | Estado |
|---|-------|--------|
| 4.1 | Tests unitarios para auth flow | 7 tests existentes |
| 4.2 | Tests unitarios para cart | 12 tests existentes |
| 4.3 | Tests unitarios para recommendations | 8 tests existentes |
| 4.4 | Tests de integración para booking engine | Nuevo |
| 4.5 | Tests E2E con Playwright (flujos críticos) | Nuevo |
| 4.6 | Stress test MLM engine (~50 casos de uso) | Parcial (scaffold existente) |
| 4.7 | Visual regression tests | Nuevo |
| 4.8 | Lighthouse audit (SEO > 95, Performance > 80) | Pendiente |

---

## FASE 5 — DEVOPS Y DESPLIEGUE (DÍAS 15-16)

| # | Tarea | Estado |
|---|-------|--------|
| 5.1 | Configurar Stripe/PayPal API keys en producción | Pendiente |
| 5.2 | Configurar CI/CD (GitHub Actions) | Pendiente |
| 5.3 | Configurar backups automáticos de BD | Pendiente |
| 5.4 | Configurar WAF / DDoS protection | Pendiente |
| 5.5 | Migrar a Vercel/Netlify | Pendiente |
| 5.6 | Configurar analytics (PostHog/Plausible) | Pendiente |
| 5.7 | Monitoreo de errores (Sentry) | Parcial (logger listo) |

---

## FASE 6 — MEJORAS POST-LANZAMIENTO (OPCIONAL)

| # | Tarea |
|---|-------|
| 6.1 | WhatsApp Business API Automation |
| 6.2 | Push Notifications (FCM) |
| 6.3 | Telegram Bot Integration |
| 6.4 | Multi-language (i18n) |
| 6.5 | Multi-currency |
| 6.6 | Full-text Search con filtros |
| 6.7 | Onboarding tutorial interactivo |
| 6.8 | Export CSV/Excel |
| 6.9 | Interactive genealogical tree (D3.js) |

---

## HALLAZGOS DE AUDITORÍA FORENSE

### 38 rutas inspeccionadas — Resultados:
- ✅ **Todas las páginas públicas cargan correctamente**
- ✅ **Protección de rutas funciona** (dashboard → login redirect)
- ✅ **SEO básico presente** (meta tags, og:tags, descriptions)
- ✅ **No hay 404s en consola**
- ⚠️ **1 botón muerto:** "Sistema de Tickets Saidon" en /ayuda
- ⚠️ **1 link roto:** "Volver arriba" en Home (href="#")
- ℹ️ **Pagos requiere login** (probablemente debería ser público)

### Estado de la rama rescue-stabilization:
- Build compila (con ignoreBuildErrors)
- Tests pasan (27/27)
- Lint: 0 errores
- Todos los cambios de tipos están en esta rama
