import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': fromRoot('./src'),
      // `server-only` throws outside the React server condition; tests import server modules directly.
      'server-only': fromRoot('./test/server-only-stub.ts'),
    },
  },
  test: {
    // Fast default; component tests opt into jsdom with a `@vitest-environment jsdom` docblock.
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
