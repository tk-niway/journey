import { useContext } from 'react';
import { SnackBarContext } from '@app/contexts/SnackBarContext';
import type { SnackBarVariant } from '@app/components/snack-bars/SnackBar';

/**
 * useSnackBarカスタムフック
 * コンポーネントからSnackBarを表示するためのフック
 *
 * @example
 * ```tsx
 * const { showSnackBar } = useSnackBar();
 *
 * デフォルト（5秒後に自動非表示）
 * showSnackBar('操作が成功しました', 'success');
 *
 * カスタム時間（3秒後に自動非表示）
 * showSnackBar('処理中...', 'info', 3000);
 *
 * 自動非表示しない（手動で閉じるまで表示）
 * showSnackBar('重要なメッセージ', 'warning', undefined);
 * ```
 */
export function useSnackBar() {
  const context = useContext(SnackBarContext);

  if (!context) {
    throw new Error('useSnackBar must be used within SnackBarProvider');
  }

  return {
    showSnackBar: (
      message: string,
      variant?: SnackBarVariant,
      duration?: number
    ) => {
      context.showSnackBar(message, variant, duration);
    },
  };
}
