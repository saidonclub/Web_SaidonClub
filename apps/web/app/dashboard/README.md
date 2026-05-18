# 📊 Dashboard Module — SaidonClub Omega OS
> **El centro de control para usuarios, proveedores y administradores.**

## 💎 Propósito
Este módulo gestiona todas las vistas personalizadas según el rol del usuario autenticado. Implementa un sistema de control de acceso (RBAC) granular para asegurar que cada usuario acceda solo a las funciones permitidas.

## 🏗️ Estructura
- `/config`: Configuraciones de navegación dinámica.
- `/components`: Widgets y layouts específicos del dashboard.
- `/layout.tsx`: Protector de ruta y validador de sesión.

## 🛡️ Seguridad
1. **SSR Protection:** Cada página verifica la sesión en el servidor.
2. **RBAC Guards:** Uso de `@saidonclub/rbac` para validar permisos.
3. **Data Isolation:** Los datos se filtran por `userId` o `role` en la capa de datos.

---
**© 2026 SaidonClub — Propiedad Intelectual de SaidonClub.**
