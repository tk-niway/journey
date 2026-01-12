import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'src/**/*.e2e.ts'],
    env: {
      NODE_ENV: 'test',
      DB_FILE_NAME: ':memory:',
      AUTH_SECRET: 'test-secret',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.schema.ts', 'src/index.ts'],
    },
    isolate: false,
    maxWorkers: 1,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@consts': path.resolve(__dirname, './src/lib/consts'),
      '@db': path.resolve(__dirname, './src/db'),
      '@domains': path.resolve(__dirname, './src/domains'),
      '@api': path.resolve(__dirname, './src/api'),
      '@applications': path.resolve(__dirname, './src/applications'),
    },
  },
});
