import { InputText } from '@components/inputs/InputText';
import { BaseButton } from '@components/buttons/BaseButton';
import { Heading } from '@components/texts/Heading';
import { Description } from '@components/texts/Description';
import { LinkText } from '@components/texts/LinkText';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Heading className="mt-6">アカウントを作成</Heading>
          <Description className="mt-2">
            新しいアカウントを作成して始めましょう
          </Description>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <InputText
              label="名前"
              type="text"
              autoComplete="name"
              placeholder="山田 太郎"
              error={errors.name}
              {...register('name')}
            />
            <InputText
              label="メールアドレス"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              error={errors.email}
              {...register('email')}
            />
            <InputText
              label="パスワード"
              type="password"
              autoComplete="new-password"
              placeholder="8文字以上"
              error={errors.password}
              {...register('password')}
            />
          </div>

          <div>
            <BaseButton
              type="submit"
              isLoading={isSubmitting || signupMutation.isPending}
            >
              アカウントを作成
            </BaseButton>
          </div>

          <div className="text-center">
            <LinkText to="/signin">既にアカウントをお持ちの方はこちら</LinkText>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <SignupFormProvider>
      <SignupForm />
    </SignupFormProvider>
  );
}
