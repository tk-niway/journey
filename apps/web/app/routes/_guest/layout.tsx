import { Outlet } from 'react-router';
import { guestLoader } from '@lib/auth/route-loaders';

/**
 * ゲスト専用ルートのレイアウト
 * このレイアウト配下の全ルートはゲスト（未認証）専用
 * 認証済みの場合は /home にリダイレクトされる
 */
export async function clientLoader() {
  return guestLoader();
}

/**
 * 認証チェック中のフォールバック表示
 */
export function HydrateFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-gray-500 dark:text-gray-400">読み込み中...</div>
    </div>
  );
}

export default function GuestLayout() {
  return <Outlet />;
}
