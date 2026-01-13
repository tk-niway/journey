import { Link, type LinkProps } from 'react-router';

export interface LinkButtonProps extends LinkProps {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

/**
 * ボタンスタイルのリンクコンポーネント
 * ページ遷移を伴うボタンに使用
 */
export function LinkButton({
  variant = 'primary',
  children,
  className = '',
  ...props
}: LinkButtonProps) {
  const baseStyles =
    'group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors';

  const variantStyles = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:outline-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    danger:
      'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600',
  };

  return (
    <Link className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
