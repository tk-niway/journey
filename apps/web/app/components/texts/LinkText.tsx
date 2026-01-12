import { Link } from "react-router";
import type { LinkProps } from "react-router";

export interface LinkTextProps extends LinkProps {
  /**
   * リンクのテキスト
   */
  children: React.ReactNode;
}

/**
 * 汎用的なリンクテキストコンポーネント
 */
export function LinkText({
  children,
  className = "",
  ...props
}: LinkTextProps) {
  const baseStyles =
    "text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300";

  return (
    <Link className={`${baseStyles} ${className}`} {...props}>
      {children}
    </Link>
  );
}
