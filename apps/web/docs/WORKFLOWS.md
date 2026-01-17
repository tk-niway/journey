# 作業パターン

このドキュメントは、よくある開発作業の手順をまとめたものです。

## 新しいページを追加する

### 1. ページディレクトリとファイルを作成

`app/pages/{feature}/Index.tsx`

```typescript
import { SomeFormProvider } from './contexts/SomeFormContext';
import { useSomeForm } from './hooks/useSomeForm';

export function meta() {
  return [
    { title: 'ページタイトル - Journey' },
    { name: 'description', content: 'ページの説明' },
  ];
}

function SomeForm() {
  const { form, mutation, onSubmit } = useSomeForm();
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

export default function SomePage() {
  return (
    <SomeFormProvider>
      <SomeForm />
    </SomeFormProvider>
  );
}
```

**重要**: ファイル名は必ず `Index.tsx`（大文字の I）にする。`index.tsx` は使用不可。

### 2. Context を作成

`app/pages/{feature}/contexts/{Feature}FormContext.tsx`

```typescript
import { createContext, useCallback } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { usePostApiSomeEndpoint } from '@app/generated/web-api/default/default';
import { useSnackBar } from '@app/hooks/useSnackBar';
import {
  axiosErrorHandler,
  setFormValidationErrors,
} from '@app/lib/error/axios-error-handler';
import { someFormSchema } from './some.schema';
import z from 'zod';

export const someFormSchema = z.object({
  // フィールド定義
});

export type SomeFormData = z.infer<typeof someFormSchema>;

interface SomeFormContextValue {
  form: UseFormReturn<SomeFormData>;
  mutation: ReturnType<typeof usePostApiSomeEndpoint>;
  onSubmit: (data: SomeFormData) => void;
}

export const SomeFormContext = createContext<SomeFormContextValue | null>(
  null
);

export function SomeFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();

  const form = useForm<SomeFormData>({
    resolver: zodResolver(someFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      // デフォルト値
    },
  });

  const { setError } = form;

  const mutation = usePostApiSomeEndpoint({
    mutation: {
      onSuccess: (response) => {
        showSnackBar('成功メッセージ', 'success');
        navigate('/');
      },
      onError: (error: AxiosError) => {
        const { message, validationErrors } = axiosErrorHandler(error);
        setFormValidationErrors(validationErrors, setError, [
          // フィールド名
        ] as const);
        showSnackBar(message, 'error');
      },
    },
  });

  const onSubmit = useCallback(
    (data: SomeFormData) => {
      const requestData = {
        // リクエストデータ
      };
      mutation.mutate({ data: requestData });
    },
    [mutation]
  );

  const value: SomeFormContextValue = {
    form,
    mutation,
    onSubmit,
  };

  return (
    <SomeFormContext.Provider value={value}>
      {children}
    </SomeFormContext.Provider>
  );
}
```

### 3. Hook を作成

`app/pages/{feature}/hooks/use{Feature}Form.ts`

```typescript
import { useContext } from 'react';
import { SomeFormContext } from '../contexts/SomeFormContext';

export function useSomeForm() {
  const context = useContext(SomeFormContext);
  if (!context) {
    throw new Error('useSomeForm must be used within SomeFormProvider');
  }
  return context;
}
```

### 4. ルートを登録

`app/routes.ts` に追加：

```typescript
import { type RouteConfig, route, layout } from '@react-router/dev/routes';

export default [
  // 既存のルート...
  layout('routes/_auth/layout.tsx', [route('some', 'pages/some/Index.tsx')]),
] satisfies RouteConfig;
```

### 5. テストを作成

`app/pages/{feature}/__tests__/{Feature}FormContext.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupFormProvider } from '../contexts/SomeFormContext';

describe('SomeFormContext', () => {
  it('フォーム送信が正常に動作する', async () => {
    // テスト実装
  });
});
```

---

## 新しい共通コンポーネントを追加する

### 1. コンポーネントファイルを作成

`app/components/{category}/{ComponentName}.tsx`

```typescript
import type { ReactNode } from 'react';

interface ComponentNameProps {
  children?: ReactNode;
  className?: string;
}

export function ComponentName({
  children,
  className = '',
}: ComponentNameProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
```

### 2. 必要に応じてテストを作成

`app/components/{category}/__tests__/{ComponentName}.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('正常にレンダリングされる', () => {
    render(<ComponentName>テスト</ComponentName>);
    expect(screen.getByText('テスト')).toBeInTheDocument();
  });
});
```

---

## 新しい API 呼び出しを追加する

### 1. OpenAPI 仕様を確認

`shared/openapi.yml` または API ドキュメントを確認し、エンドポイントの定義を把握する。

### 2. API 型を生成

```bash
pnpm orval
```

これにより `app/generated/web-api/` 配下に型定義が生成される。

### 3. Context で API 呼び出しを実装

`app/pages/{feature}/contexts/{Feature}FormContext.tsx` で生成された Hook を使用：

```typescript
import { usePostApiSomeEndpoint } from '@app/generated/web-api/default/default';
import type { PostApiSomeEndpointBody } from '@app/generated/web-api/model/postApiSomeEndpointBody';

const mutation = usePostApiSomeEndpoint({
  mutation: {
    onSuccess: (response) => {
      // 成功時の処理
    },
    onError: (error: AxiosError) => {
      // エラー時の処理
    },
  },
});
```

