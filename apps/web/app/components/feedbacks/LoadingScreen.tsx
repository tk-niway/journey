import { BodyText } from '@components/texts/BodyText';

interface LoadingScreenProps {
  /** 表示するメッセージ */
  message?: string;
}

/**
 * 全画面ローディング表示コンポーネント
 * ページ遷移や認証チェック中に使用
 */
export function LoadingScreen({
  message = '読み込み中...',
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-6">
      {/* アニメーション付きスピナー */}
      <div className="relative">
        {/* 外側のリング */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        {/* 回転するリング */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
      </div>

      {/* パルスするドット */}
      <div className="flex gap-2">
        <div
          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <div
          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>

      {/* メッセージ */}
      <BodyText color="muted" className="animate-pulse">
        {message}
      </BodyText>
    </div>
  );
}
