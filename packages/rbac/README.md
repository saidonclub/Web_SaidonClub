# 🛡️ Paquete RBAC (Role-Based Access Control)

Motor de control de acceso jerárquico de 12 niveles para **SaidonClub**.

## Responsabilidades
- Centralizar las definiciones de roles (desde `GUEST` hasta `SYSTEM_OWNER`).
- Gestionar matrices de permisos detalladas para cada rol.
- Proveer utilidades y Guards (`hasPermission`, `isRoleAtLeast`) que la aplicación web y los Server Actions utilizan para proteger recursos críticos.
- Asegurar que ninguna acción forense sea ejecutada por un actor sin privilegios.
