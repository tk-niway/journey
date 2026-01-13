import { useContext } from 'react';
import { HomeContext } from '../contexts/HomeContext';

/**
 * ホームページの context を使用するカスタムフック
 * @throws {Error} HomeProvider の外で使用された場合
 */
export function useHome() {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within HomeProvider');
  }
  return context;
}
