import type { HTMLAttributes } from 'react';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * 見出しのレベル（1-6）
   * @default 2
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * 見出しのテキスト
   */
  children: React.ReactNode;
}

const levelStyles = {
  1: 'text-4xl',
  2: 'text-3xl',
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-lg',
  6: 'text-base',
} as const;

/**
 * 汎用的な見出しコンポーネント
 * 動的タグパターンでシンプルに実装
 */
export function Heading({
  level = 2,
  children,
  className = '',
  ...props
}: HeadingProps) {
  const baseStyles =
    'text-center font-bold tracking-tight text-gray-900 dark:text-white';
  const combinedClassName = `${baseStyles} ${levelStyles[level]} ${className}`;

  // 動的タグコンポーネント
  const Tag = `h${level}` as const;

  return (
    <Tag className={combinedClassName} {...props}>
      {children}
    </Tag>
  );
}
