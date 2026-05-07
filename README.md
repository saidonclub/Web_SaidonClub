# 🚀 SaidonClub OS v5.2.0 - Documentación Maestra Completa

> **Fecha de actualización:** 2026-05-07  
> **Versión:** 5.2.0  
> **Último desarrollador:** Antigravity AI Engine  
> **Propietario:** Víctor Hugo Villegas  
> **Build Status:** ✅ `next build` — Exit 0, sin errores TypeScript  
> **Limpieza:** ✅ 50+ archivos basura eliminados (logs, PNGs de prueba, scripts Python)

---

## 📋 Tabla de Contenidos

1. [Visión General del Sistema](#1-visión-general-del-sistema)
2. [Arquitectura del Monorepo](#2-arquitectura-del-monorepo)
3. [Paquetes y Librerías](#3-paquetes-y-librerías)
4. [Aplicación Web (apps/web)](#4-aplicación-web-appsweb)
5. [Base de Datos y Modelos](#5-base-de-datos-y-modelos)
6. [API Routes](#6-api-routes)
7. [Sistema de Roles y Permisos (RBAC)](#7-sistema-de-roles-y-permisos-rbac)
8. [Motor MLM](#8-motor-mlm)
9. [Configuración del Sistema](#9-configuración-del-sistema)
10. [Seguridad y Autenticación](#10-seguridad-y-autenticación)
11. [Documentación Adicional](#11-documentación-adicional)
12. [Comandos y Scripts](#12-comandos-y-scripts)
13. [Estado del Proyecto y Pendientes](#13-estado-del-proyecto-y-pendientes)

---

## 1. Visión General del Sistema

### 1.1 Descripción

**SaidonClub OS** es una plataforma integral de Marketplace, Marketing Multinivel (MLM) y Servicios Profesionales diseñada para operar a escala global con soporte multi-país y multi-moneda.

### 1.2 Características Principales

- **Marketplace Global:** Integración nativa con dropshipping (Ecuador-first)
- **Servicios Profesionales:** Contratación de expertos geolocalizados con perfiles validados
- **Motor MLM Avanzado:** Gestión de redes, comisiones en cascada de 8 niveles, regalías y rangos automáticos
- **UI/UX Premium:** Interfaz basada en Glassmorphism, temas dinámicos por categoría y diseño "Obsidian & Orange"
- **Arquitectura de Alta Disponibilidad:** Monorepo con Turborepo, Next.js 15, Prisma y Supabase

### 1.3 Tecnologías Principales

| Tecnología     | Propósito                               |
| -------------- | --------------------------------------- |
| Next.js 15     | Framework full-stack                    |
| React 19       | UI Library                              |
| TypeScript 5.4 | Tipado estático                         |
| Prisma         | ORM para base de datos                  |
| Supabase       | Auth, Database, Storage, Edge Functions |
| Turborepo      | Build system monorepo                   |
| pnpm 9.0       | Package manager                         |
| PostgreSQL     | Base de datos principal                 |

### 1.4 Roles del Sistema (9 tipos de usuario)

```
CLIENT          → Usuario básico sin membresía
PREFERENTE      → Membresía $29/año, descuentos 10%, puntos, wallet básico
PIONERO         → Membresía $97/año, MLM completo, referir ilimitados
PROVIDER_PRODUCTS  → Vendedor de productos físicos/digitales
PROVIDER_SERVICES  → Vendedor de servicios profesionales
ADMIN           → Administrador de plataforma
SUPER_ADMIN     → Super administrador, control total
AUDITOR         → Solo lectura, ver transacciones y reportes
SUPPORT         → Soporte técnico
```

---

## 2. Arquitectura del Monorepo

### 2.1 Estructura de Directorios

```
saidonclub-os/
├── apps/
│   └── web/                    # Aplicación principal Next.js 15
├── packages/
│   ├── config-engine/          # Gestor de configuración dinámico
│   ├── database/              # Modelos Prisma y Cliente Supabase
│   ├── media-engine/          # Procesamiento de imágenes/videos
│   ├── mlm-engine/            # Lógica de cálculo de comisiones MLM
│   ├── rbac/                  # Control de acceso basado en roles
│   └── types/                 # Definiciones de TypeScript globales
├── docs/                      # Documentación completa
├── supabase/                  # Edge Functions y configuración
├── scripts/                   # Herramientas de automatización
└── assets/                    # Recursos estáticos globales
```

### 2.2 Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 2.3 Scripts Disponibles

```bash
pnpm install          # Instalar todas las dependencias
pnpm dev              # Iniciar desarrollo (todos los paquetes)
pnpm build            # Build de producción
pnpm db:generate      # Generar cliente Prisma
pnpm db:migrate      # Ejecutar migraciones
pnpm db:seed         # Poblar base de datos
pnpm lint            # Verificar código
pnpm typecheck       # Verificar tipos TypeScript
```

---

## 3. Paquetes y Librerías

### 3.1 @saidonclub/types (packages/types)

**Propósito:** Contratos TypeScript compartidos entre todos los paquetes y apps.

**Módulos:**

- `index.ts` - Export barrel principal

**Contains:**

- Tipos de usuarios y membresías
- Tipos de productos y servicios
- Tipos de pedidos y transacciones
- Tipos de wallet y comisiones
- Tipos de geografía y ubicaciones

```typescript
// Uso típico
import type { UserRole, ProductStatus, Order } from "@saidonclub/types";
```

---

### 3.2 @saidonclub/database (packages/database)

**Propósito:** Modelos Prisma, cliente Supabase y scripts de base de datos.

**Estructura:**

```
database/
├── prisma/
│   ├── schema.prisma          # Esquema principal (50KB+, 1717 líneas)
│   ├── seed.ts               # Seed principal
│   ├── seed_*.ts             # Seeds especializados
│   └── data/                 # Datos JSON para seeding
├── src/
│   ├── generated/           # Cliente Prisma generado
│   └── index.ts             # Export del cliente
├── scripts/                  # Scripts de utilidad
└── package.json
```

**Modelos Principales del Schema:**

- `User` - Usuarios del sistema
- `UserProfile` - Perfiles extendidos
- `ProviderProfile` - Perfiles de proveedores
- `ServiceProvider` - Proveedores de servicios
- `Product` - Productos del marketplace
- `Service` - Servicios profesionales
- `Category` - Categorías
- `Order` - Pedidos
- `Appointment` - Citas y reservas
- `Wallet` - Billeteras de usuarios
- `Commission` - Comisiones MLM
- `Membership` - Membresías
- `City`, `Country`, `Region` - Geografía
- `SystemConfig` - Configuración del sistema
- `KYC` - Verificación de identidad

---

### 3.3 @saidonclub/mlm-engine (packages/mlm-engine)

**Propósito:** Lógica de cálculo de comisiones y gestión de red MLM.

**Módulos:**

```typescript
// Export barrel
export { getGenealogyTree, getLineVolume } from "./genealogy";
export { calculateRoyalties } from "./royalties";
export { evaluateRank } from "./ranks";
export { calculateSeedBonus } from "./seed-bonus";
export { processProviderPayments } from "./payments";
export { executeWeeklyClosure } from "./closure";
```

**Funcionalidades:**

- **genealogy.ts** - Árbol genealógico, cálculo de upline/downline
- **royalties.ts** - Cálculo de regalías por rangos
- **ranks.ts** - Evaluación y promoción de rangos
- **seed-bonus.ts** - Bonos por activación de red
- **payments.ts** - Procesamiento de pagos a proveedores
- **closure.ts** - Cierre semanal de comisiones

---

### 3.4 @saidonclub/config-engine (packages/config-engine)

**Propósito:** Gestor de configuración dinámico con cache local.

**Características:**

- Cache en memoria con TTL de 60 segundos
- Fallback a base de datos Prisma
- Obtiene múltiples configs en paralelo
- Validación de tipos

```typescript
// Uso típico
import { config } from "@saidonclub/config-engine";

const mlmEnabled = await config.get("MLM_ENABLED");
const minPurchase = await config.get<number>("MIN_PURCHASE_AMOUNT", 10);
```

---

### 3.5 @saidonclub/rbac (packages/rbac)

**Propósito:** Sistema de Control de Acceso Basado en Roles.

**Enumeraciones:**

```typescript
export enum Role {
  CLIENT = "CLIENT",
  PREFERENTE = "PREFERENTE",
  PIONERO = "PIONERO",
  PROVIDER_PRODUCTS = "PROVIDER_PRODUCTS",
  PROVIDER_SERVICES = "PROVIDER_SERVICES",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  AUDITOR = "AUDITOR",
  SUPPORT = "SUPPORT",
}

export enum Permission {
  // Permisos de lectura
  VIEW_CATALOG,
  VIEW_PRODUCTS,
  VIEW_SERVICES,
  // Permisos de compra
  BUY_PRODUCTS,
  BUY_SERVICES,
  // Permisos de gestión
  MANAGE_PRODUCTS,
  MANAGE_SERVICES,
  // Permisos administrativos
  MANAGE_USERS,
  MANAGE_CONFIG,
  VIEW_AUDIT_LOGS,
}
```

---

### 3.6 @saidonclub/media-engine (packages/media-engine)

**Propósito:** Procesamiento y optimización de medios (imágenes/videos).

**Características:**

- Optimización de imágenes con Sharp
- Procesamiento de videos con FFmpeg
- Redimensionamiento automático
- Conversión a formato moderno (WebP)
- Compresión inteligente

```typescript
// Uso típico
import { MediaEngine } from "@saidonclub/media-engine";

const optimized = await MediaEngine.optimizeImage(buffer, {
  maxImageWidth: 1200,
  imageQuality: 80,
  imageFormat: "webp",
});
```

---

## 4. Aplicación Web (apps/web)

### 4.1 Estructura de Rutas (app router)

```
apps/web/app/
├── admin/              # Panel de administración
├── api/               # API Routes (Backend)
├── auth/              # Autenticación (login, register, etc.)
├── ayuda/             # Página de ayuda
├── carrito/           # Carrito de compras
├── categorias/        # Listado de categorías
├── checkout/          # Proceso de checkout
├── contacto/         # Página de contacto
├── dashboard/        # Dashboard de usuario
├── membresias/        # Planes de membresía
├── nosotros/         # Página "Sobre nosotros"
├── pagos/             # Métodos de pago
├── productos/        # Catálogo de productos
├── proveedor/        # Perfil público de proveedor
├── provider/         # Panel de proveedor
├── servicios/        # Catálogo de servicios
├── auditor/           # Panel de auditor
└── page.tsx          # Homepage
```

### 4.2 Directorios del Dashboard

```
dashboard/
├── page.tsx                 # Dashboard principal
├── Dashboard.module.css     # Estilos
├── kpis/                   # Componentes de KPIs
├── network/                # Gestión de red MLM
├── pedidos/               # Historial de pedidos
├── settings/               # Configuración de cuenta
├── ticker/                 # Anuncios del sistema
├── transfer/              # Transferencias
├── ventas/                 # Ventas (para proveedores)
└── withdraw/              # Retiros
```

### 4.3 Componentes (components/)

```
components/
├── admin/            # Componentes administrativos
├── appointments/    # Gestión de citas
├── booking/          # Sistema de reservas
├── checkout/        # Proceso de compra
├── geolocation/     # Servicios de ubicación
├── home/            # Componentes del homepage
├── layout/          # Layouts globales
├── marketplace/     # Componentes del marketplace
├── reviews/         # Sistema de reseñas
├── security/        # Componentes de seguridad
├── shared/          # Componentes compartidos
└── terminal/        # Terminal de reportes en tiempo real
```

---

## 5. Base de Datos y Modelos

### 5.1 Esquema Prisma

El archivo `packages/database/prisma/schema.prisma` contiene todos los modelos (~1717 líneas).

**Modelos Core:**

- `SystemConfig` - Configuración del sistema
- `User` - Usuario principal
- `ProviderProfile` - Perfil de proveedor
- `ServiceProvider` - Proveedor de servicios
- `Product` - Producto
- `Service` - Servicio
- `Category` - Categoría
- `Order` - Pedido
- `OrderItem` - Ítem de pedido
- `Appointment` - Cita/Reserva
- `Wallet` - Billetera
- `Transaction` - Transacción
- `Commission` - Comisión MLM
- `Membership` - Membresía
- `City`, `Country`, `Region` - Geografía
- `KYC` - Verificación de identidad

### 5.2 Seeds Disponibles

```
seed.ts                 - Seed principal
seed_users.ts          - Usuarios de prueba
seed_latam.ts          - Datos LATAM
seed_full_latam.ts     - Datos completos LATAM
seed_cities.ts         - Ciudades
seed_geo.ts            - Datos geográficos
seed_network.ts        - Red MLM inicial
seed_maestro.ts         - Seed maestro completo
seed_categories.ts      - Categorías
seed_medical.ts        - Servicios médicos
seed_qa.ts            - Preguntas frecuentes
seed-services-premium.js - Servicios premium
populate_images.ts     - Imágenes de productos
```

---

## 6. API Routes

### 6.1 Estructura de APIs

```
apps/web/app/api/
├── 2fa/                    # Autenticación de dos factores
├── admin/                  # Endpoints de administración
├── appointments/          # Gestión de citas
├── beneficiaries/           # Beneficiarios
├── bipartite-forms/       # Formularios bipartitos
├── categories/            # Categorías
├── content/               # Contenido dinámico
├── dashboard/             # Datos del dashboard
├── debug-products/        # Debug de productos
├── events/                # Eventos del sistema
├── invoices/             # Facturación
├── newsletter/           # Newsletter
├── payments/             # Pagos
├── push/                 # Notificaciones push
├── reviews/              # Reseñas
├── sales/                # Ventas
├── service-providers/    # Proveedores de servicios
├── services/             # Servicios
├── terminal/             # Terminal de reportes
├── test/                 # Endpoints de prueba
├── test-env/             # Test de entorno
├── ticker/               # Anuncios ticker
├── upload/               # Carga de archivos
├── user/                 # Gestión de usuarios
├── whatsapp/             # Integración WhatsApp
└── ...
```

### 6.2 Terminal API Routes (CRÍTICO - 500 Error Fix)

Las siguientes rutas tienen datos de fallback para cuando la base de datos no responde:

```
/api/terminal/admin/stats    → Admin stats con sample data
/api/terminal/provider/stats → Provider stats con sample data
/api/terminal/client/stats    → Client stats con sample data
```

**Importante:** Estas rutas devuelven datos de ejemplo cuando la consulta a Prisma falla, permitiendo que la terminal funcione en modo demo/desarrollo.

---

## 7. Sistema de Roles y Permisos (RBAC)

### 7.1 Permisos por Rol

| Permiso         | CLIENT | PREFERENTE | PIONERO | PROVIDER | ADMIN | SUPER_ADMIN |
| --------------- | ------ | ---------- | ------- | -------- | ----- | ----------- |
| VIEW_CATALOG    | ✅     | ✅         | ✅      | ✅       | ✅    | ✅          |
| BUY_PRODUCTS    | ✅     | ✅         | ✅      | ✅       | ✅    | ✅          |
| VIEW_OWN_WALLET | ❌     | ✅         | ✅      | ✅       | ✅    | ✅          |
| MANAGE_PRODUCTS | ❌     | ❌         | ❌      | ✅       | ✅    | ✅          |
| MANAGE_USERS    | ❌     | ❌         | ❌      | ❌       | ✅    | ✅          |
| VIEW_AUDIT_LOGS | ❌     | ❌         | ❌      | ❌       | ❌    | ✅          |

### 7.2 Reglas de Negocio Críticas

- **Precios internos:** `internalPrice` NUNCA se expone al frontend
- **Cálculo de precios:** Siempre en el servidor
- **Transacciones:** Usar transacciones ACID de Prisma

---

## 8. Motor MLM

### 8.1 Estructura de Comisiones

- **8 niveles de comisión** en cascada
- **Rangos automáticos** basados en volumen personal y de equipo
- **Regalías** por достиг de rango
- **Seed Bonuses** por activación de nuevos miembros

### 8.2 Cálculo de Rangos

```typescript
// Rangos disponibles
- BRONZE    (0-499 PV)
- SILVER    (500-1499 PV)
- GOLD      (1500-4999 PV)
- PLATINUM  (5000-14999 PV)
- DIAMOND   (15000-49999 PV)
- CROWN     (50000+ PV)
```

---

## 9. Configuración del Sistema

### 9.1 Variables de Entorno Requeridas

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=
DIRECT_URL=

# App
NEXT_PUBLIC_APP_URL=https://saidonclub.com
NEXT_PUBLIC_DEFAULT_COUNTRY=EC
NEXT_PUBLIC_DEFAULT_CITY=1701

# Security
JWT_SECRET=
ENCRYPTION_KEY=
```

### 9.2 Configuraciones del Sistema (SystemConfig)

Las configuraciones se almacenan en la tabla `system_config` y se gestionan via `@saidonclub/config-engine`.

---

## 10. Seguridad y Autenticación

### 10.1 Métodos de Auth

- **Email/Password** con Supabase Auth
- **2FA** con TOTP (Google Authenticator compatible)
- **Verificación KYC** por niveles

### 10.2 Reglas de Seguridad

- Passwords hasheados con bcrypt
- JWT tokens para sesión
- Row Level Security (RLS) en Supabase
- Validación de permisos en cada API route

---

## 11. Documentación Adicional

### 11.1 Archivos de Documentación

```
docs/
├── AGENT_CHECKLIST.md              # Checklist para agentes IA
├── AUDIT_V6_COMPLETO.md            # Auditoría completa v6
├── AUDIT_SUMMARY.md                # Resumen de auditorías
├── versions/
│   └── v5.2.0_CHANGELOG.md        # Changelog v5.2.0
├── architecture/
│   └── CURRENT_STATE.md           # Estado actual de arquitectura
├── reports/                        # Informes de auditorías
│   ├── COMPLETE_SYSTEM_AUDIT_2026-05-01.md
│   ├── AUDITORIA_FORENSE_CHECKLIST.md
│   └── ...
├── context/
│   └── SAIDONCLUB_OS_MASTER_CONTEXT.md
└── organization/
    └── ROOT_FILE_MAP.md          # Mapa de archivos del proyecto
```

### 11.2 Documentos Externos

- `SAIDONCLUB_ESPECIFICACION_MAESTRA_v3.md` - Especificación maestra
- `SAIDONCLUB_ESPECIFICACION_TECNICA_COMPLETA_v2.md.pdf` - Especificación técnica PDF
- `ANALISIS_COMPARATIVO_SAIDONCLUB.md` - Análisis comparativo

---

## 12. Comandos y Scripts

### 12.1 Comandos Principales

```bash
# Desarrollo
pnpm dev                          # Iniciar servidor de desarrollo en port 3000
pnpm build                        # Build de producción
pnpm start                        # Iniciar servidor de producción

# Base de datos
pnpm db:generate                  # Generar cliente Prisma
pnpm db:migrate                   # Aplicar migraciones
pnpm db:migrate dev               # Migración en desarrollo
pnpm db:seed                      # Poblar base de datos

# Calidad de código
pnpm lint                         # Linting
pnpm typecheck                    # Verificación de tipos

# Workspace
pnpm -r build                     # Build de todos los paquetes
pnpm -r --filter @saidonclub/mlm-engine build  # Build específico
```

---

## 13. Estado del Proyecto y Pendientes

### 13.1 Estado Actual (2026-05-07)

| Área                  | Estado           | Notas                                            |
| --------------------- | ---------------- | ------------------------------------------------ |
| Build Producción      | ✅ Exit 0        | `next build` sin errores                         |
| TypeScript            | ✅ Sin errores   | `tsc --noEmit` pasa limpio                       |
| Core Sistema          | ✅ Operativo     | Marketplace, Auth, RBAC                          |
| MLM Engine            | ✅ Operativo     | Comisiones, rangos, closure                      |
| Terminal API          | ✅ Parcial       | Con fallback data para demo                      |
| Base de Datos         | ✅ Parcial       | Schema completo, algunos queries fallan          |
| UI/UX                 | ✅ En Desarrollo | Glassmorphism, diseño premium                    |
| Rendering Next.js     | ✅ Corregido     | Suspense wrappers en todos los useSearchParams   |
| Archivos del proyecto | ✅ Limpio        | 50+ archivos basura eliminados                   |

### 13.2 Issues Conocidos

1. **Sharp Warning (build):** Módulos nativos opcionales de `sharp` muestran warning. Suprimido con `serverExternalPackages: ["sharp"]` en `next.config.ts`. No afecta funcionalidad.
2. **Database Queries:** Algunas consultas Prisma pueden fallar en producción si la DB no está activa.
3. **Terminal API:** Usa datos de fallback cuando Prisma no responde (modo demo/dev).

### 13.3 Próximos Pasos Recomendados

1. Ejecutar `pnpm dev` y verificar todas las rutas en el navegador
2. Conectar base de datos de producción y validar queries Prisma
3. Completar integración de pagos con Stripe (checkout flow)
4. Finalizar integración WhatsApp onboarding
5. Configurar CI/CD en Vercel con las variables de entorno correctas
6. Ejecutar seed maestro (`pnpm db:seed`) en el entorno de staging

---

## 📚 Para Desarrolladores Futuros

Este documento sirve como punto de partida para cualquier developer o agente IA que quiera continuar o mejorar el proyecto.

**Reglas de Oro:**

1. **internalPrice** NUNCA sale del servidor
2. Usar transacciones ACID para operaciones financieras
3. Siempre validar permisos en API routes
4. Mantener el esquema de comentarios en todos los módulos

---

_Documento actualizado: 2026-05-07 — Build limpio, Suspense fixes aplicados, archivos basura eliminados_  
_SaidonClub OS v5.2.0 - Marketplace, MLM & Services Platform_
