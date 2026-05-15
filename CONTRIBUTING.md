# 🤝 Contributing to SaidonClub — Engineering Excellence
> **Join us in building the most robust MLM & Marketplace ecosystem on the planet.**

## 🛡️ Our Standards
At SaidonClub, we don't just write code; we architect solutions. Every contribution must adhere to the highest standards of performance, security, and maintainability.

---

## 🛠️ Development Workflow

### 1. Branching Strategy
We follow a modified **Git Flow**:
- `main`: Production-ready code (Protected).
- `staging`: Pre-production testing and integration.
- `feature/*`: New features and improvements.
- `hotfix/*`: Critical production fixes.

### 2. Commit Convention
We use **Conventional Commits**:
- `feat(ui): add glassmorphism to sidebar`
- `fix(mlm): resolve commission rounding error`
- `docs(readme): update tech stack`
- `refactor(auth): consolidate middleware logic`

---

## 📐 Coding Commandments

### TypeScript & Types
- **Strict Mode:** Always enabled. Avoid `any` at all costs.
- **Zod First:** Validate all external data (API, Forms, Env) at the boundary.
- **Shared Types:** Place all common interfaces in `packages/types`.

### Component Design
- **CSS Modules:** Use CSS Modules for styling to ensure scope isolation.
- **Accessibility:** Components must be keyboard accessible and screen-reader friendly.
- **Server First:** Favor Server Components for data fetching; use Client Components only for interactivity.

### Performance
- **Zero CLS:** Always provide dimensions for images and containers.
- **Optimized Assets:** Use the built-in media pipeline (Sharp) for all visual content.
- **Turbo-ready:** Ensure your changes don't break Turborepo caching.

---

## 🛡️ Security Protocol
1.  **RBAC Guards:** Every new route or action must have an appropriate RBAC check.
2.  **No Secrets:** Never commit `.env` files or hardcoded credentials.
3.  **Sanitization:** Always sanitize user input before rendering or database insertion.

---

## 🔍 Pull Request Process
1.  **Lint & Format:** Ensure `pnpm lint` and `pnpm format` pass.
2.  **Visual Audit:** Include screenshots/videos for UI changes.
3.  **Documentation:** Update JSDoc and relevant READMEs if logic changes.
4.  **Review:** Every PR requires at least one approval from a core maintainer.

---

**Thank you for helping us architect the future of SaidonClub.**  
*Maintained by the Antigravity Engineering Core.*
