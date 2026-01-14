import { defineConfig, devices } from '@playwright/test';

/**
 * Playwrightの設定ファイル
 * E2Eテストの実行環境を設定
 */
export default defineConfig({
  testDir: './e2e',
  // テストファイルのパターン
  testMatch: /.*\.e2e\.(ts|tsx)/,
  // 並列実行の設定
  fullyParallel: true,
  // CI環境での失敗時の再試行
  forbidOnly: !!process.env.CI,
  // CI環境でのリトライ
  retries: process.env.CI ? 2 : 0,
  // 並列実行のワーカー数
  workers: process.env.CI ? 1 : undefined,
  // レポーターの設定
  reporter: 'html',
  // 共有設定
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  // プロジェクト設定
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 開発サーバーの設定
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
