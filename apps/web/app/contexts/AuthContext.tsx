import { createContext, useEffect, useRef } from 'react';
import { usePostApiUsersMe } from '@app/generated/web-api/default/default';
import type { PostApiUsersMeBody } from '@app/generated/web-api/model/postApiUsersMeBody';
import type { PostApiUsersMe200 } from '@app/generated/web-api/model/postApiUsersMe200';
import {
  getStorageItem,
  removeStorageItem,
  STORAGE_KEYS,
} from '@app/lib/storage/local-storage';
import { LoadingScreen } from '@app/components/feedbacks/LoadingScreen';

// Context の型定義
interface AuthContextValue {
  user: PostApiUsersMe200 | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  clearUser: () => void;
}

// Context の作成
export const AuthContext = createContext<AuthContextValue | null>(null);

// Provider コンポーネント
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasFetched = useRef(false);

  const { data, isPending, error, mutate } = usePostApiUsersMe({
    mutation: {
      onError: () => {
        // エラー時はトークンを削除してユーザー情報をクリア
        removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
        hasFetched.current = false;
      },
    },
  });

  // ユーザー情報を再取得する関数
  const refetch = () => {
    const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      return;
    }

    const requestBody: PostApiUsersMeBody = {
      accessToken: accessToken,
    };
    mutate({ data: requestBody });
  };

  // ユーザー情報をクリアする関数
  const clearUser = () => {
    removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    hasFetched.current = false;
  };

  useEffect(() => {
    const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (!accessToken) {
      hasFetched.current = false;
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
  }, [mutate]);

  const value: AuthContextValue = {
    user: data?.data ?? null,
    isLoading: isPending,
    error,
    refetch,
    clearUser,
  };

  // ローディング中はLoadingScreenを表示
  if (isPending) {
    return (
      <AuthContext.Provider value={value}>
        <LoadingScreen message="認証情報を確認中..." />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
