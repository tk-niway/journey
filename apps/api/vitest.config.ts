import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.schema.ts', 'src/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, './src/lib'),
      '@consts': path.resolve(__dirname, './src/lib/consts'),
      '@db': path.resolve(__dirname, './src/db'),
      '@domains': path.resolve(__dirname, './src/domains'),
      '@api': path.resolve(__dirname, './src/api'),
      '@applications': path.resolve(__dirname, './src/applications'),
    },
  },
});
