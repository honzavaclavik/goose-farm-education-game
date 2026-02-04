import { useEffect, useRef } from 'react';

export function useGameLoop(callback: () => void, isRunning: boolean) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isRunning) return;

    const loop = () => {
      callbackRef.current();
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isRunning]);
}
