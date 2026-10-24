import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  // The empty prefix loads every variable, not only the `VITE_` ones that are
  // exposed to the browser bundle. They are read here and never shipped.
  const env = loadEnv(mode, import.meta.dirname, '');

  return {
    plugins: [react()],
    server: {
      // Forward API calls to the backend in development, so the browser sees a
      // single origin and no CORS setup is needed.
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET ?? 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/test/setup.ts'],
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        // `main.tsx` only mounts the app into the real DOM: it is exercised by
        // the Playwright e2e tests, which v8 coverage cannot measure.
        exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  };
});
