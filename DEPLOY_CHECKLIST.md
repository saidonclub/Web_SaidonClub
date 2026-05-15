# CHECKLIST DE DESPLIEGUE — SAIDONCLUB EN VERCEL

## PRERREQUISITOS

### 1. GitHub
- [ ] Crear nuevo GitHub token en Settings → Developer settings → Personal access tokens
- [ ] Eliminar token antiguo expuesto
- [ ] Hacer push de la rama `rescue-stabilization` a GitHub

### 2. Vercel
- [ ] Crear cuenta en vercel.com (gratuita)
- [ ] Instalar Vercel CLI: `pnpm add -g vercel`
- [ ] Desde proyecto: `vercel link` (enlazar con GitHub)
- [ ] Configurar variables de entorno en Vercel Dashboard:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
  STRIPE_SECRET_KEY=
  STRIPE_WEBHOOK_SECRET=
  ```
- [ ] Ejecutar `vercel --prod` para primer deploy

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
