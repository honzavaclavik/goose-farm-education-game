import { useCallback, RefObject } from 'react';

export function useTouchControls(
  containerRef: RefObject<HTMLDivElement | null>,
  onMove: (x: number) => void
) {
  const getXFromEvent = useCallback(
    (e: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent) => {
      if (!containerRef.current) return 0;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX =
        'touches' in e ? (e.touches[0]?.clientX ?? 0) : (e as MouseEvent).clientX;

      return clientX - rect.left;
    },
    [containerRef]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      onMove(getXFromEvent(e));
    },
    [getXFromEvent, onMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      onMove(getXFromEvent(e));
    },
    [getXFromEvent, onMove]
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
