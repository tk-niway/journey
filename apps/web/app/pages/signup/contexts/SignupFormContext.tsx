import { createContext, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { usePostApiAuthSignup } from '@generated/web-api/default/default';
import type { PostApiAuthSignupBody } from '@generated/web-api/model/postApiAuthSignupBody';
import type { PostApiAuthSignup200 } from '@generated/web-api/model/postApiAuthSignup200';
import { useSnackBar } from '@hooks/useSnackBar';
import {
  axiosErrorHandler,
  setFormValidationErrors,
} from '@app/lib/error/axios-error-handler';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@app/lib/validations/auth.schema';
import z from 'zod';

/** サインアップフォームのスキーマ */
export const signupFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

/** サインアップフォームの型 */
export type SignupFormData = z.infer<typeof signupFormSchema>;

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
  const { showSnackBar } = useSnackBar();

  // react-hook-form の設定（zod スキーマを使用）
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onSubmit', // フォーム送信時にバリデーションを実行
    reValidateMode: 'onChange', // 再バリデーションは変更時
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

        // 成功メッセージを表示
        showSnackBar('アカウントを作成しました', 'success');
        // ホームページへリダイレクト
        navigate('/');
      },
      onError: (error: AxiosError) => {
        const { message, validationErrors } = axiosErrorHandler(error);

        // フォームにバリデーションエラーをセット
        setFormValidationErrors(validationErrors, setError, [
          'name',
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
