import { useContext } from 'react';
import { SignupFormContext } from '../contexts/SignupFormContext';

/**
 * サインアップフォームの context を使用するカスタムフック
 * @throws {Error} SignupFormProvider の外で使用された場合
 */
export function useSignupForm() {
  const context = useContext(SignupFormContext);
  if (!context) {
    throw new Error('useSignupForm must be used within SignupFormProvider');
  }
  return context;
}
