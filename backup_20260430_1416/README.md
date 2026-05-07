# 🚀 SaidonClub OS v5.2

![SaidonClub](Logotipo%20SaidonClub-blue1.png)

**SaidonClub OS** es una plataforma integral de Marketplace, Marketing Multinivel (MLM) y Servicios Profesionales diseñada para operar a escala global con soporte multi-país y multi-moneda.

## 🌟 Características Principales
- **Marketplace Global:** Integración nativa con dropshipping (Ecuador-first).
- **Servicios Profesionales:** Contratación de expertos geolocalizados con perfiles validados.
- **Motor MLM Avanzado:** Gestión de redes, comisiones en cascada de 8 niveles, regalías y rangos automáticos.
- **UI/UX Premium:** Interfaz basada en Glassmorphism, temas dinámicos por categoría y diseño "Obsidian & Orange".
- **Arquitectura de Alta Disponibilidad:** Monorepo con Turborepo, Next.js 15, Prisma y Supabase.

## 🏗️ Estructura del Proyecto
```bash
saidonclub-os/
├── apps/web                   # Aplicación principal Next.js
├── packages/
│   ├── database               # Modelos Prisma y Cliente Supabase
│   ├── config-engine          # Gestor de configuración dinámico
│   ├── mlm-engine             # Lógica de cálculo de comisiones
│   ├── ui                     # Biblioteca de componentes compartidos
│   └── types                  # Definiciones de TypeScript globales
└── scripts/                   # Herramientas de automatización y seeds
```

## 🚀 Inicio Rápido
1. **Instalación:** `pnpm install`
2. **Base de Datos:** `pnpm db:generate`
3. **Desarrollo:** `pnpm dev`

## 📅 Estado de la Hoja de Ruta
Consulta el [MASTER_CONTEXT.md](SAIDONCLUB_OS_MASTER_CONTEXT.md) para ver el desglose detallado de las fases de desarrollo y los reportes de auditoría.

---
*Owner: Víctor Hugo Villegas*
*Tecnología: Antigravity AI Engine*
