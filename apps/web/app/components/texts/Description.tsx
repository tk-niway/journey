import type { HTMLAttributes } from "react";

export interface DescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /**
   * 説明文のテキスト
   */
  children: React.ReactNode;
}

/**
 * 汎用的な説明文コンポーネント
 */
export function Description({
  children,
  className = "",
  ...props
}: DescriptionProps) {
  const baseStyles = "text-center text-sm text-gray-600 dark:text-gray-400";

  return (
    <p className={`${baseStyles} ${className}`} {...props}>
      {children}
    </p>
  );
}