### 4. 必要に応じて API クライアントを拡張

新しいエンドポイント用のインターセプタや共通処理が必要な場合は `app/lib/axios-clients/` を拡張する。

---

## 新しいルートを追加する

### 1. ルート定義を追加

`app/routes.ts` に追加：

```typescript
import { type RouteConfig, route, layout } from '@react-router/dev/routes';

export default [
  // 既存のルート...
  layout('routes/_auth/layout.tsx', [
    route('new-route', 'pages/new-route/Index.tsx'),
  ]),
] satisfies RouteConfig;
```

### 2. 認証要件を確認

- 認証必須: `routes/_auth/layout.tsx` 配下に配置
- ゲスト専用: `routes/_guest/layout.tsx` 配下に配置
- 認証不要: レイアウト外に配置

### 3. 型生成を実行

```bash
pnpm typecheck
```

これにより React Router の型が自動生成される。

---

## 新しいバリデーションスキーマを追加する

### 1. 共通スキーマを追加

`app/lib/validations/{domain}.schema.ts`

```typescript
import { z } from 'zod';

export const someFieldSchema = z
  .string()
  .min(1, 'フィールドは必須です')
  .max(100, 'フィールドは100文字以内で入力してください。');
```

### 2. ページ専用スキーマを追加

`app/pages/{feature}/contexts/{Feature}FormContext.tsx` 内で定義：

```typescript
import { someFieldSchema } from '@app/lib/validations/some.schema';
import z from 'zod';

export const someFormSchema = z.object({
  someField: someFieldSchema,
});
```

---

## テストを追加する

### 単体・結合テスト（Vitest）

`app/pages/{feature}/__tests__/{Feature}FormContext.test.tsx`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SomeFormProvider } from '../contexts/SomeFormContext';

describe('SomeFormContext', () => {
  beforeEach(() => {
    // テスト前の準備
  });

  it('フォーム送信が正常に動作する', async () => {
    const user = userEvent.setup();
    render(
      <SomeFormProvider>
        {/* テスト対象コンポーネント */}
      </SomeFormProvider>
    );

    // テスト実装
    await user.type(screen.getByLabelText('フィールド'), 'テスト値');
    await user.click(screen.getByRole('button', { name: '送信' }));

    await waitFor(() => {
      expect(screen.getByText('成功メッセージ')).toBeInTheDocument();
    });
  });
});
```

### E2E テスト（Playwright）

`app/pages/{feature}/__tests__/{feature}.e2e.ts`

```typescript
import { test, expect } from '@playwright/test';

test('機能のE2Eテスト', async ({ page }) => {
  await page.goto('/some');
  await page.fill('input[name="field"]', 'テスト値');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
});
```

---

## バグを修正する

### 1. 失敗するテストを書く

まず、バグを再現するテストを作成する：

```typescript
it('バグの説明：期待する動作', async () => {
  // バグを再現する入力
  const input = {
    /* ... */
  };

  // 期待する結果（現在は失敗する）
  const result = await someFunction(input);
  expect(result).toBe(expectedValue);
});
```

### 2. テストが失敗することを確認

```bash
pnpm test app/pages/{feature}/__tests__/{Feature}FormContext.test.tsx
```

### 3. 修正を実装

該当のコードを修正する。

### 4. テストが通ることを確認

```bash
pnpm test app/pages/{feature}/__tests__/{Feature}FormContext.test.tsx
```

### 5. 関連するテストを実行

```bash
pnpm test:all
```

---

## リファクタリングする

### 1. 既存のテストがすべて通ることを確認

```bash
pnpm test:all
```

### 2. リファクタリングを実施

コードを改善する。ただし、外部から見た動作は変更しない。

### 3. テストが通ることを再確認

```bash
pnpm test:all
```

### 4. 必要に応じてテストも更新

新しいパターンに合わせてテストコードも改善する。

---

## 作業完了チェックリスト

すべての作業が完了したら、以下のチェックを実行してください：

### 1. テストの実行

```bash
pnpm test:all
```

すべてのテストがパスすることを確認。

### 2. Lint チェック

```bash
pnpm lint:check
```

エラーがないことを確認。エラーがある場合：

```bash
pnpm lint:fix
```

### 3. フォーマットチェック

```bash
pnpm format:check
```

エラーがないことを確認。エラーがある場合：

```bash
pnpm format:fix
```

### 4. 型チェック

```bash
pnpm typecheck
```

エラーがないことを確認。

### 一括チェック

上記を一括で実行：

```bash
pnpm check:all
```

### チェック項目まとめ

| チェック     | コマンド            | 自動修正          |
| ------------ | ------------------- | ----------------- |
| テスト       | `pnpm test:all`     | -                 |
| Lint         | `pnpm lint:check`   | `pnpm lint:fix`   |
| フォーマット | `pnpm format:check` | `pnpm format:fix` |
| 型チェック   | `pnpm typecheck`    | -                 |
| 全チェック   | `pnpm check:all`    | -                 |
