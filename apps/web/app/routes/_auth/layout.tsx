import { Outlet, redirect } from 'react-router';
import { hasStorageItem, STORAGE_KEYS } from '@app/lib/storage/local-storage';
import { LoadingScreen } from '@app/components/feedbacks/LoadingScreen';

/**
 * 認証必須ルートのレイアウト
 * このレイアウト配下の全ルートは認証が必要
 * 未認証の場合は /signin にリダイレクトされる
 */
export async function clientLoader() {
  if (!hasStorageItem(STORAGE_KEYS.ACCESS_TOKEN)) throw redirect('/signin');
  return {};
}

/**
 * 認証チェック中のフォールバック表示
 */
export function HydrateFallback() {
  return <LoadingScreen />;
}

export default function AuthLayout() {
  return <Outlet />;
}
