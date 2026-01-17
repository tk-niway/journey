import { Outlet, redirect } from 'react-router';
import { hasStorageItem, STORAGE_KEYS } from '@app/lib/storage/local-storage';
import { LoadingScreen } from '@app/components/feedbacks/LoadingScreen';

/**
 * ゲスト専用ルートのレイアウト
 * このレイアウト配下の全ルートはゲスト（未認証）専用
 * 認証済みの場合は /home にリダイレクトされる
 */
export async function clientLoader() {
  if (hasStorageItem(STORAGE_KEYS.ACCESS_TOKEN)) throw redirect('/home');
  return {};
}

/**
 * 認証チェック中のフォールバック表示
 */
export function HydrateFallback() {
  return <LoadingScreen />;
}

export default function GuestLayout() {
  return <Outlet />;
}
