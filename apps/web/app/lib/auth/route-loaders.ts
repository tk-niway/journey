import { requireAuth, requireGuest } from './route-guard';

/**
 * ゲスト専用ルート用の clientLoader
 */
export async function guestLoader() {
  requireGuest();
  return {};
}

/**
 * 認証必須ルート用の clientLoader
 */
export async function authLoader() {
  requireAuth();
  return {};
}

/**
 * 認証必須ルート用の clientLoader（データ取得付き）
 */
export async function authLoaderWithData<T>(
  dataLoader: () => Promise<T>
): Promise<T> {
  requireAuth();
  return dataLoader();
}
