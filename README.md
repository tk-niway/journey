# Journey

Turborepo を使用したモノレポ構成のフルスタックアプリケーション。

## 構成

| パッケージ | 役割           | 説明                 | 技術                   |
| ---------- | -------------- | -------------------- | ---------------------- |
| `apps/api` | バックエンド   | REST API サーバー    | Hono, Drizzle ORM, Zod |
| `apps/web` | フロントエンド | Web アプリケーション | React Router, Vite     |
| `shared/`  | 共有           | 共有リソース         | OpenAPI仕様書          |

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

```bash
cp apps/api/env.example apps/api/.env
```

### 3. データベースのセットアップ

```bash
pnpm --filter api db:migrate
```

### 4. 開発サーバーの起動

```bash
# 全アプリを起動
pnpm dev

# または個別に起動
pnpm --filter api dev   # API: http://localhost:3000
pnpm --filter web dev   # Web: http://localhost:5173
```

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
│   │   └── AGENTS.md  # AI向けドキュメント
│   └── web/           # Webフロントエンド
│       └── app/
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
