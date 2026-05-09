# 🚀 PLAN MAESTRO DE EJECUCIÓN — SAIDONCLUB
## Prompt optimizado para Agente Antigravity
**Versión:** 1.0 | **Fecha:** 2026-05-07

---

> ⚠️ **NOTA DE SEGURIDAD CRÍTICA (ANTES DE EMPEZAR)**
> Los documentos de contexto contienen credenciales reales (GitHub token, Supabase token,
> contraseñas de correo, redes sociales). El agente debe:
> 1. NUNCA escribir estas credenciales en archivos de código o logs visibles.
> 2. Almacenarlas exclusivamente en variables de entorno (`.env.local`, secrets del repositorio).
> 3. Revocar y regenerar el token de GitHub `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`
>    y el Access Token de Supabase antes del despliegue, ya que fueron expuestos en documentos.

---

## PARTE 1 — ANÁLISIS DEL ESTADO REAL DEL SISTEMA

Antes de leer el prompt del agente, necesitas entender exactamente qué tiene y qué le falta al sistema:

### Lo que YA funciona (no tocar sin razón)
| Módulo | Estado |
|---|---|
| Autenticación Supabase | ✅ Funcional |
| Sistema MLM (mlm-engine) | ✅ Funcional |
| Wallet / Puntos / Comisiones | ✅ Funcional |
| 9 métodos de pago (estructura) | ✅ Funcional |
| RBAC (roles y permisos) | ✅ Funcional |
| UI responsive básica | ✅ Funcional |
| Notificaciones in-app | ✅ Funcional |
| Sistema de recomendaciones | ✅ Funcional |

### Lo que FALTA (prioridad de ejecución)
| # | Qué falta | Prioridad |
|---|---|---|
| 1 | Keys de Stripe/PayPal no configuradas | 🔴 CRÍTICA |
| 2 | Credenciales expuestas → revocar y rotar | 🔴 CRÍTICA |
| 3 | Pruebas automatizadas (cero tests) | 🟠 ALTA |
| 4 | Sistema de analytics (cero métricas) | 🟠 ALTA |
| 5 | Automatización WhatsApp Business API | 🟠 ALTA |
| 6 | Backups automáticos (solo manuales) | 🟡 MEDIA |
| 7 | CI/CD pipeline completo | 🟡 MEDIA |
| 8 | Skeleton loaders / estados de carga | 🟡 MEDIA |
| 9 | Documentación de API | 🟢 BAJA |
| 10 | WAF / protección DDoS | 🟢 BAJA |

---

## PARTE 2 — PLAN DE FASES PARA EL AGENTE

El agente debe ejecutar estas fases **en orden estricto**. No pasar a la siguiente hasta terminar la actual.

---

### FASE 0 — SEGURIDAD INMEDIATA (sin esto no se puede continuar)
```
DURACIÓN ESTIMADA: 1-2 horas
OBJETIVO: Proteger el sistema antes de cualquier cambio
```

**Acciones:**
1. Revocar token GitHub actual y generar uno nuevo
2. Revocar Access Token Supabase actual y generar uno nuevo
3. Cambiar contraseñas de correos corporativos
4. Auditar qué archivos del repositorio contienen credenciales hardcodeadas
5. Mover TODAS las credenciales a variables de entorno `.env.local`
6. Verificar que `.gitignore` incluye `.env*`
7. Confirmar que no hay commits anteriores con credenciales expuestas en el historial de Git

**Resultado esperado:** Cero credenciales en código. Tokens nuevos funcionando.

---

### FASE 1 — AUDITORÍA TÉCNICA REAL (leer antes de tocar)
```
DURACIÓN ESTIMADA: 2-3 horas
OBJETIVO: Entender el estado real del código, no asumir
```

**Acciones:**
1. Ejecutar `npm run typecheck` → documentar todos los errores TypeScript
2. Ejecutar `npm run build` → documentar todos los errores de compilación
3. Ejecutar `npm run lint` → documentar advertencias y errores
4. Revisar estructura de carpetas: `apps/web/`, `packages/database/`, `packages/mlm-engine/`, `packages/rbac/`
5. Verificar que `prisma/schema.prisma` es consistente con la base de datos real de Supabase
6. Listar todas las variables de entorno que el sistema necesita vs las que están configuradas
7. Documentar los errores encontrados en un archivo `ERRORES_ENCONTRADOS.md` antes de corregir cualquier cosa

