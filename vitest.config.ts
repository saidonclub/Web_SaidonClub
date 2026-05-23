import { defineConfig } from 'vitest/config'
import path from 'path'

// ─────────────────────────────────────────────────────────────────────────────
// NOTA: Los tests de estrés del MLM Engine se excluyen de la suite general
//       porque son lentos y compiten por la misma BD. Se ejecutan por separado
//       con:  pnpm test:stress:vitest
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  /* resolve: {
    // Forzar resolución en modo CJS para evitar problemas con imports nombrados
    // de módulos CJS en contextos ESM estrictos (Node 20+).
    conditions: ['node', 'require', 'default'],
  }, */
  test: {
    environment: 'node',
    globals: true,
    // Excluir el stress test de Vitest — corre con tsx directamente
    include: ['tests/**/*.test.{ts,tsx}', 'packages/**/*.test.{ts,tsx}'],
    exclude: ['tests/stress_standalone.ts', 'tests/e2e/**', 'tests/mlm_stress.test.ts', 'packages/mlm-engine/src/__tests__/stress.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    alias: {
      '@': path.resolve(__dirname, './apps/web'),
      '@saidonclub/database': path.resolve(__dirname, './packages/database/src/index.ts'),
      '@saidonclub/rbac': path.resolve(__dirname, './packages/rbac/src'),
      '@saidonclub/config-engine': path.resolve(__dirname, './packages/config-engine/src'),
      '@saidonclub/types': path.resolve(__dirname, './packages/types/src'),
    },
    // `forks` usa child_process en lugar de worker_threads, compatible con Node 24
    pool: 'forks',
    server: {
      deps: {
        // El cliente generado de Prisma contiene un binario nativo .node
        // que esbuild / Vite no puede transformar.  Marcarlo como externo
        // hace que Node lo cargue directamente con require().
        external: [
          /packages[/\\]database[/\\]src[/\\]generated/,
          /prisma-client-[a-f0-9]+/,
          /@prisma\/client/,
          /\.node$/,
        ],
        interopDefault: true,
        inline: [/@vitest\/expect/],
      },
    },
  },
})