import { createContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { usePostApiUsersMe } from '@generated/web-api/default/default';
import type { PostApiUsersMeBody } from '@generated/web-api/model/postApiUsersMeBody';
import type { PostApiUsersMe200 } from '@generated/web-api/model/postApiUsersMe200';

// Context の型定義
interface HomeContextValue {
  user: PostApiUsersMe200 | null;
  isLoading: boolean;
  error: unknown;
}

// Context の作成
export const HomeContext = createContext<HomeContextValue | null>(null);

// Provider コンポーネント
export function HomeProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const { data, isLoading, error, mutate } = usePostApiUsersMe({
    mutation: {
      onError: () => {
        // エラー時はログインページへリダイレクト
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
        navigate('/signin');
      },
    },
  });

  useEffect(() => {
    // クライアントサイドでのみlocalStorageにアクセス
    if (typeof window === 'undefined') {
      return;
    }

    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      // アクセストークンがない場合はログインページへリダイレクト
      navigate('/signin');
      return;
    }

    // 初回のみユーザー情報を取得
    if (!hasFetched.current) {
      hasFetched.current = true;
      const requestBody: PostApiUsersMeBody = {
        accessToken: accessToken,
      };
      mutate({ data: requestBody });
    }
  }, [navigate, mutate]);

  const value: HomeContextValue = {
    user: data?.data ?? null,
    isLoading,
    error,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}
