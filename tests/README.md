# 🧪 SaidonClub Quality Assurance (QA)
> **Comprehensive Testing & Validation Suite**

## 🌐 Overview
The `tests` directory ensures the reliability and security of SaidonClub. It covers everything from low-level unit tests for the MLM engine to full end-to-end (E2E) browser simulations.

## 🛠️ Testing Layers
- **Unit Tests (Vitest):** Individual function logic (MLM, RBAC).
- **Integration Tests:** Database interactions and API endpoints.
- **E2E Tests (Playwright):** Critical user journeys (Signup, Checkout, Withdrawal).
- **Visual Regression:** Pixel-perfect verification of UI components.

## 🚀 Execution
```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

---
*Verified by SaidonClub Omega Tier.*
