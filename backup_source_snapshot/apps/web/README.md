# SaidonClub Web — Aplicación Principal

> **Versión:** 5.2.0
> **Framework:** Next.js 15 (App Router)
> **Build Status:** ✅ Exit 0
> **Dev Server:** `pnpm dev` → http://localhost:3000

---

## Quick Start

```bash
#Desde la raíz del monorepo:
pnpm install
pnpm dev

#Desde apps/web:
cd apps/web
pnpm dev
```

---

## Arquitectura

```
apps/web/
├── app/                        # Next.js App Router
│   ├── (auth)/               # Grupo de rutas auth
│   ├── admin/                # Panel administración
│   ├── api/                  # API Routes
│   │   ├── admin/
│   │   │   ├── export/      # Export JSON/CSV
│   │   │   ├── import/      # Import con dry-run
│   │   │   └── multimedia/  # Gestión multimedia
│   │   └── ...
│   ├── auth/
│   ├── dashboard/
│   ├── productos/
│   ├── servicios/
│   └── page.tsx             # Homepage
├── components/                # Componentes React
│   ├── admin/
│   │   └── MultimediaDashboard.tsx
│   ├── layout/
│   │   ├── Navbar.tsx      # SSR guard para window.location
│   │   ├── Footer.tsx
│   │   └── Search.tsx
│   └── ...
├── context/                   # React Contexts
│   ├── ThemeContext.tsx     # SSR guard + try/catch localStorage
│   ├── LocaleContext.tsx   # SSR guard + try/catch localStorage
│   └── NotificationsContext.tsx
├── lib/                      # Utilidades
│   ├── export-types.ts     # Tipos UserExport, ProductExport
│   ├── export-service.ts   # Export JSON/CSV + SHA-256
│   ├── import-service.ts   # Import con dry-run + Zod
│   ├── import-validator.ts # Schemas Zod
│   └── multimedia/
│       ├── image-optimizer.ts  # Sharp compression
│       └── storage-cleaner.ts # Orphan cleanup
├── hooks/
│   └── useOptimizedUpload.ts  # Upload con compresión server-side
├── middleware.ts            # RBAC middleware
└── qa_screenshots/          # QA visual test output
```

---

## API Endpoints Clave

### Admin / Multimedia
| Método | Path | Descripción |
|--------|------|-------------|
| GET | `/api/admin/multimedia` | Listar archivos con stats |
| POST | `/api/admin/multimedia` | Upload optimizado |
| DELETE | `/api/admin/multimedia` | Eliminar archivo |

### Export / Import
| Método | Path | Descripción |
|--------|------|-------------|
| GET | `/api/admin/export?format=json\|csv&type=users\|products\|providers` | Export con checksum |
| POST | `/api/admin/import` | Import JSON con dry-run |

---

## Seguridad

- **Middleware RBAC** en `middleware.ts` — protege rutas por rol
- **8 headers de seguridad** en `next.config.ts`
- **Permission.MANAGE_CONTENT** para multimedia
- `internalPrice` NUNCA expuesto al frontend

---

## QA Testing

```bash
# 64 tests cross-device (8 pages × 8 viewports)
cd apps/web
python qa_visual_test.py

# Resultados:
# - Screenshots: qa_screenshots/*.png
# - Reporte: qa_screenshots/qa_report.txt
```

---

## Build

```bash
pnpm build          # Build producción
pnpm typecheck     # Verificación TypeScript
pnpm lint          # Linting
```

---

_Documentación completa: `../../README.md`_
_SaidonClub OS v5.2.0_
