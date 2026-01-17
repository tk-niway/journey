# 用語集

このドキュメントは、プロジェクトで使用する用語を定義します。

## ドメイン用語

| 用語     | 英語       | 説明                                       |
| -------- | ---------- | ------------------------------------------ |
| ユーザー | User       | サービスを利用する人                       |
| 認証情報 | Credential | パスワードハッシュなど、認証に使用する情報 |

## 技術用語（このプロジェクトでの意味）

| 用語            | 説明                                                  | 配置場所                                                                                           |
| --------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Page            | ページコンポーネント（ルートに対応）                  | `app/pages/{feature}/Index.tsx`                                                                    |
| Context         | React Context（状態管理）                             | `app/pages/{feature}/contexts/{Feature}Context.tsx` または `app/contexts/{Feature}Context.tsx`     |
| Hook            | カスタムフック（Context の利用を簡素化）              | `app/pages/{feature}/hooks/use{Feature}.ts` または `app/hooks/use{Feature}.ts`                     |
| Provider        | Context Provider コンポーネント                       | Context と同じファイル内に定義                                                                     |
| Component       | 再利用可能な UI コンポーネント                        | `app/components/{category}/{ComponentName}.tsx`                                                    |
| Schema          | Zod によるバリデーションスキーマ                      | `app/lib/validations/{domain}.schema.ts` または `app/pages/{feature}/contexts/{feature}.schema.ts` |
| FormData        | フォームデータの型（Zod スキーマから推論）            | Context ファイル内で定義                                                                           |
| Route           | React Router のルート定義                             | `app/routes.ts`                                                                                    |
| Layout          | ルートレイアウト（認証チェック等）                    | `app/routes/_auth/layout.tsx` または `app/routes/_guest/layout.tsx`                                |
| ApiClient       | Axios インスタンス（API 通信）                        | `app/lib/axios-clients/api-client.ts`                                                              |
| ApiInstance     | Axios インスタンス生成関数                            | `app/lib/axios-clients/api-instance.ts`                                                            |
| AuthInterceptor | 認証トークンを自動付与するインターセプタ              | `app/lib/axios-clients/auth-interceptor.ts`                                                        |
| ErrorHandler    | API エラーを処理する関数                              | `app/lib/error/axios-error-handler.ts`                                                             |
| Storage         | LocalStorage 操作のユーティリティ                     | `app/lib/storage/local-storage.ts`                                                                 |
| Orval           | OpenAPI 仕様から TypeScript 型を生成するツール        | `orval.config.js`                                                                                  |
| GeneratedApi    | Orval で生成された API 型定義                         | `app/generated/web-api/`                                                                           |
| Mutation        | React Query の mutation（POST/PUT/DELETE 等）         | Context 内で `usePostApi{Endpoint}` 等を使用                                                       |
| Query           | React Query の query（GET 等）                        | Context 内で `useGetApi{Endpoint}` 等を使用                                                        |
| SnackBar        | 通知メッセージ表示コンポーネント                      | `app/components/snack-bars/SnackBar.tsx`                                                           |
| ErrorCode       | エラーコード enum（バックエンド・フロントエンド共有） | `shared/error-code.const.ts`                                                                       |

## ディレクトリ用語

| 用語          | 説明                                                               |
| ------------- | ------------------------------------------------------------------ |
| pages 層      | ページ単位の機能（Context + Hook + コンポーネント）                |
| components 層 | 共通 UI コンポーネント                                             |
| contexts 層   | アプリ横断の Context（認証、通知等）                               |
| hooks 層      | アプリ横断の Hook（認証、通知等）                                  |
| lib 層        | 共通ユーティリティ（API 通信、エラー、ストレージ、バリデーション） |
| routes 層     | ルートレイアウト（認証チェック等）                                 |

## 命名規則パターン

