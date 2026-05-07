# AGENT CHECKLIST - SAIDONCLUB OS

## Checklist Profesional de Implementación

**Versión:** 1.0
**Fecha:** 2026-05-02
**Objetivo:** Llevar el sistema del 88% al 100%

---

## 🚀 INSTRUCCIONES PARA AGENTES

1. **Leer siempre el contexto** antes de implementar cualquier feature
2. **Seguir el orden de prioridad** establecido en este checklist
3. **Ejecutar pruebas después** de cada módulo completado
4. **Documentar cambios** en el formato indicado
5. **No exposeder `internalPrice`** al frontend bajo ninguna circunstancia

---

## 📋 MÉTRICAS DEL SISTEMA

| Métrica             | Valor Actual | Valor Objetivo |
| ------------------- | ------------ | -------------- |
| Score General       | 88%          | 100%           |
| APIs Funcionales    | 34/34        | 34/34          |
| TypeScript          | ✅ PASS      | ✅ PASS        |
| Dashboard KPIs      | 80%          | 100%           |
| Wallet Retiros      | 70%          | 100%           |
| Árbol Genealógico   | 0%           | 100%           |
| 2FA                 | 0%           | 100%           |
| Notificaciones Push | 50%          | 100%           |
| Micro-animaciones   | 60%          | 100%           |

---

## ✅ FASE 1: HIGH PRIORITY

### Tarea 1.1: Dashboard KPIs - Métricas de Conversión

**Estado:** PENDIENTE | **Prioridad:** HIGH

**Objetivo:** Implementar métricas faltantes:

- [ ] % de compra en 7 días después de registro
- [ ] % de activación de membresía
- [ ] Gráficos de tendencias en dashboard admin
- [ ] KPIs en tiempo real

**Ubicación código:**

- `apps/web/app/dashboard/page.tsx`
- `apps/web/app/admin/page.tsx`
- `packages/database/prisma/schema.prisma`

**Validación:**

```bash
cd apps/web && npm run build
npm run typecheck
```

---

### Tarea 1.2: Wallet - Retiros Bancarios

**Estado:** PENDIENTE | **Prioridad:** HIGH

**Objetivo:** Completar flujo de retiros:

- [ ] Formulario de solicitud de retiro
- [ ] Validación de límites diarios
- [ ] Integración con procesador de pagos
- [ ] Historial de retiros
- [ ] Estados: pendiente/aprobado/rechazado

**Ubicación código:**

- `apps/web/app/api/wallet/withdraw/route.ts`
- `apps/web/app/dashboard/wallet/page.tsx`

**Validación:**

```bash
# Probar endpoint
curl -X POST http://localhost:3000/api/wallet/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "bankAccount": "..."}'
```

---

### Tarea 1.3: Árbol Genealógico - Visualizador UI

**Estado:** PENDIDAD | **Prioridad:** HIGH

**Objetivo:** Hacer visible el visualizador:

- [ ] Componente de árbol genealógico
- [ ] Integración con datos de referidos
- [ ] Navegación entre niveles
- [ ] Estilos profesionales

**Ubicación código:**

- `apps/web/app/dashboard/arbol/page.tsx`
- `packages/types/index.ts`

**Validación:**

- Acceder a `/dashboard/arbol`
- Verificar que muestra la estructura de referidos

---

## ✅ FASE 2: MEDIUM PRIORITY

### Tarea 2.1: 2FA - Autenticación de Dos Factores

**Estado:** PENDIENTE | **Prioridad:** MEDIUM

**Objetivo:** Implementar 2FA completo:

- [ ] Generar códigos QR para TOTP
- [ ] Validar código en login
- [ ] Opción de habilitar/deshabilitar
- [ ] Backup codes

**Ubicación código:**

- `apps/web/app/api/auth/2fa/route.ts`
- `apps/web/app/auth/login/page.tsx`

**Validación:**

```bash
# Verificar que 2FA está implementado
grep -r "totp" apps/web/app/api/
grep -r "two-factor" apps/web/
```

---

### Tarea 2.2: Notificaciones Push

**Estado:** PENDIENTE | **Prioridad:** MEDIUM

**Objetivo:** Completar sistema de notificaciones:

- [ ] Service Worker para push
- [ ] Permisos de notificaciones
- [ ] Templates de notificaciones
- [ ] Historial de notificaciones

**Ubicación código:**

- `apps/web/public/sw.js`
- `apps/web/app/api/notifications/push/route.ts`

**Validación:**

- Abrir DevTools > Application > Service Workers
- Verificar registration exitosa

---

## ✅ FASE 3: LOW PRIORITY

### Tarea 3.1: Micro-animaciones y Glassmorphism

**Estado:** PENDIENTE | **Prioridad:** LOW

**Objetivo:** Mejorar experiencia visual:

- [ ] Animaciones CSS con clamp() para tipografía fluida
- [ ] Efectos glassmorphism en modales
- [ ] Transiciones suaves
- [ ] Loading states

**Ubicación código:**

- `apps/web/app/globals.css`
- Componentes en `apps/web/components/`

**Validación:**

```bash
# Verificar que no hay errores CSS
npm run lint:css
```

---

## 🧪 PROTOCOLO DE PRUEBAS

### Pruebas Unitarias

```bash
cd packages/database && npx prisma generate
cd apps/web && npm run typecheck
```

### Pruebas de Integración

```bash
# Verificar APIs
curl -X GET http://localhost:3000/api/health

# Verificar Auth
curl -X POST http://localhost:3000/api/auth/me
```

### Pruebas E2E (Manual)

1. **Registro:** Crear cuenta nueva
2. **Login:** Verificar acceso
3. **Membresía:** Comprar membresía
4. **Dashboard:** Ver métricas
5. **Wallet:** Solicitar retiro
6. **Árbol:** Ver referidos
7. **2FA:** Habilitar y probar

---

## 📝 FORMATO DE REPORTE

Después de cada tarea completada, documentar:

```markdown
## Tarea X.X: [Nombre]

**Fecha:** YYYY-MM-DD HH:MM
**Tiempo estimado:** X horas
**Tiempo real:** X horas

### Cambios realizados:

- [ ] Cambio 1
- [ ] Cambio 2

### Pruebas realizadas:

- [ ] Prueba 1: ✅ PASS/❌ FAIL
- [ ] Prueba 2: ✅ PASS/❌ FAIL

### Bloqueos o Issues:

- Issue 1: Descripción
- Issue 2: Descripción

### Próximos pasos:

1. siguiente tarea...
```

---

## 📞 CONTACTOS Y RECURSOS

- **Documento Maestro:** `Documento Maestro definitivo de SAIDONCLUB.txt`
- **Análisis Comparativo:** `ANALISIS_COMPARATIVO_SAIDONCLUB.md`
- **Auditoría Forense:** `docs/reports/AUDITORIA_FORENSE_CHECKLIST.md`
- **Specs Técnicas:** `SAIDONCLUB_ESPECIFICACION_MAESTRA_v3.md`

---

_Este checklist debe ser seguido en orden. No saltar tareas sin completar las anteriores._
