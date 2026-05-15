# 🏛️ SaidonClub Architecture — Omega OS Blueprint
> **The Engineering behind the Global MLM & Marketplace Revolution.**

## 📐 Design Philosophy
SaidonClub OS is built on the principles of **Domain-Driven Design (DDD)**, **Monorepo Efficiency**, and **Forensic Observability**. Every architectural decision is made to ensure that the system can scale from 1,000 to 1,000,000 users without architectural regression.

---

## 🗺️ Data & Logic Flow

```mermaid
graph TD
    User((User Interface)) --> NextJS[Next.js 15 App Router]
    NextJS --> Middleware{Auth & RBAC Middleware}
    
    Middleware -- Authorized --> ServerActions[Secure Server Actions]
    Middleware -- Denied --> Login[Auth Portal]
    
    ServerActions --> Zod{Zod Validation}
    Zod -- Valid --> BusinessLogic[Domain Logic Layer]
    
    subgraph Core Engines
        BusinessLogic --> MLMEngine[MLM Commission Core]
        BusinessLogic --> MediaEngine[Image/Video Pipeline]
        BusinessLogic --> Analytics[BI & Tracking Engine]
    end
    
    subgraph Data Layer
        MLMEngine --> Redis[(Upstash Redis Cache)]
        BusinessLogic --> Prisma[Prisma ORM]
        Prisma --> PostgreSQL[(Supabase PostgreSQL)]
    end
    
    subgraph Forensics
        BusinessLogic --> OmegaLogger[Structured JSON Logger]
        OmegaLogger --> AuditTrail[(Security Forensic Log)]
    end
```

---

## 🛡️ RBAC Hierarchy (12-Level)

```mermaid
graph BT
    GUEST[0: GUEST] --> USER_BASIC[1: USER_BASIC]
    USER_BASIC --> USER_VERIFIED[2: USER_VERIFIED]
    USER_VERIFIED --> PROVIDER_BASIC[3: PROVIDER_BASIC]
    PROVIDER_BASIC --> PROVIDER_VERIFIED[4: PROVIDER_VERIFIED]
    PROVIDER_VERIFIED --> AGENT_FIELD[5: AGENT_FIELD]
    AGENT_FIELD --> AGENT_REGIONAL[6: AGENT_REGIONAL]
    AGENT_REGIONAL --> MODERATOR[7: MODERATOR]
    MODERATOR --> AUDITOR_FINANCIAL[8: AUDITOR_FINANCIAL]
    AUDITOR_FINANCIAL --> ADMIN_OPS[9: ADMIN_OPS]
    ADMIN_OPS --> ADMIN_STRATEGIC[10: ADMIN_STRATEGIC]
    ADMIN_STRATEGIC --> SYSTEM_GOD[11: SYSTEM_GOD]
    SYSTEM_GOD --> SYSTEM_OWNER[12: SYSTEM_OWNER]
```

---

## ⛓️ MLM Commission Cascade (8-Level)

```mermaid
sequenceDiagram
    participant S as Sale Transaction
    participant E as MLM Engine
    participant L1 as Level 1 Sponsor
    participant L2 as Level 2 Sponsor
    participant L8 as Level 8 Sponsor
    participant F as Financial Audit

    S->>E: Trigger Commission Event
    E->>E: Fetch Genealogy
    E->>L1: Calculate & Allocate %
    E->>L2: Calculate & Allocate %
    Note over E, L8: ... Recursive Calculation ...
    E->>L8: Calculate & Allocate %
    E->>F: Log Transaction Forensic Hash
```

---

## 🧩 Monorepo Modules

### 1. Unified Web App (`apps/web`)
The heartbeat of the system.
- **Next.js 15:** Utilizing Server Components for heavy data fetching and Client Components for interactive dashboards.
- **Server Actions:** Secure, type-safe endpoints for all mutations.
- **Shared State:** Optimized React Contexts for UI, Auth, and Marketplace state.

### 2. MLM Financial Engine (`packages/mlm-engine`)
The core mathematical brain.
- **Cascade Algorithm:** Calculates 8 levels of commissions in O(n) time.
- **Genealogy Management:** High-performance tree traversal for network visualization.
- **Rank Evaluation:** Event-driven rank upgrades triggered by volume milestones.

### 3. Security & RBAC (`packages/rbac`)
Ironclad access control.
- **12-Level Hierarchy:** From `GUEST` to `SYSTEM_OWNER`.
- **Permission-Based:** Access is granted via specific permission keys, allowing for highly granular control.

### 4. Database Core (`packages/database`)
The source of truth.
- **Prisma Schema:** Centralized type definitions and migrations.
- **Seed System:** Deterministic data seeding for staging and testing environments.

### 5. Media Pipeline (`packages/media-engine`)
- **Sharp Optimization:** Automatic WebP/AVIF conversion.
- **Cloud Storage:** Secure integration with Supabase Storage buckets.

---

## 🛡️ Forensic Security Protocol
1.  **Strict Runtime Validation:** Zod ensures no malformed data reaches the database.
2.  **Omega Structured Logging:** Every mutation is logged with its context, user ID, and timestamp in a searchable JSON format.
3.  **RBAC Guards:** Every Server Action is wrapped in a `withRole` or `withPermission` higher-order function.
4.  **Transaction Integrity:** All financial operations (Wallet, Commissions) use ACID transactions to prevent data inconsistency.

---

## 🚀 Deployment Infrastructure
- **Hosting:** Vercel (Next.js Edge Runtime).
- **Backend-as-a-Service:** Supabase (Auth, DB, Storage).
- **In-Memory Store:** Upstash Redis (Rate limiting & MLM Caching).
- **DNS & CDN:** Cloudflare (WAF & DDoS Protection).

---

*Architectural Blueprint v5.4.0 — Engineered by Antigravity AI.*