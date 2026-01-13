export type SnackBarVariant = 'success' | 'error' | 'warning' | 'info';

export interface SnackBarProps {
  id: string;
  message: string;
  variant: SnackBarVariant;
  isVisible: boolean;
  isExiting: boolean;
  onClose: (id: string) => void;
}

/**
 * SnackBarコンポーネント
 * 画面下部中央に表示される通知メッセージ
 */
export function SnackBar({
  id,
  message,
  variant,
  isVisible,
  isExiting,
  onClose,
}: SnackBarProps) {
  const handleClose = () => {
    onClose(id);
  };

  const variantStyles = {
    success:
      'bg-green-600 text-white border-green-700 dark:bg-green-700 dark:border-green-800',
    error:
      'bg-red-600 text-white border-red-700 dark:bg-red-700 dark:border-red-800',
    warning:
      'bg-yellow-500 text-gray-900 border-yellow-600 dark:bg-yellow-600 dark:text-white dark:border-yellow-700',
    info: 'bg-blue-600 text-white border-blue-700 dark:bg-blue-700 dark:border-blue-800',
  };

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        min-w-[300px] max-w-[500px] w-auto mx-4
        rounded-lg border shadow-lg
        px-4 py-3
        transition-all duration-300 ease-in-out
        ${variantStyles[variant]}
        ${
          isVisible && !isExiting
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
        }
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-4">
        <p className="text-sm font-medium break-words whitespace-normal text-center">
          {message}
        </p>
        <button
          onClick={handleClose}
          className="
            flex-shrink-0
            text-white/80 hover:text-white
            focus:outline-none focus:ring-2 focus:ring-white/50 rounded
            transition-colors
            mt-0.5
          "
          aria-label="閉じる"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
