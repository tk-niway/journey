# Journey Web プロジェクト固有ルール

このドキュメントは AGENTS.md の概念をこのプロジェクトに適用した具体例です。

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

## コマンド

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 型チェック
pnpm typecheck

# リント
pnpm lint:check
pnpm lint:fix

# フォーマット
pnpm format:check
pnpm format:fix

# テスト
pnpm test              # Vitest（単体・結合テスト）
pnpm test:ui           # Vitest UI
pnpm test:coverage    # カバレッジ付きテスト
pnpm test:e2e         # Playwright（E2Eテスト）
pnpm test:e2e:ui      # Playwright UI
pnpm test:all         # 全テスト実行

# 一括チェック
pnpm check:all        # format:check + lint:check + typecheck

# API型生成
pnpm orval            # OpenAPI仕様から型を生成
```

## パスエイリアス

tsconfig.jsonで定義済み：

```typescript
import { Something } from '@app/...'; // app/ 配下
import { Something } from '@shared/...'; // shared/ 配下
import { Something } from '@public/...'; // public/ 配下
import { Something } from '@__tests__/...'; // __tests__/ 配下
```

## コーディングルール

- 汎用的に使えるコンポーネントは `app/components` に配置する
- `app/components` のコンポーネントはUIの記述に専念し、ロジックは原則引数で受け取る
- `app/pages` 配下のページコンポーネントは専用Contextで状態を保持し、Hookでロジックを記述する
- `pages/{feature}` は `Index.tsx` / `contexts` / `hooks` / `__tests__` を基本構成とする
- ページファイル名は必ず `Index.tsx`（大文字のI）にする
- Context/Provider/Hook/Component の命名は用語集の規約に合わせる
- ルート定義は `app/routes.ts`、レイアウトは `app/routes/_auth` と `app/routes/_guest` に配置する
- API通信/エラーハンドリング/バリデーション/ストレージは `app/lib` 配下に集約する
- テストは `__tests__` 配下に置き、E2Eは `.e2e.ts`、テスト名は日本語で記述する

## 具体的な実装例

### ページコンポーネント

ページは機能ごとにディレクトリを分割し、関連ファイルをまとめる：

```typescript
// app/pages/{feature}/Index.tsx
import { SignupFormProvider } from './contexts/SignupFormContext';
import { useSignupForm } from './hooks/useSignupForm';

export function meta() {
  return [
    { title: 'サインアップ - Journey' },
    { name: 'description', content: '新しいアカウントを作成して始めましょう' },
  ];
}

function SignupForm() {
  const { form, signupMutation, onSubmit } = useSignupForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <CenteredLayout>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* フォーム内容 */}
      </form>
    </CenteredLayout>
  );
}

export default function SignupPage() {
  return (
    <SignupFormProvider>
      <SignupForm />
    </SignupFormProvider>
  );
}
```

### Context と Hook

ページ専用の状態管理は Context + Hook パターンを使用：

```typescript
// app/pages/{feature}/contexts/{Feature}FormContext.tsx
import { createContext, useCallback } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { usePostApiAuthSignup } from '@app/generated/web-api/default/default';
import { useSnackBar } from '@app/hooks/useSnackBar';
import {
  axiosErrorHandler,
  setFormValidationErrors,
} from '@app/lib/error/axios-error-handler';
import { signupFormSchema } from './{feature}.schema';
import z from 'zod';

export const signupFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type SignupFormData = z.infer<typeof signupFormSchema>;

interface SignupFormContextValue {
  form: UseFormReturn<SignupFormData>;
  signupMutation: ReturnType<typeof usePostApiAuthSignup>;
  onSubmit: (data: SignupFormData) => void;
}

export const SignupFormContext = createContext<SignupFormContextValue | null>(
  null
);