**Resultado esperado:** Lista completa de errores reales. Sin adivinar.

---

### FASE 2 — CORRECCIÓN DE ERRORES CRÍTICOS (solo lo que rompe el sistema)
```
DURACIÓN ESTIMADA: 3-5 horas
OBJETIVO: Sistema compilando sin errores, listo para producción básica
```

**Regla de oro:** Solo corregir lo que está roto. No "mejorar" cosas que funcionan.

**Acciones en orden:**
1. Corregir errores TypeScript detectados en Fase 1 (empezar por los que bloquean el build)
2. Corregir errores de compilación
3. Configurar las variables de entorno faltantes:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `RESEND_API_KEY` (completar)
4. Verificar que Stripe funciona con una transacción de prueba (modo test)
5. Verificar que PayPal funciona con una transacción de prueba
6. Ejecutar `npm run build` de nuevo → debe pasar sin errores
7. Ejecutar la aplicación localmente → verificar que levanta correctamente

**Resultado esperado:** `npm run build` exitoso. Pagos en modo test funcionando.

---

### FASE 3 — DESPLIEGUE CLOUD GRATUITO
```
DURACIÓN ESTIMADA: 2-4 horas
OBJETIVO: Sistema online en URL pública, estable y segura
```

**Stack gratuito recomendado para SaidonClub:**

| Componente | Servicio | Por qué |
|---|---|---|
| Frontend + API Routes | Vercel (free tier) | Compatible nativo con Next.js 14 |
| Base de datos | Supabase (ya configurado) | Ya integrado, PostgreSQL |
| Multimedia / Storage | Supabase Storage (free tier) | Ya integrado |
| Emails | Resend (ya configurado) | Ya en el proyecto |
| Monitoreo de errores | Sentry (free tier) | Fácil integración con Next.js |
| Analytics | Plausible o PostHog (free tier) | Sin cookies, GDPR compliant |
| Uptime monitoring | UptimeRobot (free) | Alertas por email si cae |

**Acciones en orden:**
1. Crear cuenta en Vercel y conectar el repositorio GitHub
2. Configurar todas las variables de entorno en Vercel (Settings → Environment Variables)
3. Configurar dominio (si hay uno) o usar el subdominio gratuito de Vercel
4. Hacer primer deploy y verificar que el build pasa en Vercel
5. Verificar que la aplicación carga correctamente en la URL pública
6. Verificar que Supabase acepta conexiones desde el dominio de Vercel
7. Activar HTTPS (automático en Vercel)
8. Configurar Sentry para monitoreo de errores
9. Configurar UptimeRobot para monitoreo de disponibilidad

**Resultado esperado:** URL pública funcionando con HTTPS. Sistema monitoreado.

---

### FASE 4 — SEO Y RENDIMIENTO BÁSICO
```
DURACIÓN ESTIMADA: 3-4 horas
OBJETIVO: Mejorar posicionamiento y velocidad sin romper nada
```

**Acciones en orden:**
1. Agregar metadatos básicos en `app/layout.tsx`:
   - `title`, `description`, `og:image`, `og:title`, `og:description`
   - Usar el eslogan: "Conecta, consume y gana… en el mismo sistema."
2. Crear `sitemap.xml` dinámico (Next.js lo soporta nativo)
3. Crear `robots.txt` correcto
4. Verificar que las imágenes usan el componente `<Image />` de Next.js
5. Ejecutar Lighthouse en la URL pública → documentar puntuaciones
6. Corregir los problemas de Lighthouse que estén por debajo de 70 puntos
7. Verificar que las páginas públicas cargan en menos de 3 segundos

**Resultado esperado:** Puntuación Lighthouse >70 en Performance y SEO.

---

### FASE 5 — EXPERIENCIA DE USUARIO (UX) Y COPYWRITING
```
DURACIÓN ESTIMADA: 4-6 horas
OBJETIVO: Que la plataforma transmita confianza, no "MLM agresivo"
```

**Acciones en orden:**
1. Revisar todos los textos de la landing page buscando:
   - Promesas exageradas → reemplazar con afirmaciones verificables
   - Tecnicismos → reemplazar con lenguaje simple
   - Tono frío/robótico → reemplazar con tono humano y cercano
