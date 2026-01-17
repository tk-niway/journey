# Journey

Turborepo を使用したモノレポ構成のフルスタックアプリケーション。

## 構成

| パッケージ | 役割           | 説明                 | 技術                   |
| ---------- | -------------- | -------------------- | ---------------------- |
| `apps/api` | バックエンド   | REST API サーバー    | Hono, Drizzle ORM, Zod |
| `apps/web` | フロントエンド | Web アプリケーション | React Router, Vite     |
| `shared/`  | 共有           | 共有リソース         | OpenAPI仕様書          |

## セットアップ（概要）

### 前提

- Node.js `>=24.7.0`
- pnpm `9.0.0`

1. 依存関係のインストール

```bash
pnpm install
```

2. 各アプリのセットアップ（詳細は各READMEを参照）

- バックエンド: `apps/api/README.md`
- フロントエンド: `apps/web/README.md`

3. 開発サーバーの起動（モノレポ全体）

```bash
pnpm dev
```

起動後の確認先:

- API: http://localhost:3000
- Web: http://localhost:5173

## コマンド

### 開発

| コマンド     | 説明                       |
| ------------ | -------------------------- |
| `pnpm dev`   | 全アプリの開発サーバー起動 |
| `pnpm build` | 全アプリのビルド           |
| `pnpm lint`  | 全アプリのLint             |

### 特定アプリの操作

```bash
# APIのコマンド
pnpm --filter api dev
pnpm --filter api test
pnpm --filter api db:migrate

# Webのコマンド
pnpm --filter web dev
pnpm --filter web build
```

### Turboを使った操作

```bash
turbo dev --filter=api
turbo build --filter=web
```

## ディレクトリ構造

```
/
├── apps/
│   ├── api/           # REST API
│   │   ├── src/
│   │   ├── drizzle/   # マイグレーションファイル
│   │   └── README.md  # APIのセットアップ詳細
│   └── web/           # Webフロントエンド
│       ├── app/
│       └── README.md  # Webのセットアップ詳細
├── shared/
│   └── openapi.yml    # OpenAPI仕様書
├── turbo.json         # Turborepo設定
└── pnpm-workspace.yaml
```

## ドキュメント

| ファイル             | 説明                       |
| -------------------- | -------------------------- |
| `AGENTS.md`          | AIエージェント向け全体概要 |
| `apps/api/AGENTS.md` | API開発の詳細規約          |
| `apps/api/docs/`     | APIの詳細ドキュメント      |