| 概念                   | 命名パターン                | 例                                              |
| ---------------------- | --------------------------- | ----------------------------------------------- |
| ページコンポーネント   | {Feature}Page               | `SignupPage`, `SigninPage`                      |
| ページファイル         | Index.tsx                   | `app/pages/signup/Index.tsx`                    |
| Context                | {Feature}Context            | `SignupFormContext`, `AuthContext`              |
| Context Provider       | {Feature}Provider           | `SignupFormProvider`, `AuthProvider`            |
| Hook                   | use{Feature}                | `useSignupForm`, `useAuth`                      |
| コンポーネント         | {ComponentName}             | `BaseButton`, `InputText`, `LoadingScreen`      |
| バリデーションスキーマ | {field}Schema               | `nameSchema`, `emailSchema`, `passwordSchema`   |
| フォームスキーマ       | {feature}FormSchema         | `signupFormSchema`, `signinFormSchema`          |
| フォームデータ型       | {Feature}FormData           | `SignupFormData`, `SigninFormData`              |
| API クライアント       | apiClient                   | `app/lib/axios-clients/api-client.ts`           |
| エラーハンドラー       | {domain}ErrorHandler        | `axiosErrorHandler`                             |
| ストレージキー         | STORAGE_KEYS                | `STORAGE_KEYS.ACCESS_TOKEN`                     |
| 生成された API Hook    | use{Method}Api{Endpoint}    | `usePostApiAuthSignup`, `useGetApiUsersMe`      |
| 生成された API 型      | {Method}Api{Endpoint}{Part} | `PostApiAuthSignupBody`, `PostApiAuthSignup200` |

## ファイル命名パターン

| サフィックス           | 用途                   | 例                           |
| ---------------------- | ---------------------- | ---------------------------- |
| `Index.tsx`            | ページコンポーネント   | `app/pages/signup/Index.tsx` |
| `{Feature}Context.tsx` | Context 定義           | `SignupFormContext.tsx`      |
| `use{Feature}.ts`      | カスタムフック         | `useSignupForm.ts`           |
| `{ComponentName}.tsx`  | UI コンポーネント      | `BaseButton.tsx`             |
| `{domain}.schema.ts`   | バリデーションスキーマ | `auth.schema.ts`             |
| `.test.tsx`            | 単体・結合テスト       | `SignupFormContext.test.tsx` |
| `.e2e.ts`              | E2E テスト             | `signup.e2e.ts`              |

## 重要な命名規則

### ページファイル名

- **必ず `Index.tsx`（大文字の I）を使用する**
- `index.tsx`（小文字の i）は使用不可（React Router の型生成で問題が発生する）

### Context と Hook の命名

- Context: `{Feature}Context`（例: `SignupFormContext`）
- Provider: `{Feature}Provider`（例: `SignupFormProvider`）
- Hook: `use{Feature}`（例: `useSignupForm`）

### コンポーネントの命名

- PascalCase を使用（例: `BaseButton`, `InputText`）
- カテゴリごとにディレクトリを分割（例: `components/buttons/`, `components/inputs/`）

### バリデーションスキーマの命名

- フィールド単位: `{field}Schema`（例: `nameSchema`, `emailSchema`）
- フォーム単位: `{feature}FormSchema`（例: `signupFormSchema`）

## ディレクトリ構造パターン

### ページ構成

```
app/pages/{feature}/
├── Index.tsx                 # ページ本体（必ず大文字の I）
├── contexts/                 # ページ専用 Context
│   └── {Feature}FormContext.tsx
├── hooks/                    # ページ専用 Hook
│   └── use{Feature}Form.ts
└── __tests__/                # ページ関連テスト
    ├── {Feature}FormContext.test.tsx
    └── {feature}.e2e.ts
```

### 共通コンポーネント構成

```
app/components/{category}/
├── {ComponentName}.tsx
└── __tests__/                # オプション
    └── {ComponentName}.test.tsx
```

### 共通ユーティリティ構成

```
app/lib/
├── axios-clients/            # API 通信
│   ├── api-instance.ts
│   ├── auth-interceptor.ts
│   ├── api-base-url.ts
│   └── api-client.ts
├── error/                    # エラーハンドリング
│   └── axios-error-handler.ts
├── storage/                  # ストレージ操作
│   └── local-storage.ts
└── validations/              # バリデーション
    └── {domain}.schema.ts
```
