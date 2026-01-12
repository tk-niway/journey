import type { ButtonHTMLAttributes } from "react";

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  children: React.ReactNode;
}

/**
 * 汎用的なボタンコンポーネント
 */
export function BaseButton({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}: BaseButtonProps) {
  const baseStyles =
    "group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:outline-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
    danger:
      "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600",
  };

  return (
    <button
      type={props.type || "button"}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? "処理中..." : children}
    </button>
  );
}
