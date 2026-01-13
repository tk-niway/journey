import { useContext } from 'react';
import { SigninFormContext } from '../contexts/SigninFormContext';

/**
 * サインインフォームの context を使用するカスタムフック
 * @throws {Error} SigninFormProvider の外で使用された場合
 */
export function useSigninForm() {
  const context = useContext(SigninFormContext);
  if (!context) {
    throw new Error('useSigninForm must be used within SigninFormProvider');
  }
  return context;
}
