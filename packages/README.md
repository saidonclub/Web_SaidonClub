# 📦 Packages Directory

Shared libraries and modules used across the SaidonClub ecosystem. This structure promotes code reuse and maintainability.

## 📁 Included Packages

- **`@saidonclub/database`**: Prisma schema, migrations, and generated client.
- **`@saidonclub/lib`**: Shared business logic, MLM engine, and core utilities.
- **`@saidonclub/types`**: Unified TypeScript interfaces and Zod schemas.
- **`@saidonclub/ui`**: Shared UI component library following the Obsidian & Safety Orange design system.
- **`@saidonclub/config`**: Shared configuration for ESLint, TypeScript, and Tailwind.

## 🛠️ Usage

To add a package to an app, add it to the `dependencies` in the app's `package.json`:

```json
{
  "dependencies": {
    "@saidonclub/lib": "workspace:*"
  }
}
```

## 🏗️ Standards

1. **Type Safety**: All packages must be 100% TypeScript.
2. **Testing**: Core logic in `lib` must have unit tests.
3. **Documentation**: Use JSDoc for all exported functions and components.

---
*Verified by SaidonClub Engineering.*
