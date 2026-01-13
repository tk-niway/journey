import { Heading } from '@components/texts/Heading';
import { Description } from '@components/texts/Description';
import { BodyText } from '@components/texts/BodyText';
import { LinkText } from '@components/texts/LinkText';
import { LinkButton } from '@components/buttons/LinkButton';
import { CenteredLayout } from '@components/layouts/CenteredLayout';

export function meta() {
  return [
    { title: 'Journey - ようこそ' },
    {
      name: 'description',
      content: 'Journeyへようこそ。新しいアカウントを作成して始めましょう。',
    },
  ];
}

export default function GuestPage() {
  return (
    <CenteredLayout>
      <div>
        <Heading level={1} className="mt-6">
          Journeyへようこそ
        </Heading>
        <Description className="mt-2">
          新しいアカウントを作成して、Journeyを始めましょう
        </Description>
      </div>

      <div className="mt-8 space-y-4">
        <BodyText color="muted" className="text-center">
          アカウントをお持ちでない方は、新規登録から始めましょう。
          既にアカウントをお持ちの方は、ログインしてください。
        </BodyText>

        <div className="flex flex-col gap-4 mt-6">
          <LinkButton to="/signup" variant="primary">
            新規登録
          </LinkButton>
          <LinkButton to="/signin" variant="secondary">
            ログイン
          </LinkButton>
        </div>

        <div className="text-center mt-6">
          <BodyText size="sm" color="muted">
            アカウントを作成することで、
            <LinkText to="/signup">利用規約</LinkText>
            および
            <LinkText to="/signup">プライバシーポリシー</LinkText>
            に同意したものとみなされます。
          </BodyText>
        </div>
      </div>
    </CenteredLayout>
  );
}