2. Revisar mensajes de error del sistema (errores genéricos → mensajes claros)
3. Revisar mensajes de éxito (transacciones, registro, compras)
4. Revisar textos de la sección MLM → deben explicar claramente cómo funciona sin sonar a pirámide
5. Revisar emails transaccionales (registro, bienvenida, compra)
6. Agregar sección de "Cómo funciona" clara y visual en la landing page
7. Agregar indicadores de confianza: dirección física, teléfono, correo oficial
8. Implementar skeleton loaders en las páginas principales mientras cargan datos

**Copywriting base para usar:**
- Eslogan principal: "Conecta, consume y gana… en el mismo sistema."
- Subtítulo: "Impulsado por una economía sostenible desde la comunidad."
- Para sección MLM: "No hay dinero mágico. Hay distribución del margen real del sistema."

**Resultado esperado:** Plataforma que transmite confianza desde la primera visita.

---

### FASE 6 — SISTEMA DE PRUEBAS AUTOMATIZADAS
```
DURACIÓN ESTIMADA: 5-8 horas
OBJETIVO: Que los cambios futuros no rompan lo que funciona
```

**Acciones en orden:**
1. Instalar Vitest + Testing Library: `npm install -D vitest @testing-library/react`
2. Configurar `vitest.config.ts`
3. Escribir pruebas unitarias para las funciones más críticas:
   - Cálculo de comisiones MLM
   - Validación de PIN de seguridad
   - Cálculo de puntos por compra
   - Verificación de roles y permisos
4. Escribir pruebas de integración para los flujos críticos:
   - Registro de usuario → asignación de rol
   - Compra → descuento de saldo → registro en wallet
5. Configurar el pipeline de CI en Vercel/GitHub Actions para que corra las pruebas en cada deploy

**Resultado esperado:** Suite básica de pruebas. Deploy bloqueado si fallan pruebas.

---

### FASE 7 — ANALYTICS Y MONITOREO
```
DURACIÓN ESTIMADA: 2-3 horas
OBJETIVO: Ver qué hacen los usuarios y detectar problemas en producción
```

**Acciones en orden:**
1. Integrar PostHog (free tier): tracking de eventos de usuario
2. Configurar eventos clave: registro, compra, referido generado, retiro
3. Integrar Sentry (si no se hizo en Fase 3): tracking de errores en producción
4. Configurar alertas: si hay más de 5 errores en 10 minutos → email al admin
5. Crear dashboard básico en PostHog con métricas clave:
   - Usuarios nuevos por día
   - Conversión registro → primera compra
   - Métodos de pago más usados

**Resultado esperado:** Visibilidad completa del comportamiento del sistema.

---

### FASE 8 — AUTOMATIZACIÓN Y BACKUPS
```
DURACIÓN ESTIMADA: 3-4 horas
OBJETIVO: Sistema que se cuida solo
```

**Acciones en orden:**
1. Configurar backup automático de base de datos Supabase (habilitarlo en el panel de Supabase)
2. Configurar respaldo semanal exportado a Google Drive o correo del admin
3. Crear CI/CD completo en GitHub Actions:
   - En cada push a `main`: typecheck → lint → tests → build → deploy a Vercel
   - En cada push a `develop`: typecheck → lint → tests → deploy a preview
4. Documentar el proceso de restauración de backups

**Resultado esperado:** Sistema con backups automáticos y despliegue sin intervención manual.

---

### FASE 9 — INTEGRACIÓN WHATSAPP BUSINESS (opcional pero recomendada)
```
DURACIÓN ESTIMADA: 4-6 horas
OBJETIVO: Automatizar onboarding y comunicación con nuevos miembros
```

**Acciones en orden:**
1. Crear cuenta en Meta Business Suite y activar WhatsApp Business API
2. Conectar al número oficial: +593987958337
3. Crear templates de mensaje aprobados por Meta:
   - Bienvenida al registrarse
   - Confirmación de primera compra
   - Notificación de comisión recibida
   - Recordatorio de activación para referidos
4. Integrar el webhook de WhatsApp con el sistema (cuando se registra un usuario → disparar mensaje de bienvenida)
5. Probar el flujo completo con cuenta de prueba

**Resultado esperado:** Onboarding automatizado por WhatsApp.

---

