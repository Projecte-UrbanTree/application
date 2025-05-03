import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/ts'),
      '@resources': path.resolve(__dirname, 'resources'),
      '@images': path.resolve(__dirname, 'resources/images'),
      '@components': path.resolve(__dirname, 'resources/ts/components'),
      '@utils': path.resolve(__dirname, 'resources/ts/utils'),
    },
  },
  test: {
    globals: true,
    setupFiles: 'vitest.setup.ts',
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