export function SignupFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { setError } = form;

  const signupMutation = usePostApiAuthSignup({
    mutation: {
      onSuccess: (response) => {
        showSnackBar('アカウントを作成しました', 'success');
        navigate('/');
      },
      onError: (error: AxiosError) => {
        const { message, validationErrors } = axiosErrorHandler(error);
        setFormValidationErrors(validationErrors, setError, [
          'name',
          'email',
          'password',
        ] as const);
        showSnackBar(message, 'error');
      },
    },
  });

  const onSubmit = useCallback(
    (data: SignupFormData) => {
      const signupData: PostApiAuthSignupBody = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      signupMutation.mutate({ data: signupData });
    },
    [signupMutation]
  );

  const value: SignupFormContextValue = {
    form,
    signupMutation,
    onSubmit,
  };

  return (
    <SignupFormContext.Provider value={value}>
      {children}
    </SignupFormContext.Provider>
  );
}
```

```typescript
// app/pages/{feature}/hooks/use{Feature}Form.ts
import { useContext } from 'react';
import { SignupFormContext } from '../contexts/SignupFormContext';

export function useSignupForm() {
  const context = useContext(SignupFormContext);
  if (!context) {
    throw new Error('useSignupForm must be used within SignupFormProvider');
  }
  return context;
}
```

### バリデーションスキーマ

共通のバリデーションスキーマは `app/lib/validations/` に配置：

```typescript
// app/lib/validations/auth.schema.ts
import { z } from 'zod';

export const nameSchema = z
  .string()
  .min(2, '名前は2文字以上で入力してください。')
  .max(100, '名前は100文字以内で入力してください。');

export const emailSchema = z.email('有効なメールアドレスを入力してください。');

export const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上で入力してください。')
  .max(100, 'パスワードは100文字以内で入力してください。');
```

### API クライアント

API 通信は `app/lib/axios-clients/` を使用：

```typescript
// app/lib/axios-clients/api-instance.ts
import axios, { type AxiosInstance } from 'axios';

export const createApiClient = (
  baseURL: string,
  timeout: number = 5000
): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
```

```typescript
// app/lib/axios-clients/auth-interceptor.ts
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getStorageItem, STORAGE_KEYS } from '@app/lib/storage/local-storage';

export const attachAuthInterceptor = (
  instance: AxiosInstance
): AxiosInstance => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return instance;
};
```

```typescript
// app/lib/axios-clients/api-client.ts
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createApiClient } from './api-instance';
import { attachAuthInterceptor } from './auth-interceptor';
import { resolveApiBaseUrl } from './api-base-url';

const apiBaseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const apiClient = attachAuthInterceptor(
  createApiClient(apiBaseUrl, 5000)
);

// orvalのmutator用の関数
export const apiMutator = async <T = any, D = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T, D>> => {
  return apiClient.request<T, AxiosResponse<T, D>, D>(config);
};
```

### エラーハンドリング

API エラーの処理は `app/lib/error/axios-error-handler.ts` に集約：

```typescript
// app/lib/error/axios-error-handler.ts
import { ErrorCode } from '@shared/error-code.const';
import type { AxiosError } from 'axios';
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  error?: {
    code?: ErrorCode;
    message?: string;
  };
}

export interface ErrorHandlerResult {
  status: number;
  message: string;
  code: ErrorCode;
  validationErrors?: Record<string, string[]>;
}

export const axiosErrorHandler = (error: AxiosError): ErrorHandlerResult => {
  const status = error.response?.status || 500;
  const defaultMessage = '不明なエラーが発生しました';
  const defaultCode = ErrorCode.INTERNAL_SERVER_ERROR;

  if (!error.response?.data) {
    if (error.request) {
      return {
        status,
        message:
          'サーバーに接続できませんでした。しばらくしてから再度お試しください。',
        code: defaultCode,
      };
    }
    return {
      status,
      message: defaultMessage,
      code: defaultCode,
    };
  }

  const errorData = error.response.data as ApiErrorResponse;
  const validationErrors = errorData.errors;

  let message = errorData.error?.message || errorData.message;
  if (!message && validationErrors) {
    const firstError = Object.values(validationErrors)[0]?.[0];
    message = firstError || '入力に問題があります';
  }

  return {
    status,
    message: message || defaultMessage,
    code: errorData.error?.code || defaultCode,
    validationErrors,
  };
};

