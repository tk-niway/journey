import {
  createContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { SnackBarContainer } from '@app/components/snack-bars/SnackBarContainer';
import type { SnackBarVariant } from '@app/components/snack-bars/SnackBar';

export interface SnackBarItem {
  id: string;
  message: string;
  variant: SnackBarVariant;
  duration?: number;
  isVisible: boolean;
  isExiting: boolean;
}

interface SnackBarContextValue {
  showSnackBar: (
    message: string,
    variant?: SnackBarVariant,
    duration?: number
  ) => void;
  snackBars: SnackBarItem[];
  removeSnackBar: (id: string) => void;
  startExiting: (id: string) => void;
}

export const SnackBarContext = createContext<SnackBarContextValue | null>(null);

interface SnackBarProviderProps {
  children: React.ReactNode;
}

/**
 * SnackBarProvider
 * アプリケーション全体でSnackBarを管理するProvider
 */
export function SnackBarProvider({ children }: SnackBarProviderProps) {
  const [snackBars, setSnackBars] = useState<SnackBarItem[]>([]);
  const showTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const hideTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const exitTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const showSnackBar = useCallback(
    (message: string, variant: SnackBarVariant = 'info', duration?: number) => {
      const id = `snackbar-${Date.now()}-${Math.random()}`;
      const newSnackBar: SnackBarItem = {
        id,
        message,
        variant,
        duration,
        isVisible: false,
        isExiting: false,
      };

      setSnackBars((prev) => [...prev, newSnackBar]);
    },
    []
  );

  const removeSnackBar = useCallback((id: string) => {
    // 全てのタイマーをクリーンアップ
    const showTimer = showTimersRef.current.get(id);
    if (showTimer) {
      clearTimeout(showTimer);
      showTimersRef.current.delete(id);
    }
    const hideTimer = hideTimersRef.current.get(id);
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimersRef.current.delete(id);
    }
    const exitTimer = exitTimersRef.current.get(id);
    if (exitTimer) {
      clearTimeout(exitTimer);
      exitTimersRef.current.delete(id);
    }
    setSnackBars((prev) => prev.filter((snackBar) => snackBar.id !== id));
  }, []);

  const startExiting = useCallback(
    (id: string) => {
      setSnackBars((prev) =>
        prev.map((snackBar) =>
          snackBar.id === id ? { ...snackBar, isExiting: true } : snackBar
        )
      );
      // アニメーション完了後に削除
      const timer = setTimeout(() => {
        removeSnackBar(id);
      }, 300); // アニメーション時間と合わせる
      exitTimersRef.current.set(id, timer);
    },
    [removeSnackBar]
  );

  // 各SnackBarのタイマーを管理
  useEffect(() => {
    const cleanupTimers: NodeJS.Timeout[] = [];

    snackBars.forEach((snackBar) => {
      // 既にタイマーが設定されている場合はスキップ
      if (
        showTimersRef.current.has(snackBar.id) ||
        hideTimersRef.current.has(snackBar.id)
      ) {
        return;
      }

      // フェードインタイマー
      const showTimer = setTimeout(() => {
        setSnackBars((prev) =>
          prev.map((item) =>
            item.id === snackBar.id ? { ...item, isVisible: true } : item
          )
        );
        showTimersRef.current.delete(snackBar.id);
      }, 10);
      showTimersRef.current.set(snackBar.id, showTimer);
      cleanupTimers.push(showTimer);

      // 自動非表示タイマー（durationが指定されている場合のみ）
      if (snackBar.duration !== undefined) {
        const hideTimer = setTimeout(() => {
          startExiting(snackBar.id);
          hideTimersRef.current.delete(snackBar.id);
        }, snackBar.duration);
        hideTimersRef.current.set(snackBar.id, hideTimer);
        cleanupTimers.push(hideTimer);
      }
    });

    // クリーンアップ関数
    return () => {
      cleanupTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [snackBars, startExiting]);

  const value = useMemo(
    () => ({
      showSnackBar,
      snackBars,
      removeSnackBar,
      startExiting,
    }),
    [showSnackBar, snackBars, removeSnackBar, startExiting]
  );

  return (
    <SnackBarContext.Provider value={value}>
      {children}
      <SnackBarContainer snackBars={snackBars} onClose={startExiting} />
    </SnackBarContext.Provider>
  );
}
