import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

/**
 * TanStack Query の Provider ラッパー
 * SSR対応: リクエストごとに新しい QueryClient インスタンスを作成
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // useState の初期化関数を使用することで、コンポーネントの再マウント時にのみ新しいインスタンスを作成
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5分
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
