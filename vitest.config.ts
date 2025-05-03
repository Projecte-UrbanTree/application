// vitest.config.ts
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'resources/ts/**/*.{test,spec}.{ts,tsx}',
      'src/**/*.{test,spec}.{ts,tsx}',
      '*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      'node_modules',
      'dist',
      'cypress',
      '.{idea,git,cache,temp}',
      '*.{config}.{js,ts}',
    ],
  },
});
