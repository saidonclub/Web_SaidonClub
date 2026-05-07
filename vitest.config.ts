import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', '**/*.d.ts']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web'),
      '@saidonclub/database': path.resolve(__dirname, './packages/database'),
      '@saidonclub/rbac': path.resolve(__dirname, './packages/rbac'),
      '@saidonclub/config-engine': path.resolve(__dirname, './packages/config-engine'),
      '@saidonclub/types': path.resolve(__dirname, './packages/types')
    }
  }
})