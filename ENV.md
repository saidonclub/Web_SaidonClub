# 🔐 Environment Variables — Omega OS Configuration
> **Critical Infrastructure Configuration for SaidonClub Deployment.**

## 🛡️ Security First
This document describes the environment variables required to run SaidonClub OS. 
**NEVER commit real values to version control.** Always use a secure vault like Vercel Secrets or Supabase Vault in production.

---

## 🛠️ Core Configuration

### Supabase (Database & Auth)
- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous key for client-side interactions.
- `SUPABASE_SERVICE_ROLE_KEY`: **SECRET.** Used for server-side administrative tasks.
- `SUPABASE_DB_URL`: Direct PostgreSQL connection string for Prisma.

### Redis (Performance & MLM)
- `UPSTASH_REDIS_REST_URL`: The REST endpoint for Upstash Redis.
- `UPSTASH_REDIS_REST_TOKEN`: **SECRET.** The authentication token for Redis.

### Payments (Stripe)
- `STRIPE_SECRET_KEY`: **SECRET.** Used for backend payment processing.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Used for client-side Stripe Elements.
- `STRIPE_WEBHOOK_SECRET`: **SECRET.** For verifying Stripe webhook events.

### Security & Integrity
- `PIN_SALT`: **SECRET.** Used for hashing security PINs.
- `JWT_SECRET`: **SECRET.** For secondary token validation.
- `ADMIN_API_KEY`: **SECRET.** Internal key for forensic audit scripts.

---

## 👁️ Omega Observability
- `LOG_LEVEL`: (`debug`, `info`, `warn`, `error`). Default: `info`.
- `ENABLE_FORENSIC_LOGS`: (`true`, `false`). Enables detailed security audit trails.
- `ENVIRONMENT`: (`development`, `staging`, `production`).

---

## 🚀 Local Setup
1.  Copy the example file: `cp .env.example .env`
2.  Fill in the values from your cloud providers.
3.  Restart the dev server: `pnpm dev`.

---

## 🔍 Validation Logic
SaidonClub uses **Zod** to validate environment variables at startup. If any required variable is missing or malformed, the process will exit with a detailed error message to prevent silent failures.

*Managed by Antigravity Infrastructure Engine.*
