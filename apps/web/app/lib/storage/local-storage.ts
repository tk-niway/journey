/**
 * LocalStorageのキー定義
 * 新しいキーを追加する場合はここに追加する
 */
export const STORAGE_KEYS = {
  /** 認証アクセストークン */
  ACCESS_TOKEN: 'accessToken',
} as const;

/** ストレージキーの型 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * LocalStorageから値を取得する
 * @param key - ストレージキー
 * @returns 保存された値、または存在しない場合はnull
 */
export const getStorageItem = (key: StorageKey): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(key);
};

/**
 * LocalStorageに値を保存する
 * @param key - ストレージキー
 * @param value - 保存する値
 */
export const setStorageItem = (key: StorageKey, value: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(key, value);
};

/**
 * LocalStorageから値を削除する
 * @param key - ストレージキー
 */
export const removeStorageItem = (key: StorageKey): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(key);
};

/**
 * 指定したキーの値が存在するか確認する
 * @param key - ストレージキー
 * @returns 値が存在する場合はtrue
 */
export const hasStorageItem = (key: StorageKey): boolean => {
  return getStorageItem(key) !== null;
};
