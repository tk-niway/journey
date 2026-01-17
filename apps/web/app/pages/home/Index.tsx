import { Heading } from '@app/components/texts/Heading';
import { Description } from '@app/components/texts/Description';
import { BodyText } from '@app/components/texts/BodyText';
import { LabelText } from '@app/components/texts/LabelText';
import { CenteredLayout } from '@app/components/layouts/CenteredLayout';
import { HomeProvider } from './contexts/HomeContext';
import { useHome } from './hooks/useHome';

export function meta() {
  return [
    { title: 'ホーム - Journey' },
    { name: 'description', content: 'ユーザー情報を表示します' },
  ];
}

function HomeContent() {
  const { user, error } = useHome();

  if (error || !user) {
    return (
      <CenteredLayout>
        <div className="text-center">
          <BodyText color="error">ユーザー情報の取得に失敗しました</BodyText>
        </div>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout>
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
    </CenteredLayout>
  );
}

export default function HomePage() {
  return (
    <HomeProvider>
      <HomeContent />
    </HomeProvider>
  );
}
