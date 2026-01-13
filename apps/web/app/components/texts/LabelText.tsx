import type { HTMLAttributes } from 'react';

export interface LabelTextProps extends HTMLAttributes<HTMLLabelElement> {
  /**
   * ラベルのテキスト
   */
  children: React.ReactNode;
  /**
   * 関連する要素のID（htmlFor属性）
   */
  htmlFor?: string;
}

/**
 * 汎用的なラベルテキストコンポーネント
 */
export function LabelText({
  children,
  htmlFor,
  className = '',
  ...props
}: LabelTextProps) {
  const baseStyles =
    'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <label
      className={`${baseStyles} ${className}`}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
}
