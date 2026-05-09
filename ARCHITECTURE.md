# SaidonClub OS — Architecture Document

> **Versión:** 5.2.0
> **Fecha:** 2026-05-07
> **Estado:** Producción-Ready
> **FASE 6-7:** Multimedia Pipeline + QA Cross-Device COMPLETOS

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │   Next.js   │  │   React    │  │   Tailwind  │  │  Supabase  │ │
│  │      15     │  │     19     │  │     CSS     │  │    Auth    │ │
│  └──────┬──────┘  └─────────────┘  └─────────────┘  └───────────┘ │
└─────────┼───────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS SERVER                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      API Routes                               │  │
│  │  /api/auth  /api/payments  /api/users  /api/products  ...   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │   RBAC     │ │   MLM       │ │   Config    │ │   Media     │  │
│  │   Package  │ │   Engine    │ │   Engine    │ │   Engine    │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
└─────────┼───────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │  PostgreSQL │  │  Prisma    │  │ Supabase    │  │   Redis   │  │
│  │  (Primary)  │  │   ORM      │  │  Storage    │  │ (Futuro)  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Monorepo Structure

```
saidonclub-os/
├── apps/
│   └── web/                          # Next.js 15 App
│       ├── app/                      # App Router
│       │   ├── admin/               # Panel admin
│       │   ├── api/                 # API Routes
│       │   ├── auth/                # Autenticación
│       │   ├── dashboard/           # Dashboard usuario
│       │   ├── marketplace/        # Páginas marketplace
│       │   └── ...
│       ├── components/              # Componentes React
│       ├── lib/                      # Utilidades
│       ├── hooks/                   # Custom hooks
│       └── public/                  # Assets estáticos
│
├── packages/                         # Paquetes internos
│   ├── config-engine/               # Gestor de configuración
│   ├── database/                   # Modelos Prisma
│   │   └── prisma/schema.prisma     # Schema completo
│   ├── media-engine/                # Procesamiento media
│   ├── mlm-engine/                  # Motor MLM
│   │   ├── genealogy/              # Árbol genealógico
│   │   ├── ranks/                   # Evaluación rangos
│   │   ├── royalties/              # Regalías
│   │   └── payments/               # Pagos comisiones
│   ├── rbac/                        # Control acceso
│   └── types/                       # Tipos TypeScript
│
├── docs/                            # Documentación
├── supabase/                        # Edge Functions
└── scripts/                         # Scripts automatización
```

---

## 3. Data Flow

### 3.1 Autenticación
```
User → Login Page → Supabase Auth → JWT → Next.js Session
                              ↓
                       User Role → RBAC Check → Route Access
```

### 3.2 Compra/Marketplace
```
User → Product Page → Cart → Checkout → Stripe/PayPal
                                        ↓
                              Payment Intent → Confirm
                                        ↓
                              Order Created → Email → Wallet Update
```

### 3.3 MLM Commission
```
Purchase → Order Complete → Trigger MLM Calc
    ↓
Calculate PV (Personal Volume)
    ↓
Find Upline → Distribute Commission (8 niveles)
    ↓
Update Wallet → Weekly Closure → Payout
```

---

## 4. Database Schema (Core Models)

```
User
├── id, email, role, status
├── created_at, updated_at
└── profile: UserProfile

UserProfile
├── user_id, first_name, last_name
├── phone, avatar_url
├── country_id, city_id
└── kyc_status

ProviderProfile (extends User)
├── user_id, type (PRODUCTS|SERVICES)
├── verified, rating, total_sales
└── specializations[]

Product
├── id, name, description, price
├── internal_price (private)
├── category_id, provider_id
├── images[], status
└── inventory

Order
├── id, user_id, total, status
├── payment_method, stripe_id
├── created_at
└── items: OrderItem[]

Wallet
├── user_id, balance
├── pending_commissions
└── transactions[]

Commission
├── id, user_id, order_id
├── amount, level, rank
├── status (PENDING|PAID)
└── calculated_at
```

---

## 5. API Architecture

### 5.1 API Routes Map

| Path | Método | Descripción |
|------|--------|-------------|
| `/api/auth/*` | POST | Login, Register, Logout, 2FA |
| `/api/user/*` | GET/POST/PUT | Gestión usuarios |
| `/api/products/*` | CRUD | Catálogo productos |
| `/api/services/*` | CRUD | Catálogo servicios |
| `/api/orders/*` | CRUD | Pedidos |
| `/api/payments/*` | POST | Stripe webhooks, create-intent |
| `/api/wallet/*` | GET/POST | Bills, transacciones |
| `/api/commissions/*` | GET | Historial MLM |
| `/api/appointments/*` | CRUD | Reservas servicios |
| `/api/admin/*` | CRUD | Gestión admin |
| `/api/admin/export` | GET | Export JSON/CSV con SHA-256 |
| `/api/admin/import` | POST | Import con dry-run mode |
| `/api/admin/multimedia` | GET/POST/DELETE | Gestión multimedia optimizada |

