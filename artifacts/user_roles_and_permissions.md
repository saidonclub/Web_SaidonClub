# Roles y Permisos de Usuarios - SaidonClub

El sistema SaidonClub cuenta con una estructura jerárquica de roles (categorías de usuario) definida en la base de datos (`UserRole`), diseñada para gestionar desde clientes estándar hasta administradores de alto nivel y proveedores especializados.

A continuación, se detalla la lista completa de roles, sus privilegios, funciones y jerarquía dentro de la plataforma.

---

## 1. Roles de Administración y Operaciones (Backoffice)
Estos roles tienen acceso al panel de administración (AdminShell) y gestionan la plataforma a nivel global o departamental.

### 🌟 SUPER_ADMIN
Es el rol de mayor jerarquía. Tiene control absoluto sobre toda la plataforma.
*   **Privilegios:** Acceso total e irrestricto.
*   **Funciones principales:**
    *   Modificar configuraciones globales del sistema (`SystemConfig`).
    *   Gestionar y asignar roles a otros usuarios (crear otros Admins).
    *   Acceso total a los fondos de reserva (`FundsReserve`) y cierres financieros.
    *   Auditoría completa (`AuditLog`) de todas las acciones de la plataforma.
    *   Bypass de restricciones de sistema.

### 🛠️ ADMIN
Rol operativo para la gestión diaria del marketplace y la red.
*   **Privilegios:** Alto.
*   **Funciones principales:**
    *   Aprobar/rechazar productos y servicios creados por proveedores.
    *   Gestionar y aprobar KYC de los usuarios.
    *   Crear y gestionar categorías (`Category`), banners y mensajes dinámicos (`TickerMessage`).
    *   Gestionar usuarios estándar y resolver disputas.

### 💰 ACCOUNTANT (Contador / Financiero)
Rol especializado en las finanzas, comisiones y pagos.
*   **Privilegios:** Medio-Alto (restringido a módulos financieros).
*   **Funciones principales:**
    *   Ejecutar y validar los Cierres Semanales (`WeeklyClosure`).
    *   Supervisar las Billeteras (`Wallet`) y transacciones (`WalletTransaction`).
    *   Auditar el cálculo de Comisiones (`Commission`) y Bonos Semilla (`SeedBonus`).
    *   Aprobar retiros de fondos de los usuarios.

### 🎧 SUPPORT (Soporte al Cliente)
Personal encargado de atender consultas y problemas de los usuarios.
*   **Privilegios:** Medio.
*   **Funciones principales:**
    *   Visualizar perfiles de usuarios y estados de pedidos para dar asistencia.
    *   Asistir en procesos de KYC.
    *   Gestionar tickets de soporte (sistema futuro).

### 🔍 AUDITOR
Rol de solo lectura para revisiones externas o internas de cumplimiento.
*   **Privilegios:** Medio (Solo Lectura).
*   **Funciones principales:**
    *   Revisar los registros de auditoría (`AuditLog`).
    *   Visualizar movimientos financieros y transacciones sin capacidad de modificarlos.

---

## 2. Roles de Proveedores (Marketplace)
Usuarios que ofrecen sus productos o servicios dentro del ecosistema SaidonClub.

### 📦 PROVIDER_PRODUCTS (Proveedor de Productos)
Vendedores de productos físicos o digitales.
*   **Privilegios:** Específicos del Marketplace.
*   **Funciones principales:**
    *   Gestionar su perfil de empresa (`ProviderProfile`).
    *   Crear y editar sus propios productos (`Product`), sujetos a aprobación de un ADMIN.
    *   Gestionar el inventario de sus productos.
    *   Ver y gestionar los pedidos (`Order`) que contienen sus productos.

### 📅 PROVIDER_SERVICES (Proveedor de Servicios)
Profesionales o empresas que ofrecen servicios con agenda o citas.
*   **Privilegios:** Específicos del Marketplace y Agenda.
*   **Funciones principales:**
    *   Gestionar su perfil de empresa y ubicaciones (`ProviderProfile`).
    *   Crear y editar servicios (`Service`), sujetos a aprobación de un ADMIN.
    *   Gestionar las Citas (`Appointment`) reservadas por los clientes.
    *   Escanear el Código QR de los clientes para confirmar la asistencia y liberar pagos/puntos.

*(Nota: Un usuario podría tener teóricamente permisos para ambos si el sistema lo permite, pero la base de datos distingue sus capacidades principales a través de estos roles).*

---

## 3. Roles de Clientes y Red (MLM)
Usuarios que compran, consumen y participan en el plan de compensación.

### 👤 CLIENT (Cliente Estándar)
Usuario base del sistema tras registrarse de forma gratuita.
*   **Privilegios:** Básicos.
*   **Funciones principales:**
    *   Navegar por el marketplace y realizar compras (Productos y Servicios).
    *   Generar Puntos (`pointsEarned`) por compras, pero con limitaciones en la red.
    *   Tener acceso a su Billetera (`Wallet`) y actualizar su KYC.

### 💎 PREFERENTE (Cliente con Membresía Preferente)
Usuario que ha adquirido la membresía "Preferente". Es a la vez un `UserRole` y un `MembershipType`.
*   **Privilegios:** Beneficios medios en la red.
*   **Funciones principales:**
    *   Todos los beneficios del CLIENT.
    *   Descuentos especiales (`priceSaidon`).
    *   Activación (`ActivationStatus`) automática por un período que le permite cobrar comisiones.
    *   Participación activa en el plan de compensación (Red multinivel / Bonos semilla).

### 🚀 PIONERO (Cliente con Membresía Pionero)
Usuario que ha adquirido la membresía "Pionero". Es el nivel más alto de la red.
*   **Privilegios:** Beneficios máximos en la red.
*   **Funciones principales:**
    *   Todos los beneficios del PREFERENTE.
    *   Máximo porcentaje de beneficios en comisiones y Bonos Semilla.
    *   Acceso prioritario a recompensas del sistema de Fidelidad (`FidelityTracking`) y Rangos (`Rank`).

---

## 🔑 Jerarquía de Activación y Permisos de Compra
*   **Reglas de KYC:** Para que un usuario (CLIENT, PREFERENTE, PIONERO o PROVIDER) pueda realizar retiros financieros o ciertas compras mayores, debe tener su KYC en estado `APROBADO` o alcanzar un `kycLevel` determinado.
*   **Activación Mensual (`ActivationStatus`):** Para que un PREFERENTE o PIONERO pueda cobrar comisiones de red, debe mantener su estado como Activo (`isActive: true`), lo cual se logra comprando una membresía, acumulando Puntos Mensuales (`points30d`), o mediante una activación manual de un Administrador.
