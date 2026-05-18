# 🚀 SaidonClub Omega OS v5.4.0 — The God-Tier Ecosystem
> **The ultimate enterprise-grade infrastructure for global Marketplaces, hyper-scalable MLM engines, and premium Service Hubs.**

[![System Status](https://img.shields.io/badge/System-Operational-00ff00?style=for-the-badge&logo=statuspage)](https://saidonclub.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-SSR_Ready-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-Proprietary-orange?style=for-the-badge)](LICENSE)

---

## 💎 The Vision
**SaidonClub Omega OS** is not just a web application; it is a disruptive financial ecosystem. It fuses a high-performance **Global Marketplace**, a mathematically optimized **MLM Engine**, and a **Professional Service Hub** into a single, cohesive, and ultra-premium platform. 

Designed with the **Obsidian & Safety Orange** aesthetic, it delivers a psychological experience of power, security, and exclusivity.

### 🌟 Core Pillars
*   **🛒 Hyper-Marketplace:** Integrated dropshipping logic with real-time stock and multi-currency support.
*   **⛓️ Cascade MLM:** 8-level deep commission engine with automatic rank upgrades and liquid distribution.
*   **🛠️ Service Nexus:** A geolocation-aware network for verified professional services.
*   **👁️ Omega Observability:** Forensic logging, Zod-powered env hardening, and real-time security alerts.
*   **🛡️ Ironclad Security:** 12-level RBAC hierarchy, PIN-secured withdrawals, and KYC verification.

---

## 🏗️ Architectural Excellence
Built on a high-performance **Monorepo** powered by **Turborepo**, ensuring maximum code reuse and lightning-fast CI/CD.

### 📂 Directory Map
```text
.
├── apps/
│   └── web/                # Core Next.js 15 Application (App Router + Server Actions)
├── packages/
│   ├── analytics/          # BI & Performance Tracking engine
│   ├── config-engine/      # Dynamic system configuration manager
│   ├── database/           # Prisma Schema, Migraciones, and Seed logic
│   ├── media-engine/       # Ultra-optimized Media Pipeline (Sharp + FFmpeg)
│   ├── mlm-engine/         # Financial core: Commissions, Genealogy & Ranks
│   ├── rbac/               # Granular Role-Based Access Control logic
│   └── ui-kit/             # Premium Glassmorphism Component Library
├── scripts/                # DevOps & Forensic Audit automation
└── supabase/               # Cloud Infrastructure & Edge Functions
```

---

## 🛠️ Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 19 (RC), Next.js 15, Framer Motion |
| **Styling** | Vanilla CSS Modules (Themed via CSS Variables) |
| **Data Orchestration** | Prisma ORM + PostgreSQL (Supabase) |
| **State & Cache** | Upstash Redis + React Context (SSR Optimized) |
| **Forensics** | Omega Structured Logger (JSON) |
| **Validation** | Zod (End-to-end type safety) |

---

## 🚀 Rapid Deployment

### Prerequisites
- **Node.js** 20.x or 22.x
- **pnpm** 9.x
- **Turbo** CLI

### Setup
```bash
# 1. Clone & Initialize
git clone https://github.com/saidonclub/saidonclub-os.git
cd saidonclub-os && pnpm install

# 2. Environment Hardening
cp .env.example .env
# Fill out the credentials for Supabase, Redis, and Stripe

# 3. Database Sync
pnpm db:generate
pnpm db:migrate

# 4. Launch Ignition
pnpm dev
```

---

## 🛡️ Observability & Security (Forensic Tier)
SaidonClub uses the **Omega OS Logger**, producing structured JSON logs ready for enterprise-level ingestion (Sentry, Datadog). 
Our **Security Forensic System** tracks every sensitive interaction (`ADMIN_ACCESS`, `WALLET_WITHDRAWAL`, `KYC_SUBMISSION`) and sends instant notifications via high-priority webhooks.

---

## 📜 Repository Intelligence
- [ROADMAP.md](./ROADMAP.md) — Strategic vision and upcoming milestones.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Deep technical blueprints.
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) — Obsidian & Orange design system.
- [CHECKLIST.md](./CHECKLIST.md) — Pre-production validation checklist.
- [SEO_AUDIT.md](./SEO_AUDIT.md) — Search engine optimization strategy.
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Engineering standards and Git flow.

---

**© 2026 SaidonClub. All Rights Reserved. Proprietary Property of SaidonClub.**  
*Engineered to perfection by Antigravity AI Engine.*
