interface CenteredLayoutProps {
  /** レイアウト内に表示するコンテンツ */
  children: React.ReactNode;
  /** 最大幅のサイズ（デフォルト: md） */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
} as const;

/**
 * 中央配置レイアウトコンポーネント
 * 認証ページやシンプルなフォームページで使用
 */
export function CenteredLayout({
  children,
  maxWidth = 'md',
}: CenteredLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className={`w-full ${maxWidthStyles[maxWidth]} space-y-8`}>
        {children}
      </div>
    </div>
  );
}
