# PRD: Sistema MLM SaidonClub (v1.0)
**Estado**: Borrador Inicial | **Agencia**: Agencia de Desarrollo Web con IA

## 1. Visión del Producto
SaidonClub busca revolucionar el marketplace tradicional integrando un sistema de Multinivel (MLM) basado en puntos y comisiones directas. El objetivo es incentivar el crecimiento de la red mediante recompensas por ventas propias y de referidos.

## 2. Roles y Agentes Responsables
- **Arquitectura**: MetaGPT / Full-Stack Agent
- **Diseño de Interfaz**: UX/UI Agent
- **Garantía de Calidad**: QA Tester Agent

## 3. Requisitos Funcionales

### 3.1 Gestión de Red (Árbol MLM)
- El sistema debe permitir el registro de usuarios mediante un link de referidos.
- Estructura de árbol binaria o unilevel (a definir, predeterminado: Unilevel con profundidad de 5 niveles).
- Visualización gráfica del árbol de referidos para el usuario.

### 3.2 Sistema de Puntos y Comisiones
- Cada producto en el Marketplace tiene un valor en **Puntos Saidon**.
- Cálculo automático de comisiones:
  - Nivel 1: 10% del valor en puntos.
  - Nivel 2: 5% del valor en puntos.
  - Nivel 3-5: 2% del valor en puntos.
- Los puntos se convierten en crédito de la tienda o son retirables mediante solicitud (PostgreSQL + Logic Engine).

### 3.3 Dashboard de Afiliado
- Resumen de ganancias totales.
- Listado de referidos activos/inactivos.
- Historial de comisiones generadas.

## 4. Requisitos Técnicos
- **Frontend**: Next.js 14+ con Framer Motion para visualización de redes.
- **Backend**: API Routes de Next.js integradas con Prisma ORM.
- **Base de Datos**: PostgreSQL (Tablas: `User`, `Referral`, `Commission`, `Points`).
- **Seguridad**: Autenticación vía NextAuth.js y validación de transacciones en el servidor.

## 5. Criterios de QA
- Las comisiones no deben duplicarse en condiciones de alta concurrencia.
- El árbol de referidos debe cargar en menos de 200ms para redes de hasta 10,000 usuarios.
- Validación estricta de "Ciclos" o "Rangos" si se implementa sistema binario.

---
*Generado automáticamente por la Agencia de Desarrollo Web con IA de SaidonClub.*
