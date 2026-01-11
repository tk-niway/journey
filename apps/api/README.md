# Journey API

Hono + Drizzle ORM を使用した REST API サーバー。

## 技術スタック

| カテゴリ             | 技術                     |
| -------------------- | ------------------------ |
| フレームワーク       | Hono + @hono/zod-openapi |
| ORM                  | Drizzle ORM (SQLite)     |
| バリデーション       | Zod                      |
| テスト               | Vitest                   |
| 言語                 | TypeScript               |
| パッケージマネージャ | pnpm                     |

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

```bash
cp env.example .env
```

### 3. データベースのセットアップ

```bash
pnpm db:migrate
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

サーバーが起動したら、ブラウザで確認：

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/ui

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
| `pnpm test:watch`    | テスト監視モード     |
| `pnpm test:coverage` | カバレッジ付きテスト |

### データベース

| コマンド           | 説明                         |
| ------------------ | ---------------------------- |
| `pnpm db:generate` | マイグレーションファイル生成 |
| `pnpm db:migrate`  | マイグレーション適用         |
| `pnpm db:push`     | スキーマをDBに直接反映       |

### コード品質

| コマンド            | 説明                 |
| ------------------- | -------------------- |
| `pnpm format:check` | フォーマットチェック |
| `pnpm format:fix`   | フォーマット自動修正 |
| `pnpm lint:check`   | Lintチェック         |
| `pnpm lint:fix`     | Lint自動修正         |
| `pnpm type:check`   | 型チェック           |
| `pnpm check:all`    | 全チェック実行       |

### その他

| コマンド           | 説明              |
| ------------------ | ----------------- |
| `pnpm gen:openapi` | OpenAPI仕様書生成 |

## ドキュメント

AIエージェント・開発者向けのドキュメント：

| ファイル                | 説明                       |
| ----------------------- | -------------------------- |
| `AGENTS.md`             | アーキテクチャ・規約の概要 |
| `docs/PROJECT_RULES.md` | 技術詳細・実装例           |
| `docs/WORKFLOWS.md`     | よくある作業パターン       |
| `docs/GLOSSARY.md`      | 用語集                     |
