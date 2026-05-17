import { defineConfig } from 'vitest/config';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    pool: 'forks',
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/vitest.setup.ts'],
    include: ['src/__tests__/*.test.ts'],
    testTimeout: 90000,
    hookTimeout: 90000,
    server: {
      deps: {
        external: [
          /prisma-client/,
          /@prisma\/client/,
          /\.node$/,
        ]
      },
    },
  },
});