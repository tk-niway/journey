import { useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';

/**
 * 認証情報を取得するカスタムフック
 * AuthProvider内で使用する必要がある
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
