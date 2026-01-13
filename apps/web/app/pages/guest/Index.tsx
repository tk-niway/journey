import { Heading } from '@components/texts/Heading';
import { Description } from '@components/texts/Description';
import { BodyText } from '@components/texts/BodyText';
import { LinkText } from '@components/texts/LinkText';
import { Link } from 'react-router';
import { guestLoader } from '@lib/auth/route-loaders';

export async function clientLoader() {
  return guestLoader();
}

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
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
            <Link
              to="/signup"
              className="group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              新規登録
            </Link>
            <Link
              to="/signin"
              className="group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              ログイン
            </Link>
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
      </div>
    </div>
  );
}
