# AGENTS.md

このファイルはAIコーディングエージェント向けの指示書です。

## 概要

`apps/web` は React Router + Vite を使ったフロントエンドです。
実装時は「ページ単位の機能分割」「Context/Hook による状態管理」「API 通信の共通化」を優先します。

## ディレクトリ構成

```
app/
├── components/    # 共通UIコンポーネント
├── contexts/      # アプリ横断のContext
├── hooks/         # アプリ横断のHook
├── lib/           # API通信・エラー・ストレージ・バリデーション
├── pages/         # ページ単位の機能
├── routes/        # ルートレイアウト
├── css/           # グローバルCSS
├── root.tsx       # ルート構成
└── routes.ts      # ルート定義
```

### pages配下の構成

ページは機能ごとにディレクトリを分割し、関連要素をまとめます。

```
pages/{feature}/
├── Index.tsx                 # ページ本体
├── contexts/                 # ページ専用Context
├── hooks/                    # ページ専用Hook
└── __tests__/                # ページ関連テスト
```

## ルーティング規約

- `Index.tsx` の大文字小文字は厳守（`index.tsx` は不可）。
- ルートレイアウトは `app/routes/` に配置。
- ルート定義は `app/routes.ts` を起点に管理。

## UI実装規約

- 共通UIは `app/components/` に配置し、ページ固有のUIは `pages/{feature}` に閉じ込める。
- コンポーネントは「表示に特化」し、状態・副作用は Hook/Context に移す。
- コンポーネント/Hook はできる限り純粋関数で実装する。

## 状態管理

- アプリ横断: `app/contexts/` + `app/hooks/`
- ページ限定: `pages/{feature}/contexts/` + `pages/{feature}/hooks/`
- Context は Provider と Hook をセットで用意し、利用側の分岐を最小化する。

## API通信

API通信は `app/lib/axios-clients/` を使用します。

- `api-instance.ts`: Axiosインスタンス生成
- `auth-interceptor.ts`: 認証トークンなどの共通処理
- `api-client.ts`: エンドポイント呼び出しの集約
- `api-base-url.ts`: APIベースURLの管理

APIの追加・修正時は `api-client.ts` を起点に実装し、必要に応じてインターセプタや共通ハンドラを拡張します。

## エラーハンドリング

- APIエラーの整形は `app/lib/error/axios-error-handler.ts` に集約する。
- UI側は「ユーザー表示用メッセージ」と「分岐用コード」を分離して扱う。

## バリデーション

- フォームやリクエストの検証は `app/lib/validations/` にまとめる。
- ページ専用のバリデーションは `pages/{feature}` 配下でも可。

## ストレージ

- ローカルストレージ操作は `app/lib/storage/local-storage.ts` に集約する。

## テスト規約

- 単体/結合テスト: `__tests__` 配下（Vitest）
- E2Eテスト: `app/pages/**/__tests__/*.e2e.ts`
- テスト名は日本語で記述。
- テストユーティリティは `__tests__/test-utils.tsx` を利用する。

## 命名・コードスタイル

- ファイル名:
  - Reactコンポーネント: `PascalCase`（例: `Index.tsx`）
  - Hook: `useXxx.ts`
  - Context: `XxxContext.tsx`
- コメント: 日本語
- セミコロンあり、シングルクォート、インデント2スペース
- `prettier` に準拠
