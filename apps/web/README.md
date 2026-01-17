# Journey Web

React Router + Vite を使用したフロントエンドアプリケーション。

## 技術スタック

| カテゴリ             | 技術                        |
| -------------------- | --------------------------- |
| フレームワーク       | React Router v7             |
| ビルドツール         | Vite                        |
| 状態管理             | React Context + React Query |
| フォーム管理         | React Hook Form + Zod       |
| HTTP クライアント    | Axios                       |
| API 型生成           | Orval                       |
| テスト               | Vitest + Playwright         |
| スタイリング         | Tailwind CSS                |
| 言語                 | TypeScript                  |
| パッケージマネージャ | pnpm                        |

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

必要に応じて環境変数を設定してください。

```bash
# .env ファイルを作成（例）
VITE_API_BASE_URL=http://localhost:3000
```

### 3. 開発サーバーの起動

```bash
pnpm dev
```

サーバーが起動したら、ブラウザで確認：

- アプリケーション: http://localhost:5173

## コマンド一覧

### 開発

| コマンド     | 説明                           |
| ------------ | ------------------------------ |
| `pnpm dev`   | 開発サーバー起動（hot reload） |
| `pnpm build` | プロダクションビルド           |
| `pnpm start` | ビルド後のサーバー起動         |

### テスト

| コマンド             | 説明                 |
| -------------------- | -------------------- |
| `pnpm test`          | テスト実行           |
| `pnpm test:ui`       | テスト UI モード     |
| `pnpm test:coverage` | カバレッジ付きテスト |
| `pnpm test:e2e`      | E2E テスト実行       |
| `pnpm test:e2e:ui`   | E2E テスト UI モード |
| `pnpm test:all`      | 全テスト実行         |

### コード品質

| コマンド            | 説明                 |
| ------------------- | -------------------- |
| `pnpm format:check` | フォーマットチェック |
| `pnpm format:fix`   | フォーマット自動修正 |
| `pnpm lint:check`   | Lint チェック        |
| `pnpm lint:fix`     | Lint 自動修正        |
| `pnpm typecheck`    | 型チェック           |
| `pnpm check:all`    | 全チェック実行       |

### その他

| コマンド     | 説明                     |
| ------------ | ------------------------ |
| `pnpm orval` | OpenAPI 仕様から型を生成 |

## ドキュメント

AI エージェント・開発者向けのドキュメント：

| ファイル                | 説明                       |
| ----------------------- | -------------------------- |
| `AGENTS.md`             | アーキテクチャ・規約の概要 |
| `docs/PROJECT_RULES.md` | 技術詳細・実装例           |
| `docs/WORKFLOWS.md`     | よくある作業パターン       |
| `docs/GLOSSARY.md`      | 用語集                     |
