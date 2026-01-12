import type { HTMLAttributes } from "react";

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

/**
 * 汎用的な見出しコンポーネント
 */
export function Heading({
  level = 2,
  children,
  className = "",
  ...props
}: HeadingProps) {
  const baseStyles =
    "text-center font-bold tracking-tight text-gray-900 dark:text-white";

  const levelStyles = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
  };

  const combinedClassName = `${baseStyles} ${levelStyles[level]} ${className}`;

  switch (level) {
    case 1:
      return (
        <h1 className={combinedClassName} {...props}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={combinedClassName} {...props}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 className={combinedClassName} {...props}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 className={combinedClassName} {...props}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 className={combinedClassName} {...props}>
          {children}
        </h5>
      );
    case 6:
      return (
        <h6 className={combinedClassName} {...props}>
          {children}
        </h6>
      );
  }
}
