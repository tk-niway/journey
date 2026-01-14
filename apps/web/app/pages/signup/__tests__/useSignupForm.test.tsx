import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import { SnackBarProvider } from '@contexts/SnackBarContext';
import { SignupFormProvider } from '../contexts/SignupFormContext';
import { useSignupForm } from '../hooks/useSignupForm';

/**
 * useSignupFormの単体テスト
 * 1ファイル単位でのテスト
 */
describe('useSignupForm', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    // localStorageをクリア
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SnackBarProvider>
        <BrowserRouter>
          <SignupFormProvider>{children}</SignupFormProvider>
        </BrowserRouter>
      </SnackBarProvider>
    </QueryClientProvider>
  );

  it('SignupFormProviderの外で使用するとエラーを投げる', () => {
    // エラーをキャッチするためのコンソールエラーを無視
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useSignupForm());
    }).toThrow('useSignupForm must be used within SignupFormProvider');

    consoleError.mockRestore();
  });

  it('SignupFormProvider内で使用するとcontextの値を返す', () => {
    const { result } = renderHook(() => useSignupForm(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.form).toBeDefined();
    expect(result.current.signupMutation).toBeDefined();
    expect(result.current.onSubmit).toBeDefined();
  });

  it('フォームの初期値が正しく設定されている', () => {
    const { result } = renderHook(() => useSignupForm(), { wrapper });

    expect(result.current.form.getValues()).toEqual({
      name: '',
      email: '',
      password: '',
    });
  });

  it('onSubmit関数が定義されている', () => {
    const { result } = renderHook(() => useSignupForm(), { wrapper });

    expect(typeof result.current.onSubmit).toBe('function');
  });

  it('signupMutationが定義されている', () => {
    const { result } = renderHook(() => useSignupForm(), { wrapper });

    expect(result.current.signupMutation).toBeDefined();
    expect(result.current.signupMutation.mutate).toBeDefined();
  });
});
