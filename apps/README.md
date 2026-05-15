# 📂 Apps Directory

This directory contains the main applications of the SaidonClub monorepo.

## 🚀 Applications

- **`web`**: The primary Next.js 15 application. It handles the storefront, user dashboard, provider panel, and administrative interface.
  - **Stack**: Next.js (App Router), React, Tailwind CSS, Supabase SSR.
  - **Path**: `apps/web`

## 🛠️ Development

To run all apps in development mode:

```bash
pnpm dev
```

To build all apps:

```bash
pnpm build
```

## 🏗️ Architecture

All applications follow the **Omega Tier Architecture**:
- **Atomic Components**: Reusable UI elements in `packages/ui`.
- **Business Logic**: Shared utilities and data fetching in `packages/lib`.
- **Type Safety**: Unified types in `packages/types`.

---
*Verified by SaidonClub Engineering.*
