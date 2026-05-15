# 📂 Web Library (apps/web/lib)

Este directorio contiene la lógica central del servidor, servicios de infraestructura y utilidades críticas para la aplicación web.

## 🚀 Componentes Clave

- **`logger.ts`**: Sistema de logging estructurado Omega (JSON).
- **`env.ts`**: Validación de variables de entorno en runtime usando Zod.
- **`redis.ts`**: Cliente Upstash Redis para rate limiting y cache.
- **`prisma.ts`**: Instancia global del cliente Prisma ORM.
- **`auth/`**: Lógica central de autenticación y tipos de usuario.
- **`multimedia/`**: Procesamiento de imágenes con Sharp y optimización.

## 🛡️ Seguridad
Todas las funciones en este directorio están diseñadas para ejecutarse exclusivamente en el servidor (`server-side`).
