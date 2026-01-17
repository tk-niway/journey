import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { z } from 'zod';

// 環境変数のスキーマ定義
const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .url('VITE_API_BASE_URLは有効なURLである必要があります'),
});

// 環境変数検証プラグイン
function validateEnv(mode: string): Plugin {
  return {
    name: 'validate-env',
    config() {
      // 開発時・ビルド時の両方で検証
      const env = loadEnv(mode, process.cwd(), '');

      try {
        envSchema.parse(env);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessages = error.issues
            .map((issue) => {
              const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
              return `  - ${path}: ${issue.message}`;
            })
            .join('\n');

          throw new Error(
            `環境変数の検証に失敗しました:\n${errorMessages}\n\n` +
              `必要な環境変数を設定してください。`
          );
        }
        // ZodError以外のエラーも適切に処理
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `環境変数の検証中にエラーが発生しました: ${errorMessage}`
        );
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    validateEnv(mode), // 環境変数検証プラグインを追加
  ],
}));
