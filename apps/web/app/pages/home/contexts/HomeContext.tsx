import { createContext } from 'react';
import { useAuth } from '@app/hooks/useAuth';
import type { PostApiUsersMe200 } from '@app/generated/web-api/model/postApiUsersMe200';

// Context の型定義
interface HomeContextValue {
  user: PostApiUsersMe200 | null;
  isLoading: boolean;
  error: unknown;
}

// Context の作成
export const HomeContext = createContext<HomeContextValue | null>(null);

// Provider コンポーネント
// AuthContextを使用してユーザー情報を取得
export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, error } = useAuth();

  const value: HomeContextValue = {
    user,
    isLoading,
    error,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}
