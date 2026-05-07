# 🚀 PLANIFICACIÓN TÉCNICA — SAIDONCLUB v6.1

Este documento detalla la hoja de ruta para la implementación de las mejoras críticas solicitadas, asegurando la integridad visual y funcional del sistema.

## 1. OBJETIVOS PRINCIPALES

1.  **Filtrado Regional Multi-Nivel**: Implementar un sistema de selección País → Provincia → Ciudad con pestañas y menús desplegables.
2.  **Geolocalización Premium**: Integrar búsqueda por ubicación actual conectada a servicios de Google Maps.
3.  **Tipografía y Layout Fluido**: Asegurar que ningún texto o input se mutile o solape en ninguna resolución usando CSS moderno (`clamp`, `flex`, `grid`).
4.  **Corrección de Regresiones Visuales**:
    *   Alinear dropdowns correctamente debajo de su selector.
    *   Aumentar tamaño del logotipo institucional.
    *   Eliminar áreas muertas y optimizar interlineado.
    *   Corregir repetición de imágenes en secciones dinámicas.

## 2. ARQUITECTURA DE COMPONENTES

### 📍 Componente `RegionSelector`
*   **Estado**: Manejará `selectedCountry`, `selectedProvince` y `selectedCity`.
*   **UI**: Pestañas superiores para navegar entre niveles. Menú desplegable tipo "Pop-over" centrado bajo el selector.
*   **Lógica**: Al seleccionar un país, habilita la pestaña de provincia con datos filtrados. Al seleccionar provincia, habilita ciudad.
*   **Geolocalización**: Botón destacado "Búsqueda cerca de mí" que activa el API de Geolocation y realiza reverse geocoding (Google Maps API).

### 📐 Sistema de Diseño Responsivo
*   **Global CSS**: Implementar variables de escala tipográfica fluida.
*   **Inputs**: Ajuste dinámico de padding y font-size para evitar desbordamientos.
*   **Contenedores**: Reemplazar anchos fijos por `min-width`, `max-width` and `width: 100%`.

## 3. HOJA DE RUTA DE IMPLEMENTACIÓN

### Fase 1: Estabilización de Estilos Globales
*   Actualizar `globals.css` con reglas de tipografía fluida.
*   Ajustar tokens de espaciado y bordes.
*   Configurar el reset de inputs para adaptabilidad total.

### Fase 2: Reingeniería del `RegionSelector`
*   Refactorizar la lógica de pestañas en `RegionSelector.tsx`.
*   Añadir el soporte para múltiples países y provincias.
*   Corregir la posición absoluta del dropdown en el CSS Module.
*   Implementar el flujo de geolocalización con feedback visual (loading).

### Fase 3: Ajustes de Layout y Logo
*   Modificar `Navbar.tsx` para aumentar el tamaño del logo (`200x50` aprox).
*   Revisar `HomeCarousel.tsx` y `MotivationSection.tsx` para eliminar la repetición de imágenes.
*   Depurar áreas muertas (paddings excesivos o márgenes negativos).

### Fase 4: Validación y Pulido
*   Pruebas en múltiples viewports (Mobile, Tablet, Desktop).
*   Verificación de interlineados y alineaciones.
*   Auditoría de performance y accesibilidad.

## 4. CONSIDERACIONES TÉCNICAS
*   **Next.js**: Uso estricto de `use client` para componentes interactivos.
*   **Lucide React**: Iconografía consistente.
*   **Google Maps API**: Se requiere clave de API para el geocoding real; se implementará el mock robusto si no está disponible la key.

---
**Firmado:** Antigravity AI
**Estado:** En Ejecución 🚀
