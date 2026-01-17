import { createContext, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { usePostApiAuthLogin } from '@app/generated/web-api/default/default';
import type { PostApiAuthLoginBody } from '@app/generated/web-api/model/postApiAuthLoginBody';
import type { PostApiAuthLogin200 } from '@app/generated/web-api/model/postApiAuthLogin200';
import { useSnackBar } from '@app/hooks/useSnackBar';
import {
  axiosErrorHandler,
  setFormValidationErrors,
} from '@app/lib/error/axios-error-handler';
import { useAuth } from '@app/hooks/useAuth';
import { setStorageItem, STORAGE_KEYS } from '@app/lib/storage/local-storage';
import { emailSchema, passwordSchema } from '@app/lib/validations/auth.schema';
import z from 'zod';

/** サインインフォームのスキーマ */
export const signinFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/** サインインフォームの型 */
export type SigninFormData = z.infer<typeof signinFormSchema>;

// Context の型定義
interface SigninFormContextValue {
  form: UseFormReturn<SigninFormData>;
  signinMutation: ReturnType<typeof usePostApiAuthLogin>;
  onSubmit: (data: SigninFormData) => void;
}

// Context の作成
export const SigninFormContext = createContext<SigninFormContextValue | null>(
  null
);

// Provider コンポーネント
export function SigninFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();
  const { refetch } = useAuth();

  // react-hook-form の設定（zod スキーマを使用）
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setError } = form;

  const signinMutation = usePostApiAuthLogin({
    mutation: {
      onSuccess: (response) => {
        // サインイン成功時の処理
        // response.data には PostApiAuthLogin200 型のデータが含まれます
        const loginData: PostApiAuthLogin200 = response.data;

        // accessTokenをlocalStorageに保存
        if (loginData.accessToken) {
          setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, loginData.accessToken);
        }

        // AuthContextのユーザー情報を更新
        refetch();

        // 成功メッセージを表示
        showSnackBar('ログインしました', 'success');
        // ホームページへリダイレクト
        navigate('/home');
      },
      onError: (error: AxiosError) => {
        const { message, validationErrors } = axiosErrorHandler(error);

        // フォームにバリデーションエラーをセット
        setFormValidationErrors(validationErrors, setError, [
          'email',
          'password',
        ] as const);

        // SnackBarでエラーを表示
        showSnackBar(message, 'error');
      },
    },
  });

  // フォーム送信処理
  const onSubmit = useCallback(
    (data: SigninFormData) => {
      // zod でバリデーション済みのデータを PostApiAuthLoginBody 型に変換
      const signinData: PostApiAuthLoginBody = {
        email: data.email,
        password: data.password,
      };
      // usePostApiAuthLogin の mutate 関数を使用してリクエストを送信
      // mutate の引数は { data: PostApiAuthLoginBody } の形式
      signinMutation.mutate({ data: signinData });
    },
    [signinMutation]
  );

  const value: SigninFormContextValue = {
    form,
    signinMutation,
    onSubmit,
  };

  return (
    <SigninFormContext.Provider value={value}>
      {children}
    </SigninFormContext.Provider>
  );
}
