# 📂 SaidonClub OS — Root File Mapping & Categorization
> **Propósito:** Documentar la organización de archivos en la raíz del proyecto para facilitar el mantenimiento y la escalabilidad.

## 📁 Categorías de Archivos

### 🛠️ Configuración del Proyecto (Project Config)
Archivos que definen cómo se construye, ejecuta y gestiona el monorepo.
- **[package.json](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/package.json)**: Definición global de dependencias, scripts y versión del proyecto (v5.2.0).
- **[turbo.json](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/turbo.json)**: Configuración del motor de construcción Turbo para ejecución paralela y cache.
- **[pnpm-workspace.yaml](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/pnpm-workspace.yaml)**: Define la estructura del monorepo (apps/* y packages/*).
- **[tsconfig.base.json](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/tsconfig.base.json)**: Configuración base de TypeScript para todos los subproyectos.

### 🔑 Entorno y Secretos (Environment & Secrets)
Configuraciones locales y variables de entorno (No se suben a Git).
- **[.env](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/.env)**: Variables de entorno activas (Supabase, Prisma, etc.).
- **[.env.example](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/.env.example)**: Plantilla para nuevos desarrolladores.
- **[.gitignore](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/.gitignore)**: Define qué archivos ignorar en el control de versiones.

### 🧠 Contexto e Inteligencia (Context & Intelligence)
Guías para agentes de IA y documentación maestra.
- **[SAIDONCLUB_OS_MASTER_CONTEXT.md](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/SAIDONCLUB_OS_MASTER_CONTEXT.md)**: Documento maestro con la hoja de ruta, arquitectura y reglas de negocio.
- **[.antigravity_rules.md](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/.antigravity_rules.md)**: Reglas específicas para el comportamiento del agente Antigravity.

### 📦 Bloqueos de Dependencias (Locks)
Archivos generados automáticamente para garantizar versiones exactas.
- **[pnpm-lock.yaml](file:///c:/Users/Gatita/OneDrive/Desktop/Web_SaidonClub/pnpm-lock.yaml)**: Lockfile de pnpm.

---

## 🏗️ Directorios de Nivel Superior

| Directorio | Categoría | Propósito |
|------------|-----------|-----------|
| `apps/` | Aplicaciones | Código final de las aplicaciones (Web, Admin, etc.). |
| `packages/` | Librerías | Motores compartidos (Database, MLM, UI, Types). |
| `docs/` | Documentación | Guías, especificaciones, respaldos y versiones. |
| `supabase/` | Infraestructura | Edge Functions y configuración de Supabase local. |
| `assets/` | Recursos | Imágenes, fuentes y logos globales. |

---
**Última revisión:** 2026-04-23 | **Versión:** 1.0.0
