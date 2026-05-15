# ⚙️ Paquete Config-Engine

Gestor dinámico de configuración central del sistema **SaidonClub**.

## Responsabilidades
- Proveer valores por defecto y configuraciones cacheadas en memoria para evitar sobrecarga de la BD.
- Administrar parámetros del negocio (porcentajes de comisiones, comisiones residuales por nivel, umbrales de rango).
- Sincronización entre base de datos y Redis (Upstash) para alta disponibilidad.

## Componentes Clave
- `ConfigManager`: Singleton que centraliza la obtención y actualización de claves de configuración de forma segura y tipada.
