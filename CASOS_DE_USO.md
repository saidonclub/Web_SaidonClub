# 📋 CASOS DE USO — SAIDONCLUB OMEGA OS

Este documento detalla los flujos críticos de negocio y casos de uso del ecosistema SaidonClub para guiar las pruebas y el desarrollo.

## 1. Perfil: Administrador (Dashboard Admin)
El administrador tiene control total sobre el ecosistema.
- **Caso 1.1: Gestión de KYC**
  - El admin revisa los documentos cargados por los usuarios.
  - Aprueba o rechaza solicitudes con motivos claros.
  - Visualización: Tema "Neon Gamer" con variables globales.
- **Caso 1.2: Gestión de Retiros**
  - El admin procesa solicitudes de retiro de comisiones.
  - Verifica saldo disponible y estado del usuario.
- **Caso 1.3: Auditoría de MLM**
  - Monitoreo de la red de genealogía y distribución de puntos.

## 2. Perfil: Proveedor (Dashboard Provider)
Los proveedores listan sus productos o servicios en el marketplace.
- **Caso 2.1: Gestión de Catálogo**
  - Carga de nuevos productos/servicios con imágenes, precios y descripción.
  - Configuración de stock y categorías.
- **Caso 2.2: Gestión de Pedidos**
  - Seguimiento de ventas realizadas a través del sistema SaidonClub.
  - Actualización de estado de envío/prestación del servicio.

## 3. Perfil: Usuario / Pionero (Dashboard User)
El motor de la comunidad SaidonClub.
- **Caso 3.1: Marketplace de Productos (Color Rojo)**
  - Navegación por categorías de productos físicos.
  - Compra utilizando puntos acumulados o métodos de pago integrados.
- **Caso 3.2: Marketplace de Servicios (Color Azul Claro)**
  - Reserva de citas o servicios profesionales.
  - Flujo de citas familiares (Pendiente de implementación robusta).
- **Caso 3.3: Negocio de Referidos y Puntos (Color Violeta)**
  - Visualización de su red MLM (Genealogía).
  - Consulta de puntos acumulados por consumo propio y de referidos.
  - Generación de links de referido.

## 4. Flujos Transversales
- **Caso 4.1: Registro y Onboarding**
  - Registro de nuevo usuario bajo un link de referido.
  - Verificación de correo y configuración de perfil inicial.
- **Caso 4.2: Wallet y Finanzas**
  - Recarga de saldo (Stripe/PayPal/Cripto).
  - Conversión de comisiones a saldo retirable.

## 5. Estándares Visuales
- **Tema Oscuro (Default):** Obsidian & Safety Orange.
- **Breakpoints Críticos:**
  - Mobile (375px)
  - Tablet (768px)
  - Laptop (1024px)
  - Desktop (1440px)
