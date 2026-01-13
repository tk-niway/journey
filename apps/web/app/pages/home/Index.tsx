import { Heading } from '@components/texts/Heading';
import { Description } from '@components/texts/Description';
import { BodyText } from '@components/texts/BodyText';
import { LabelText } from '@components/texts/LabelText';
import { HomeProvider } from './contexts/HomeContext';
import { useHome } from './hooks/useHome';
import { authLoader } from '@lib/auth/route-loaders';

export async function clientLoader() {
  return authLoader();
}

export function meta() {
  return [
    { title: 'ホーム - Journey' },
    { name: 'description', content: 'ユーザー情報を表示します' },
  ];
}

function HomeContent() {
  const { user, isLoading, error } = useHome();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <BodyText color="muted">読み込み中...</BodyText>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <BodyText color="error">ユーザー情報の取得に失敗しました</BodyText>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Heading className="mt-6">ホーム</Heading>
          <Description className="mt-2">ユーザー情報</Description>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
          <div>
            <LabelText>名前</LabelText>
            <BodyText size="lg" className="mt-1">
              {user.name}
            </BodyText>
          </div>
          <div>
            <LabelText>メールアドレス</LabelText>
            <BodyText size="lg" className="mt-1">
              {user.email}
            </BodyText>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <HomeProvider>
      <HomeContent />
    </HomeProvider>
  );
}
