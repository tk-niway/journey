import { createContext, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AxiosError } from 'axios';
import { usePostApiAuthLogin } from '@generated/web-api/default/default';
import type { PostApiAuthLoginBody } from '@generated/web-api/model/postApiAuthLoginBody';
import type { PostApiAuthLogin200 } from '@generated/web-api/model/postApiAuthLogin200';
import { useSnackBar } from '@hooks/useSnackBar';
import { useAuth } from '@contexts/AuthContext';

// Zod スキーマの定義
const signinSchema = z.object({
  email: z.email('有効なメールアドレスを入力してください。'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください。')
    .max(100, 'パスワードは100文字以内で入力してください。'),
});

export type SigninFormData = z.infer<typeof signinSchema>;

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
    resolver: zodResolver(signinSchema),
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
        console.log('サインイン成功:', loginData);

        // accessTokenをlocalStorageに保存
        if (loginData.accessToken && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', loginData.accessToken);
        }

        // AuthContextのユーザー情報を更新
        refetch();

        // 成功メッセージを表示
        showSnackBar('ログインしました', 'success');
        // ホームページへリダイレクト
        navigate('/home');
      },
      onError: (error: AxiosError) => {
        // エラーハンドリング
        let errorMessage = 'ログインに失敗しました';

        if (error.response?.data) {
          const errorData = error.response.data as {
            message?: string;
            errors?: Record<string, string[]>;
          };

          // バリデーションエラーの場合
          if (errorData.errors) {
            const firstError = Object.values(errorData.errors)[0]?.[0];
            errorMessage = firstError || '入力に問題があります';

            Object.entries(errorData.errors).forEach(([field, messages]) => {
              if (field === 'email' || field === 'password') {
                setError(field as keyof PostApiAuthLoginBody, {
                  type: 'server',
                  message: messages[0] || '入力に問題があります',
                });
              }
            });
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else if (error.request) {
          // リクエストは送信されたが、レスポンスが受け取れなかった場合
          errorMessage =
            'サーバーに接続できませんでした しばらくしてから再度お試しください';
        } else {
          // リクエストの設定中にエラーが発生した場合
          errorMessage = 'ログインに失敗しました もう一度お試しください';
        }

        // エラーメッセージをSnackBarで表示
        showSnackBar(errorMessage, 'error');
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
