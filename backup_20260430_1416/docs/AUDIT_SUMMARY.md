# 📂 SaidonClub OS — Documentación Maestra v5.2

Este documento proporciona una visión completa del estado actual del sistema, sus módulos, páginas y el progreso del checklist de desarrollo.

## 🏗️ 1. Estructura del Sistema (Mapa de Páginas)

### 🛍️ Marketplace & Productos
- `/productos`: Catálogo general de productos.
- `/productos/[slug]`: Detalle del producto y personalización.
- `/categorias`: Listado de categorías premium.
- `/categorias/[slug]`: Productos filtrados por categoría.

### 💼 Servicios
- `/servicios`: Directorio de servicios profesionales.
- `/servicios/[slug]`: Detalle del servicio y reserva/compra.

### 🛒 Flujo de Venta
- `/carrito`: Gestión de productos seleccionados.
- `/checkout`: Proceso de pago y envío.
- `/pagos`: Confirmación y estados de transacciones.

### 💎 Membresías & Red
- `/membresias`: Planes de socio (Preferente, Pionero).
- `/dashboard`: Panel de control del usuario.
- `/dashboard/red`: Visualización de la estructura MLM (NetworkTree).
- `/dashboard/wallet`: Gestión de puntos y saldo.

### 🛡️ Administración & Auditoría
- `/admin`: Panel de gestión interna.
- `/auditor`: Vista de solo lectura para supervisión.

### 📄 Información & Soporte
- `/nosotros`: Historia y misión de SaidonClub.
- `/contacto`: Formulario de soporte.
- `/ayuda`: Centro de ayuda y preguntas frecuentes.

---

## 🛠️ 2. Lista de Módulos & Componentes Clave

### 🧩 Componentes de Interfaz (`apps/web/components`)
- **Home**: Hero, Featured Products, Benefits.
- **Marketplace**: `ProductCard`, `AddToCartButton`, `ProductGrid`, `Filters`.
- **Layout**: `Navbar`, `Footer`, `Sidebar`, `CartReminder`.
- **Shared**: `Button`, `Input`, `Badge`, `Skeleton` (Pendiente).
- **Security**: Auth forms, Protected routes.

### ⚙️ Lógica de Negocio
- **Contextos**: `AuthContext`, `CartContext`, `UIContext`.
- **Acciones**: `cartActions`, `authActions`, `orderActions`.
- **Base de Datos**: Esquemas Prisma, Seed Maestro, Supabase Auth.

---

## 📈 3. Auditoría de Checklist (Estado Actual)

| Tarea | Estado | Prioridad |
| :--- | :---: | :---: |
| **Poblar DB (Seed Maestro)** | ✅ | Alta |
| **Botón Añadir vs Detalles** | ✅ | Alta |
| **Persistencia de Carrito** | ✅ | Alta |
| **Arreglo Visual Rolex** | ✅ | Media |
| **Micro-animaciones Premium** | ✅ | Media |
| **Validación de Datos (JSON)** | ⏳ | Alta |
| **Limpieza de Categorías** | ⏳ | Media |
| **Skeleton Loaders** | ⏳ | Media |
| **TypeScript Audit** | ⏳ | Baja |
| **Refactor `ProductCard`** | ⏳ | Media |
| **Auditoría Visual Profunda** | 🏃 | Crítica |
| **Auditoría Funcional Total** | 🏃 | Crítica |

---

## 🛡️ 4. Auditoría Visual & Funcional (Hallazgos)

> [!IMPORTANT]
> Iniciando auditoría profunda mediante navegación automatizada y revisión de código.

### Hallazgos Visuales:
- [x] Grilla de productos: Ajustada a 4 columnas en desktop.
- [x] Imágenes: Rolex corregido.
- [ ] Coherencia de color: Verificar "Obsidian & Orange" en todos los botones.

### Hallazgos Funcionales:
- [x] Añadir al carrito: Funciona con feedback visual.
- [ ] Redirección a opciones: Verificar en productos configurables.
- [ ] Checkout: Pendiente verificación de pasarela de pago.

---

## 💾 5. Registro de Respaldo
**Punto de Restauración**: `v5.2.0-checkpoint-full`
**Fecha**: 2026-04-30
**Estado**: Estable para auditoría final.