### 5.2 Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## 6. Security Model

### 6.1 Autenticación
- **Proveedor:** Supabase Auth (JWT)
- **2FA:** TOTP (Google Authenticator compatible)
- **Sesión:** HTTP-only cookies

### 6.2 Autorización (RBAC)
```
Roles Disponibles (12):
- CLIENT: Lectura básica, compras
- PREFERENTE: CLIENT + wallet, descuentos 10%
- PIONERO: CLIENT + MLM completo, referir ilimitados
- PROVIDER_PRODUCTS: Vender productos
- PROVIDER_SERVICES: Vender servicios
- ADMIN: Gestión completa plataforma
- SUPER_ADMIN: Control total
- AUDITOR: Solo lectura auditoria
- SUPPORT: Soporte técnico
- MODERATOR: Moderación de contenido y reseñas
- ANALYST: Análisis de datos y reportes
- DEVELOPER: Acceso técnico y debugging
```

### 6.3 Reglas de Oro
1. **internalPrice** NUNCA sale del servidor
2. Cálculo de precios SIEMPRE en backend
3. Usar transacciones ACID para operaciones financieras
4. Validar permisos en cada API route

### 6.4 Permisos RBAC

| Permission | Descripción |
|-----------|-------------|
| `VIEW_CATALOG` | Ver catálogo público |
| `VIEW_PRODUCTS` | Ver productos |
| `VIEW_SERVICES` | Ver servicios |
| `BUY_PRODUCTS` | Comprar productos |
| `BUY_SERVICES` | Comprar servicios |
| `MANAGE_PRODUCTS` | Crear/editar productos |
| `MANAGE_SERVICES` | Crear/editar servicios |
| `MANAGE_CONTENT` | Gestión multimedia (imágenes, uploads) |
| `MANAGE_USERS` | Gestionar usuarios |
| `MANAGE_CONFIG` | Modificar configuración del sistema |
| `VIEW_AUDIT_LOGS` | Ver logs de auditoría |

---

## 7. Environment Configuration

### Desarrollo
```bash
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Producción
```bash
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_APP_URL=https://saidonclub.com
STRIPE_SECRET_KEY=sk_live_...
```

---

## 8. Deployment

### Requisitos
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL (Supabase recomendado)
- Stripe Account (para pagos)

### Build Pipeline
```bash
pnpm install
pnpm db:generate
pnpm build
pnpm start
```

---

## 9. Tech Stack Summary

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 15, React 19, TypeScript 5.4 |
| Styling | Tailwind CSS, CSS Modules |
| Backend | Next.js API Routes, Edge Functions |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth + TOTP 2FA |
| Payments | Stripe, PayPal |
| Storage | Supabase Storage |
| Build | Turborepo, pnpm |
| Media | Sharp, FFmpeg (media-engine + apps/web/lib/multimedia) |

---

## 10. Multimedia Pipeline (FASE 6)

### 10.1 Image Optimizer
```
apps/web/lib/multimedia/image-optimizer.ts
- Sharp compression server-side
- png({ palette: true }) para cuantización
- WebP como formato moderno
- Procesamiento asíncrono via cola
```

### 10.2 Storage Cleaner
```
apps/web/lib/multimedia/storage-cleaner.ts
- Detecta archivos huérfanos en Supabase Storage
- Campos DB: images[], avatar (no imageUrl/avatarUrl)
- Reporta orphanCount en respuesta
```

### 10.3 Export Service
```
apps/web/lib/export-service.ts
- Export JSON/CSV con SHA-256 checksum
- Tipos: UserExport, ProductExport, ProviderExport
- Map explícito: null → undefined
```

### 10.4 Import Service
```
apps/web/lib/import-service.ts
- Import JSON con dry-run mode
- Validación Zod schemas
- Merge o replace de datos
```

### 10.5 Hook useOptimizedUpload
```
apps/web/hooks/useOptimizedUpload.ts
- Marca archivos como optimizables
- Procesamiento server-side compression
- No dependencias Sharp en navegador
```

---

## 11. Future Improvements

- [ ] Redis cache para configuración
- [ ] WebSocket para real-time notifications
- [ ] GraphQL API
- [ ] Microservicios para MLM
- [ ] CDN para media global

---

_Documento generado: 2026-05-07_
_SaidonClub OS v5.2.0 - Production Ready_