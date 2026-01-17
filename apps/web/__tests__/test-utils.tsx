import type { ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import { SnackBarProvider } from '@app/contexts/SnackBarContext';

/**
 * テスト用のQueryClientを作成
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * テスト用のラッパーコンポーネント
 */
interface AllTheProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

function AllTheProviders({
  children,
  queryClient = createTestQueryClient(),
}: AllTheProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackBarProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </SnackBarProvider>
    </QueryClientProvider>
  );
}

/**
 * カスタムレンダー関数
 * テストで必要なProviderを自動的にラップする
 */
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render, createTestQueryClient };
