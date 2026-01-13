import { redirect } from 'react-router';

/**
 * 認証状態をチェックする
 * @returns ログインしている場合は true、していない場合は false
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken;
}

/**
 * 認証が必要なルートで使用する
 * 未認証の場合は /signin にリダイレクトする
 */
export function requireAuth(): void {
  if (!isAuthenticated()) {
    throw redirect('/signin');
  }
}

/**
 * ゲスト専用ルートで使用する
 * 認証済みの場合は /home にリダイレクトする
 */
export function requireGuest(): void {
  if (isAuthenticated()) {
    throw redirect('/home');
  }
}
