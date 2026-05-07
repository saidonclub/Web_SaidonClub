# @saidonclub/analytics

Sistema de análisis de eventos para SaidonClub OS.

## Uso

```typescript
import { analytics } from '@saidonclub/analytics';

// Inicializar
analytics.init();

// Trackear evento
analytics.track({
  event: 'product_view',
  category: 'ecommerce',
  label: 'Product View',
  value: 100,
  metadata: {
    productId: '123',
    productName: 'Producto Ejemplo'
  }
});

// Page view
analytics.pageview('productos', { city: 'bogota' });

// Track productos
analytics.trackProductView('prod-1', 'Camisa', 25000, 'ropa');
analytics.trackAddToCart('prod-1', 'Camisa', 25000, 2);
analytics.trackCheckout(50000, 3);

// Track usuarios
analytics.trackSignup('email');
analytics.trackLogin('google');
analytics.trackMembershipPurchase('plan-pro', 'Plan Pro', 150000);
```

## Funciones Disponibles

- `init()` - Inicializa el tracker
- `track(event)` - Trackea evento personalizado
- `pageview(pageName, metadata)` - Trackea vistas de página
- `trackProductView()` - Vista de producto
- `trackAddToCart()` - Agregar al carrito
- `trackCheckout()` - Checkout completado
- `trackSignup()` - Registro de usuario
- `trackLogin()` - Inicio de sesión
- `trackMembershipPurchase()` - Compra de membresía

## Configuración

El módulo usa localStorage para almacenamiento. Configurar en `.env`:
- `NEXT_PUBLIC_ANALYTICS_ENABLED=true` - Habilitar tracking