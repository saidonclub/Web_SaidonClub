# 🧠 SAIDONCLUB — AI SYSTEM CONTEXT & ARCHITECTURE GUIDELINES

> **⚠️ AVISO PARA AGENTES DE INTELIGENCIA ARTIFICIAL:** 
> Lee este archivo antes de realizar cualquier intervención arquitectónica, refactorización o desarrollo de nuevas funcionalidades en este repositorio. Este documento contiene la "verdad absoluta" (Single Source of Truth) del estado técnico y las reglas de diseño de SaidonClub OS.

---

## 🏗️ 1. Arquitectura del Proyecto (Turborepo)
El proyecto es un **Monorepo** gestionado con `pnpm` (Workspace) y `Turborepo`. 
La lógica de negocio pesada está dividida en paquetes en lugar de acoplarse directamente a la aplicación web.

**Estructura Base:**
*   **`apps/web`**: Aplicación Frontend y Backend principal (Next.js v15, React v19). Configurado para soportar `App Router`, SSR y validaciones de cookies (cuidado con el "Dynamic Server Usage" al usar cookies, es el comportamiento esperado).
*   **`packages/database`**: Motor de base de datos. Contiene el esquema de `Prisma`, migraciones y los scripts maestros de *seeding* (como `seed_maestro.ts`). 
    *   *Nota Crítica:* El cliente de Prisma se genera en una ruta customizada: `./src/generated/client_v3`. **Siempre importa desde ahí** (Ej: `const { PrismaClient } = require('./src/generated/client_v3')`) para evitar errores `EPERM` en Windows/Vercel o desconexiones del cliente.
*   **`packages/mlm-engine`**: Motor del sistema multinivel (Network Marketing). Contiene la lógica estricta para ascensos de rango y cálculo de comisiones en árbol genealógico en cascada.
*   **`packages/config-engine`**: Gestión de variables y conmutadores dinámicos guardados en base de datos (`SystemConfig`).
*   **`packages/rbac`**: Jerarquía de permisos y autenticación estructurada en 12 niveles.

---

## 🛠️ 2. Stack Tecnológico & Frameworks
*   **Frontend**: Next.js 15, React 19, Tailwind CSS (estrictamente adaptado a los *tokens* del diseño).
*   **Lenguaje**: **TypeScript** (estricto en todos los paquetes).
*   **Base de Datos**: PostgreSQL alojado en **Supabase**. Manejado mediante **Prisma ORM**.
*   **Autenticación**: Supabase Auth integrado nativamente (SSR tokens).
*   **Pagos (Mock/Prod)**: Stripe y PayPal.
*   **Inteligencia Artificial ("Albert PC / Albert AI")**: SDK de **Groq** (`groq-sdk`), **OpenRouter**, **Gemini**.
*   **Animaciones y UX**: `framer-motion`, `gsap`, `lenis` (para scroll ultra-suave).

---

## 🎨 3. UI/UX: Reglas Estéticas "Obsidian & Safety Orange"
SaidonClub no es un MVP corporativo estándar, es un producto de **lujo digital**. 
Cualquier código Frontend generado por IA **DEBE** respetar la estética de lujo del proyecto:
1.  **Paleta de Colores**: 
    *   Fondos oscuros absolutos y grises profundos (Obsidian, Anthracite).
    *   Acentos en color Naranja Seguridad (Safety Orange) puro o sutil, idealmente con glow o efectos neón ligeros.
2.  **Componentes**: 
    *   Uso mandatorio de **Glassmorphism** (fondos translúcidos con `backdrop-blur`).
    *   Bordes muy sutiles (`border-white/10`).
3.  **Micro-interacciones**: Transiciones y hovers fluidos. Nunca componentes "secos" o saltos bruscos. El usuario debe sentir una aplicación viva.

---

## 🔐 4. Configuración del Entorno y Despliegue
*   **Variables de Entorno (.env)**: Existe un único `.env` maestro en la raíz del repositorio de Turborepo. **Se purgaron todos los archivos `.env.local` o redundantes.** 
    *   Las variables para Next.js tienen el prefijo `NEXT_PUBLIC_`.
    *   Las credenciales de bases de datos son `DATABASE_URL` (Pooler) y `DIRECT_URL` (Conexión directa).
*   **Proceso de Compilación (Build)**: 
    1. Se debe correr `pnpm db:generate` en la raíz para construir la caché del cliente de Prisma.
    2. Luego correr `pnpm build` (o `turbo run build`). 
    3. Asegurarse de que las dependencias inter-paquetes (ej: importar de `@saidonclub/database`) estén construidas y transpuestas mediante `tsc`.

---

## 💾 5. Manejo de Datos, Marketplace y Sincronización Externa (Google Sheets)
*   **Productos y Servicios**: La lógica principal reside en el sistema. Los datos de prueba (Mock) se generan mediante `seed_maestro.ts`. Si se añaden campos al esquema Prisma (`schema.prisma`), es **obligatorio** correr migraciones y actualizar los scripts de semilla.
*   **Imágenes y Relaciones**: Cuando falten imágenes por defecto, consultar o usar scripts como `fix-service-images.js` para reparaciones bulk a través de consultas Raw SQL optimizadas.
*   **Google Sheets Bidirectional Sync**: Se ha integrado la librería `googleapis` en el entorno web. La lógica de sincronización está en `apps/web/lib/services/google-sheets.service.ts` y las rutas de API en `/api/admin/sync/sheet-to-db` y `/api/admin/sync/db-to-sheet`. Esta sincronización requiere `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_PRIVATE_KEY` en el `.env` para su correcto funcionamiento. Actúa como espejo dinámico e interfaz de auditoría externa.

## 🎯 6. Reglas de Modificación para la IA
1. **NO ROMPER TIPOS (Strict TypeScript)**: Evitar a toda costa usar `any` o `@ts-ignore`.
2. **NO HARDCODEAR**: Todo valor de diseño o constante crítica debe ir o en el archivo de entorno, o referenciado de los tokens del sistema (`SystemConfig` de DB o `tailwind.config.ts`).
3. **MANTENER EL MONOREPO**: Si creas un helper de base de datos o lógica abstracta de negocio, NO la coloques en `apps/web/app/`. Colócala en el paquete correspondiente bajo `/packages/...` y exponla.
4. **NO PROBAR CAMBIOS EN PRODUCCIÓN CIEGAMENTE**: Antes de refactorizar algo grande, corre localmente o crea scripts scratch en `scratch/`.
