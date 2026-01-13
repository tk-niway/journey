import type { HTMLAttributes } from 'react';

export interface BodyTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * 本文のテキスト
   */
  children: React.ReactNode;
  /**
   * テキストのサイズ
   * @default 'base'
   */
  size?: 'sm' | 'base' | 'lg';
  /**
   * テキストの色
   * @default 'default'
   */
  color?: 'default' | 'muted' | 'error';
}

/**
 * 汎用的な本文テキストコンポーネント
 */
export function BodyText({
  children,
  size = 'base',
  color = 'default',
  className = '',
  ...props
}: BodyTextProps) {
  const sizeStyles = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  const colorStyles = {
    default: 'text-gray-900 dark:text-gray-100',
    muted: 'text-gray-600 dark:text-gray-400',
    error: 'text-red-600 dark:text-red-400',
  };

  const combinedClassName = `${sizeStyles[size]} ${colorStyles[color]} ${className}`;

  return (
    <p className={combinedClassName} {...props}>
      {children}
    </p>
  );
}
