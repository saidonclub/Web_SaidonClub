# CHECKLIST DE DESPLIEGUE — SAIDONCLUB EN VERCEL

## PRERREQUISITOS

### 1. GitHub
- [ ] Crear nuevo GitHub token en Settings → Developer settings → Personal access tokens
- [ ] Eliminar token antiguo expuesto (REQUERIDO: Acción Manual del Usuario)
- [x] Sincronizar código local (Commit realizado: `🚀 SaidonClub OS v5.4.0 - Deployment Ready`)
- [ ] Hacer push a GitHub (Pendiente: Error 403 - Requiere nuevo Token)

### 2. Vercel
- [x] Crear cuenta en vercel.com
- [x] Instalar Vercel CLI
- [x] Desde proyecto: `vercel link`
- [x] Configurar variables de entorno en Vercel Dashboard (Sincronizadas automáticamente desde .env local)
- [x] Ejecutar `vercel --prod` para primer deploy (En proceso...)

### 3. Supabase (Producción)
- [ ] Crear proyecto en supabase.com (gratuito)
- [ ] Ejecutar migraciones: `pnpm db:migrate`
- [ ] Copiar API URL y anon key a Vercel

### 4. Stripe
- [ ] Crear cuenta en stripe.com
- [ ] Obtener API keys del dashboard
- [ ] Configurar webhook endpoints

### 5. Post-Deploy
- [ ] Verificar dominio personalizado (opcional)
- [ ] Verificar SSL (automático con Vercel)
- [ ] Testear flujo completo de registro
- [ ] Testear flujo de compra
- [ ] Verificar SEO en Google Search Console
- [ ] Monitorear errores con Vercel Analytics