## PARTE 3 — PROMPT OPTIMIZADO PARA AGENTE ANTIGRAVITY

Copia exactamente el siguiente prompt y pégalo en tu agente:

---

```
═══════════════════════════════════════════════════════════
PROMPT MAESTRO — AGENTE ANTIGRAVITY — SAIDONCLUB OS v5.2
═══════════════════════════════════════════════════════════

CONTEXTO DEL SISTEMA:
Eres un agente de ingeniería senior trabajando en SaidonClub, una plataforma 
web de comunidad y marketplace con sistema MLM integrado. El sistema está 
construido con: Next.js 14 (App Router), Supabase (auth + base de datos 
PostgreSQL), Prisma ORM, Turborepo (monorepo), Tailwind CSS, y un motor MLM 
propio (@saidonclub/mlm-engine).

REGLAS DE COMPORTAMIENTO OBLIGATORIAS:
1. NUNCA destruir funcionalidades que ya funcionan.
2. SIEMPRE ejecutar la auditoría antes de tocar cualquier código.
3. SIEMPRE documentar los errores encontrados antes de corregirlos.
4. NUNCA escribir credenciales en archivos de código o logs.
5. SIEMPRE completar una fase antes de pasar a la siguiente.
6. Si encuentras un problema que no sabes cómo resolver sin romper algo, 
   DETENTE y reporta el problema con detalle en lugar de improvisar.
7. NUNCA hardcodear URLs, IDs o claves. Usar siempre variables de entorno.
8. SIEMPRE correr `npm run build` después de cada grupo de cambios para 
   verificar que nada se rompió.

SEGURIDAD — ACCIÓN INMEDIATA OBLIGATORIA:
Antes de cualquier otra acción, debes:
- Verificar que el archivo .gitignore incluye .env, .env.local, .env*.local
- Confirmar que ningún archivo de código fuente contiene claves o contraseñas
- Confirmar que las variables de entorno están solo en .env.local (nunca en 
  archivos committeados)
- Informar si encuentras credenciales expuestas en el código

FASE A EJECUTAR: [INDICA AQUÍ LA FASE: 0, 1, 2, 3, 4, 5, 6, 7, 8 o 9]

OBJETIVO DE ESTA FASE:
[COPIA AQUÍ EL OBJETIVO DE LA FASE DEL PLAN]

ACCIONES REQUERIDAS EN ORDEN:
[COPIA AQUÍ LA LISTA DE ACCIONES DE LA FASE]

RESULTADO ESPERADO AL TERMINAR:
[COPIA AQUÍ EL RESULTADO ESPERADO DE LA FASE]

REPORTAR AL FINALIZAR:
Al terminar esta fase, genera un reporte con el siguiente formato exacto:

---REPORTE DE FASE [NÚMERO]---
✅ Acciones completadas:
- [lista de lo que se hizo]

⚠️ Problemas encontrados:
- [lista de problemas, o "ninguno" si todo fue bien]

❌ Acciones NO completadas:
- [lista de lo que quedó pendiente, con razón]

📊 Estado del build:
- [ ] npm run typecheck → resultado
- [ ] npm run build → resultado

🔜 Recomendación para la siguiente fase:
- [qué hacer primero en la siguiente fase]
---FIN REPORTE---

RESTRICCIONES ADICIONALES PARA ESTE PROYECTO ESPECÍFICO:
- El sistema MLM (@saidonclub/mlm-engine) NO debe modificarse sin una razón 
  técnica específica y documentada. Es el núcleo financiero del sistema.
- El schema de Prisma NO debe modificarse sin verificar impacto en producción.
- Los roles y permisos (RBAC) NO deben alterarse. Son críticos para la 
  seguridad del sistema.
- El sistema de Wallet y transacciones financieras SOLO puede modificarse con 
  pruebas de regresión completas.
- Cualquier cambio en la UI debe mantener el sistema de diseño "Obsidian & 
  Orange" ya implementado.

ARQUITECTURA DEL MONOREPO:
apps/web/              → Frontend Next.js (aquí va la mayoría del trabajo)
packages/database/     → Prisma schema (tocar con mucho cuidado)
packages/mlm-engine/   → Motor MLM (NO tocar sin razón crítica)
packages/rbac/         → Control de acceso (NO tocar sin razón crítica)
packages/config-engine/ → Configuraciones del sistema

COMANDOS ÚTILES:
npm run dev            → Levantar en desarrollo
npm run build          → Compilar para producción
npm run typecheck      → Verificar tipos TypeScript
npm run lint           → Verificar código
npx prisma studio      → Ver base de datos visualmente
npx prisma db push     → Sincronizar schema con Supabase

CRITERIO DE ÉXITO GLOBAL DEL PROYECTO:
El sistema está listo cuando:
1. `npm run build` pasa sin errores
2. La URL pública carga en menos de 3 segundos
3. Los pagos con Stripe funcionan en modo test
4. Un usuario nuevo puede registrarse, comprar y ver sus puntos sin errores
5. Un usuario PIONERO puede ver su red MLM correctamente
6. Puntuación Lighthouse Performance > 70
7. Puntuación Lighthouse SEO > 80
8. Cero credenciales en código fuente

═══════════════════════════════════════════════════════════
```

