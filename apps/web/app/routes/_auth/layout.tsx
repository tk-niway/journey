import { Outlet } from 'react-router';
import { authLoader } from '@lib/auth/route-loaders';

/**
 * 認証必須ルートのレイアウト
 * このレイアウト配下の全ルートは認証が必要
 * 未認証の場合は /signin にリダイレクトされる
 */
export async function clientLoader() {
  return authLoader();
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

export default function AuthLayout() {
  return <Outlet />;
}
