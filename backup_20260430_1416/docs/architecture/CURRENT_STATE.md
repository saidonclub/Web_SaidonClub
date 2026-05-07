# 🏷️ Arquitectura Actual y Estado del Sistema
**Última actualización:** 2026-04-25
**Fase:** FASE 1 — Auditoría Premium UI y Estrategia de Respaldos Finalizada
**Testing Engine:** `chrome-devtools-mcp` (Playwright CDP) — PROTOCOLO OFICIAL

## 📌 Contexto Global
SaidonClub OS es un sistema integral que une:
1. **Marketplace Global:** Venta de productos (incluyendo Dropshipping).
2. **Servicios Profesionales:** Contratación de servicios geolocalizados (ej. Plomeros, Electricistas en Quito).
3. **Motor MLM (Multi-Level Marketing):** Generación de comisiones, regalías, puntos y rangos.

## 🗄️ Modelos de Base de Datos y Semillas (Seeds)
Hemos cargado exitosamente la base de datos con:
- **Catálogo Global (Productos):** 300 productos investigados para Dropshipping en Ecuador. Todos en estado `ACTIVE`, distribuidos en categorías, con sus costos, precio final (con descuento SaidonClub) y puntos a ganar.
- **Servicios Profesionales (Quito):** 100 perfiles de servicios distribuidos en categorías como Plomería, Electricidad, Asesoría Legal, Desarrollo Web, etc. Todos con sus perfiles de proveedores validados (`ProviderProfile`), ubicaciones en Google Maps y comisiones asociadas.
- Los productos y servicios están entrelazados con sus respectivos *Proveedores* (roles de usuario `PROVIDER`), *Categorías* (`Category`) y *Ciudad* (`City: Quito`).

## 🔍 Sistema de Búsqueda
El frontend y la API están preparados para un enrutamiento y búsqueda optimizada. Las entidades tienen `slugs` únicos y estructurados:
- Productos: `/producto/consola-avanzado-ecuadordropship-0`
- Servicios: `/servicio/srv-plomeria-profesional-quito-1`

Cualquier búsqueda en la plataforma es capaz de filtrar por:
1. `CityId` o geolocalización.
2. `CategoryId` (categorías que distinguen entre `PRODUCT` y `SERVICE`).
3. Términos de búsqueda relacionados con la descripción, precio o nombre de la empresa.

## 🛠️ Herramientas de Ingeniería, Backup y Versiones
- **Archivos de Ingeniería:** Todos los scripts de migraciones, seeds y configuraciones se encuentran debidamente versionados en el monorepo.
- **Motor de Configuración:** Las constantes vitales del negocio (Regalías, Precios de Membresía, Niveles de Bono) no están "quemadas" (hardcoded), sino que se alimentan del `ConfigManager` a través de la tabla `SystemConfig`.
- **Estrategia de Respaldos (Backup):** Se ha implementado un snapshot JSON automatizado (`docs/backups/database/SNAPSHOT_2026_04_25.json`) que captura el estado íntegro de productos, servicios y configuraciones vitales.
- **Scripts de Automatización:** Se introdujeron scripts en PowerShell (`scripts/SaidonClub_ProviderTool.ps1`) para orquestar la ingesta y optimización de activos multimedia de los proveedores.

## 🚀 Motor de Testing y QA: `chrome-devtools-mcp`
> **REGLA DE ORO:** Ninguna prueba de UI o flujo de compra se ejecuta con el agente visual (`browser_subagent`). El protocolo oficial usa CDP directo.

**Comandos estándar de QA para SaidonClub:**
```
# 1. Verificar homepage y cargar productos
mcp_chrome-devtools-mcp_navigate_page → http://localhost:3000
mcp_chrome-devtools-mcp_take_snapshot → leer DOM y validar UIDs

# 2. Navegar a catálogo de productos
mcp_chrome-devtools-mcp_navigate_page → http://localhost:3000/productos
mcp_chrome-devtools-mcp_evaluate_script → validar que productos tienen precio e imagen

# 3. Probar flujo de carrito
mcp_chrome-devtools-mcp_click [uid del botón 'Añadir al carrito']
mcp_chrome-devtools-mcp_evaluate_script → localStorage / context del carrito

# 4. Confirmar sin errores
mcp_chrome-devtools-mcp_list_console_messages → verificar cero errores JS
mcp_chrome-devtools-mcp_take_screenshot → evidencia visual final
```

## 🧭 Hojas de Ruta y Próximos Pasos para Futuros Agentes IA
- **[COMPLETADO 2026-04-25]** Auditoría Premium de la Home Page finalizada. Refactorización de `HomeCarousel` y `FeaturedProducts` con motor de temas dinámicos.
- **[COMPLETADO 2026-04-25]** Respaldo de contingencia generado exitosamente.
- **Dashboards:** Construir vistas detalladas para cada rol (Pionero, Preferente, Proveedor y Admin).
- **Control de errores:** Validar que los servicios locales se rendericen solo para las ciudades pertinentes.
- **Pruebas Wallet:** Verificar flujos de redención de puntos vía `evaluate_script` contra el `CartContext.tsx`.

*(Este archivo debe leerse junto con `SAIDONCLUB_OS_MASTER_CONTEXT.md` para mantener total sincronía visual y de código.)*