---

## PARTE 4 — CÓMO USAR ESTE SISTEMA CON TU AGENTE

### Paso a paso para cada sesión:

**1. Empieza siempre por la Fase 0** (seguridad) si no la has hecho.

**2. Para cada sesión de trabajo:**
   - Copia el prompt base de la Parte 3
   - En `FASE A EJECUTAR` escribe el número de la fase
   - Copia el objetivo, acciones y resultado esperado de esa fase desde la Parte 2
   - Pégalo en el agente

**3. El agente entregará un REPORTE al final de cada fase.** Guarda ese reporte.

**4. Antes de la siguiente sesión**, pega el reporte anterior en el contexto del agente para que sepa qué se hizo.

**5. Avanza fase por fase.** No saltes fases aunque parezcan opcionales.

---

## PARTE 5 — ORDEN RECOMENDADO DE EJECUCIÓN

```
Semana 1:  FASE 0 (seguridad) → FASE 1 (auditoría) → FASE 2 (errores críticos)
Semana 2:  FASE 3 (despliegue cloud) → FASE 4 (SEO básico)
Semana 3:  FASE 5 (UX y copywriting) → FASE 6 (pruebas)
Semana 4:  FASE 7 (analytics) → FASE 8 (automatización)
Semana 5+: FASE 9 (WhatsApp) — cuando el resto está estable
```

---

## PARTE 6 — SEÑALES DE ALARMA

Si el agente hace cualquiera de estas cosas, **para la sesión inmediatamente**:

🚨 Modifica el schema de Prisma sin explicar exactamente qué cambia y por qué  
🚨 Borra o reemplaza archivos del motor MLM  
🚨 Cambia la lógica de cálculo de comisiones  
🚨 Modifica los roles del sistema RBAC  
🚨 Escribe credenciales en archivos de código  
🚨 Dice que va a "refactorizar todo" o "reescribir desde cero"  
🚨 No puede hacer `npm run build` exitoso después de sus cambios  

En esos casos: pide explicación detallada antes de continuar.

---

*Plan generado el 2026-05-07 para SaidonClub OS v5.2*
*Adaptado para agente Antigravity con ejecución sin errores*

---

## 📈 ESTADO ACTUAL DEL PROGRESO (Actualizado: 2026-05-07)

| Fase | Estado | Observaciones |
|---|---|---|
| **FASE 0 — Seguridad** | 🟠 EN PROGRESO | .env configurados. Credenciales movidas de código. |
| **FASE 1 — Auditoría** | ✅ COMPLETADO | Errores TypeScript identificados y documentados. |
| **FASE 2 — Corrección** | 🟠 EN PROGRESO | **BUILD Y TYPECHECK ESTABILIZADOS**. Reorganización de `lib/` completada. |
| **FASE 3 — Despliegue** | ⏳ PENDIENTE | Próximo paso tras estabilización final. |

### 🛠️ HITOS TÉCNICOS LOGRADOS
1. **Reorganización de `lib/`**: Se movieron archivos dispersos a estructuras de barril (`@/lib/actions`, `@/lib/data`, `@/lib/utils`) para evitar rutas circulares y archivos huérfanos.
2. **Estabilización de Typescript**: Se corrigieron errores TS2307, TS2305 y TS7006 en todo el `apps/web`.
3. **Build Exitoso**: `pnpm run build` y `pnpm run typecheck` ahora pasan sin errores críticos.
