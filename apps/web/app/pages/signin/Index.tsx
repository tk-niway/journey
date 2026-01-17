import { InputText } from '@app/components/inputs/InputText';
import { BaseButton } from '@app/components/buttons/BaseButton';
import { Heading } from '@app/components/texts/Heading';
import { Description } from '@app/components/texts/Description';
import { LinkText } from '@app/components/texts/LinkText';
import { CenteredLayout } from '@app/components/layouts/CenteredLayout';
import { SigninFormProvider } from './contexts/SigninFormContext';
import { useSigninForm } from './hooks/useSigninForm';

export function meta() {
  return [
    { title: 'サインイン - Journey' },
    { name: 'description', content: 'アカウントにログインして始めましょう' },
  ];
}

function SigninForm() {
  const { form, signinMutation, onSubmit } = useSigninForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <CenteredLayout>
      <div>
        <Heading className="mt-6">ログイン</Heading>
        <Description className="mt-2">
          アカウントにログインして始めましょう
        </Description>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 rounded-md shadow-sm">
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
            autoComplete="current-password"
            placeholder="8文字以上"
            error={errors.password}
            {...register('password')}
          />
        </div>

        <div>
          <BaseButton
            type="submit"
            isLoading={isSubmitting || signinMutation.isPending}
          >
            ログイン
          </BaseButton>
        </div>

        <div className="text-center">
          <LinkText to="/signup">アカウントをお持ちでない方はこちら</LinkText>
        </div>
      </form>
    </CenteredLayout>
  );
}

export default function SigninPage() {
  return (
    <SigninFormProvider>
      <SigninForm />
    </SigninFormProvider>
  );
}
