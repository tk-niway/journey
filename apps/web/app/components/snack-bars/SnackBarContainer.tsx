import { SnackBar } from './SnackBar';
import type { SnackBarItem } from '@contexts/SnackBarContext';

interface SnackBarContainerProps {
  snackBars: SnackBarItem[];
  onClose: (id: string) => void;
}

/**
 * SnackBarContainer
 * 複数のスナックバーを画面下部に積み重ねて表示するコンテナ
 */
export function SnackBarContainer({
  snackBars,
  onClose,
}: SnackBarContainerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="relative">
        {snackBars.map((snackBar, index) => (
          <div
            key={snackBar.id}
            className="pointer-events-auto"
            style={{
              transform: `translateY(-${index * 80}px)`,
            }}
          >
            <SnackBar
              id={snackBar.id}
              message={snackBar.message}
              variant={snackBar.variant}
              isVisible={snackBar.isVisible}
              isExiting={snackBar.isExiting}
              onClose={onClose}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