export const setFormValidationErrors = <T extends FieldValues>(
  validationErrors: Record<string, string[]> | undefined,
  setError: UseFormSetError<T>,
  allowedFields: readonly (keyof T)[]
): void => {
  if (!validationErrors) return;

  Object.entries(validationErrors).forEach(([field, messages]) => {
    if (allowedFields.includes(field as keyof T) && messages[0]) {
      setError(field as Path<T>, {
        type: 'server',
        message: messages[0],
      });
    }
  });
};
```

### ルーティング

ルート定義は `app/routes.ts` に記述：

```typescript
// app/routes.ts
import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

export default [
  // ゲスト専用ルート（未認証ユーザーのみアクセス可能）
  layout('routes/_guest/layout.tsx', [
    index('pages/guest/Index.tsx'),
    route('signup', 'pages/signup/Index.tsx'),
    route('signin', 'pages/signin/Index.tsx'),
  ]),

  // 認証必須ルート（ログインユーザーのみアクセス可能）
  layout('routes/_auth/layout.tsx', [route('home', 'pages/home/Index.tsx')]),
] satisfies RouteConfig;
```

### 認証レイアウト

認証必須ルートのレイアウト：

```typescript
// app/routes/_auth/layout.tsx
import { Outlet, redirect } from 'react-router';
import { hasStorageItem, STORAGE_KEYS } from '@app/lib/storage/local-storage';
import { LoadingScreen } from '@app/components/feedbacks/LoadingScreen';

export async function clientLoader() {
  if (!hasStorageItem(STORAGE_KEYS.ACCESS_TOKEN)) throw redirect('/signin');
  return {};
}

export function HydrateFallback() {
  return <LoadingScreen />;
}

export default function AuthLayout() {
  return <Outlet />;
}
```

### アプリ横断の Context

アプリ全体で使用する Context は `app/contexts/` に配置：

```typescript
// app/contexts/AuthContext.tsx
import { createContext, useEffect, useRef } from 'react';
import { usePostApiUsersMe } from '@app/generated/web-api/default/default';
import { getStorageItem, removeStorageItem, STORAGE_KEYS } from '@app/lib/storage/local-storage';
import { LoadingScreen } from '@app/components/feedbacks/LoadingScreen';

interface AuthContextValue {
  user: PostApiUsersMe200 | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  clearUser: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasFetched = useRef(false);

  const { data, isPending, error, mutate } = usePostApiUsersMe({
    mutation: {
      onError: () => {
        removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
        hasFetched.current = false;
      },
    },
  });

  // ユーザー情報を再取得する関数
  const refetch = () => {
    const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      return;
    }
    mutate({ data: { accessToken } });
  };

  const clearUser = () => {
    removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    hasFetched.current = false;
  };

  useEffect(() => {
    const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      hasFetched.current = false;
      return;
    }

    if (!hasFetched.current) {
      hasFetched.current = true;
      mutate({ data: { accessToken } });
    }
  }, [mutate]);

  const value: AuthContextValue = {
    user: data?.data ?? null,
    isLoading: isPending,
    error,
    refetch,
    clearUser,
  };

  if (isPending) {
    return (
      <AuthContext.Provider value={value}>
        <LoadingScreen message="認証情報を確認中..." />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### テスト

```typescript
// app/pages/{feature}/__tests__/{Feature}FormContext.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupFormProvider } from '../contexts/SignupFormContext';
import { useSignupForm } from '../hooks/useSignupForm';

describe('SignupFormContext', () => {
  it('フォーム送信が正常に動作する', async () => {
    // テスト実装
  });
});
```

```typescript
// app/pages/{feature}/__tests__/{feature}.e2e.ts
import { test, expect } from '@playwright/test';

test('サインアップフロー', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="name"]', 'テストユーザー');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
});
```

## セキュリティ考慮事項

- 認証トークンは LocalStorage に保存（`app/lib/storage/local-storage.ts`）
- API リクエストには認証インターセプタで自動的にトークンを付与
- ユーザー入力は Zod スキーマで必ずバリデーション
- エラーメッセージはユーザーに表示可能な内容のみを返す
