# 📂 Context Providers (apps/web/context)

Este directorio contiene todos los proveedores de contexto de React que gestionan el estado global de la aplicación.

## 🌐 Proveedores Disponibles

- **`AuthContext`**: Estado de autenticación global y sesión de Supabase.
- **`ThemeContext`**: Gestión del modo oscuro/claro y variables de color.
- **`CartContext`**: Estado del carrito de compras y persistencia.
- **`NotificationsContext`**: Sistema global de alertas y notificaciones push/UI.
- **`LocationContext`**: Geolocalización y preferencias de país/idioma.
- **`ChatContext`**: Estado de la mensajería en tiempo real.

## ⚠️ Nota
La mayoría de estos contextos están envueltos en el `layout.tsx` raíz para estar disponibles en toda la aplicación.
