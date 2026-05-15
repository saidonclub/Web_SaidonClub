# SaidonClub OS v9.5 — Developer Technical Guide

## [AI_CONTEXT] Overview
Esta documentación está diseñada para guiar tanto a desarrolladores humanos como a asistentes de IA en la navegación y mantenimiento del ecosistema SaidonClub.

## Arquitectura del Sistema
- **Core**: Next.js 15 (App Router).
- **Styling**: Vanilla CSS Modules (Estética: Obsidian & Safety Orange).
- **Backend**: Supabase (Auth, DB, Storage).
- **Engine**: Monorepo gerenciado con Turborepo (apps/web, packages/*).

## Protocolos de Seguridad (Hardening)
1. **Headers**: Configurados en `next.config.ts` y reforzados en `middleware.ts`.
2. **CSP**: Política estricta que bloquea `object-src` y limita `script-src`.
3. **Auth**: Gestión mediante `@supabase/ssr` con validación de lado del servidor.
4. **RBAC**: Control de acceso basado en roles (`SUPER_ADMIN`, `ADMIN`, `PROVIDER`, `MEMBER`).

## Estándares de Diseño
- **Colores**: Uso obligatorio de variables CSS (`--clr-orange`, `--clr-bg-base`, etc.).
- **Componentes**: Deben ser responsivos usando `clamp()` y `flex/grid`.
- **UX**: Micro-animaciones obligatorias para feedback de usuario.

## Hoja de Ruta Activa
Ver `evolution_plan.md` para tareas pendientes y progreso actual.

## Mantenimiento
- Para añadir una nueva ruta, registrarla en `PUBLIC_PREFIXES` en `middleware.ts` si es pública.
- Las imágenes externas deben registrarse en `remotePatterns` de `next.config.ts`.
