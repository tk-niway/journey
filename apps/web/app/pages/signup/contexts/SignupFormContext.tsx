import { createContext, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AxiosError } from 'axios';
import { usePostApiAuthSignup } from '@generated/web-api/default/default';
import type { PostApiAuthSignupBody } from '@generated/web-api/model/postApiAuthSignupBody';
import type { PostApiAuthSignup200 } from '@generated/web-api/model/postApiAuthSignup200';

// Zod スキーマの定義
const signupSchema = z.object({
  name: z
    .string()
    .min(2, '名前は2文字以上で入力してください。')
    .max(100, '名前は100文字以内で入力してください。'),
  email: z.email('有効なメールアドレスを入力してください。'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください。')
    .max(100, 'パスワードは100文字以内で入力してください。'),
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Context の型定義
interface SignupFormContextValue {
  form: UseFormReturn<SignupFormData>;
  signupMutation: ReturnType<typeof usePostApiAuthSignup>;
  onSubmit: (data: SignupFormData) => void;
}

// Context の作成
export const SignupFormContext = createContext<SignupFormContextValue | null>(
  null
);

// Provider コンポーネント
export function SignupFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  // react-hook-form の設定（zod スキーマを使用）
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
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
        // サインアップ成功時の処理
        // response.data には PostApiAuthSignup200 型のデータが含まれます
        const userData: PostApiAuthSignup200 = response.data;
        console.log('サインアップ成功:', userData);
        // ホームページへリダイレクト
        navigate('/');
      },
      onError: (error: AxiosError) => {
        // エラーハンドリング
        if (error.response?.data) {
          const errorData = error.response.data as {
            message?: string;
            errors?: Record<string, string[]>;
          };

          // バリデーションエラーの場合
          if (errorData.errors) {
            Object.entries(errorData.errors).forEach(([field, messages]) => {
              if (
                field === 'name' ||
                field === 'email' ||
                field === 'password'
              ) {
                setError(field as keyof PostApiAuthSignupBody, {
                  type: 'server',
                  message: messages[0] || '入力に問題があります。',
                });
              }
            });
          } else if (errorData.message) {
            // 一般的なエラーメッセージ
            setError('email', {
              type: 'server',
              message: errorData.message,
            });
          } else {
            setError('email', {
              type: 'server',
              message: 'サインアップに失敗しました。',
            });
          }
        } else if (error.request) {
          // リクエストは送信されたが、レスポンスが受け取れなかった場合
          setError('email', {
            type: 'server',
            message:
              'サーバーに接続できませんでした。しばらくしてから再度お試しください。',
          });
        } else {
          // リクエストの設定中にエラーが発生した場合
          setError('email', {
            type: 'server',
            message: 'サインアップに失敗しました。もう一度お試しください。',
          });
        }
      },
    },
  });

  // フォーム送信処理
  const onSubmit = useCallback(
    (data: SignupFormData) => {
      // zod でバリデーション済みのデータを PostApiAuthSignupBody 型に変換
      const signupData: PostApiAuthSignupBody = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      // usePostApiAuthSignup の mutate 関数を使用してリクエストを送信
      // mutate の引数は { data: PostApiAuthSignupBody } の形式
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
