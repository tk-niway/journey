# AGENTS.md

このファイルはAIコーディングエージェント向けの指示書です。

## プロジェクト概要

Journey - Turborepo を使用したモノレポ構成のフルスタックアプリケーション。

## 構成

```
/
├── apps/
│   ├── api/    # バックエンド: REST API（Hono + Drizzle ORM）
│   │   └── README.md  # APIのセットアップ詳細
│   └── web/    # フロントエンド: Webアプリ（React Router）
│       └── README.md  # Webのセットアップ詳細
├── shared/     # 共有リソース（OpenAPI仕様等）
└── docs/       # プロジェクトドキュメント
```

### アプリケーション対応表

| 名称           | ディレクトリ | 説明                 |
| -------------- | ------------ | -------------------- |
| バックエンド   | `apps/api`   | REST API サーバー    |
| フロントエンド | `apps/web`   | Web アプリケーション |

## 作業対象の判断

作業を始める前に、対象のアプリケーションを特定してください：

| 作業内容                    | 対象                         | 参照ドキュメント     |
| --------------------------- | ---------------------------- | -------------------- |
| APIエンドポイント追加・修正 | `apps/api`（バックエンド）   | `apps/api/AGENTS.md` |
| バックエンドロジック        | `apps/api`（バックエンド）   | `apps/api/AGENTS.md` |
| DB操作・マイグレーション    | `apps/api`（バックエンド）   | `apps/api/AGENTS.md` |
| フロントエンドUI            | `apps/web`（フロントエンド） | `apps/web/AGENTS.md` |
| API型定義の生成             | 両方                         | 下記参照             |

## 技術スタック

| アプリ     | 役割           | 技術                           |
| ---------- | -------------- | ------------------------------ |
| `apps/api` | バックエンド   | Hono, Drizzle ORM, Zod, Vitest |
| `apps/web` | フロントエンド | React Router, Vite             |
| 共通       | -              | TypeScript, pnpm, Turborepo    |

## 前提

- Node.js `>=24.7.0`
- pnpm `9.0.0`

## モノレポ操作

### 全体操作

```bash
# 依存関係インストール（ルートで実行）
pnpm install

# 全アプリの開発サーバー起動
pnpm dev

# 全アプリのビルド
pnpm build

# 全アプリのLint
pnpm lint
```

### セットアップの参照先

詳細なセットアップ手順（環境変数、DB、型生成など）は各アプリのREADMEを参照してください。

- `apps/api/README.md`
- `apps/web/README.md`

### 特定アプリの操作

```bash
# APIのみ開発サーバー
pnpm --filter api dev

# Webのみ開発サーバー
pnpm --filter web dev

# APIのテスト
pnpm --filter api test
```

### Turboを使った操作

```bash
# 特定アプリのビルド
turbo build --filter=api

# 特定アプリの開発
turbo dev --filter=web
```

## API型定義の連携

OpenAPI仕様書からフロントエンド用の型を生成：

1. `apps/api` で OpenAPI仕様書を更新
2. `shared/openapi.yml` に出力
3. `apps/web` で型生成コマンドを実行

モノレポのルートから実行する場合の例：

```bash
pnpm --filter api gen:openapi
pnpm --filter web orval
```

## 各アプリの詳細ドキュメント

作業対象のアプリケーションに移動して、詳細なドキュメントを参照してください：

- **バックエンド（API）**: `apps/api/AGENTS.md`
- **フロントエンド（Web）**: `apps/web/AGENTS.md`
