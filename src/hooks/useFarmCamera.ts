import { useState, useCallback, useRef, useEffect } from 'react';

interface CameraState {
  x: number;
  y: number;
  scale: number;
}

interface UseFarmCameraOptions {
  worldWidth: number;
  worldHeight: number;
  minScale?: number;
  maxScale?: number;
  initialX?: number;
  initialY?: number;
}

export function useFarmCamera({
  worldWidth,
  worldHeight,
  minScale = 0.5,
  maxScale = 1.5,
  initialX,
  initialY,
}: UseFarmCameraOptions) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [camera, setCamera] = useState<CameraState>(() => ({
    x: initialX ?? -(worldWidth / 2 - 400),
    y: initialY ?? -(worldHeight / 2 - 300),
    scale: 1,
  }));

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

  const clampCamera = useCallback((x: number, y: number, scale: number) => {
    const vp = viewportRef.current;
    if (!vp) return { x, y };

    const vpW = vp.clientWidth;
    const vpH = vp.clientHeight;
    const scaledW = worldWidth * scale;
    const scaledH = worldHeight * scale;

    // Keep the world visible - allow modest overscroll (20%)
    // but the infinite ground ensures no empty space
    const minX = -(scaledW - vpW * 0.2);
    const maxX = vpW * 0.2;
    const minY = -(scaledH - vpH * 0.2);
    const maxY = vpH * 0.2;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  }, [worldWidth, worldHeight]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    velocity.current = { x: dx, y: dy };
    lastPos.current = { x: e.clientX, y: e.clientY };

    setCamera(prev => {
      const clamped = clampCamera(prev.x + dx, prev.y + dy, prev.scale);
      return { ...prev, ...clamped };
    });
  }, [clampCamera]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // Inertia
    const vx = velocity.current.x;
    const vy = velocity.current.y;
    if (Math.abs(vx) > 2 || Math.abs(vy) > 2) {
      let currentVx = vx * 0.8;
      let currentVy = vy * 0.8;

      const animate = () => {
        if (Math.abs(currentVx) < 0.5 && Math.abs(currentVy) < 0.5) return;

        currentVx *= 0.92;
        currentVy *= 0.92;

        setCamera(prev => {
          const clamped = clampCamera(prev.x + currentVx, prev.y + currentVy, prev.scale);
          return { ...prev, ...clamped };
        });

        animFrameRef.current = requestAnimationFrame(animate);
      };

      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, [clampCamera]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    cancelAnimationFrame(animFrameRef.current);

    if (e.touches.length === 1) {
      isDragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      velocity.current = { x: 0, y: 0 };
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      velocity.current = { x: dx, y: dy };
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      setCamera(prev => {
        const clamped = clampCamera(prev.x + dx, prev.y + dy, prev.scale);
        return { ...prev, ...clamped };
      });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (lastPinchDist.current > 0) {
        const scaleFactor = dist / lastPinchDist.current;
        setCamera(prev => {
          const newScale = Math.max(minScale, Math.min(maxScale, prev.scale * scaleFactor));
          const clamped = clampCamera(prev.x, prev.y, newScale);
          return { ...clamped, scale: newScale };
        });
      }

      lastPinchDist.current = dist;
    }
  }, [clampCamera, minScale, maxScale]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      isDragging.current = false;
      lastPinchDist.current = 0;

      // Inertia for touch
      const vx = velocity.current.x;
      const vy = velocity.current.y;
      if (Math.abs(vx) > 2 || Math.abs(vy) > 2) {
        let currentVx = vx * 0.8;
        let currentVy = vy * 0.8;

        const animate = () => {
          if (Math.abs(currentVx) < 0.5 && Math.abs(currentVy) < 0.5) return;

          currentVx *= 0.92;
          currentVy *= 0.92;

          setCamera(prev => {
            const clamped = clampCamera(prev.x + currentVx, prev.y + currentVy, prev.scale);
            return { ...prev, ...clamped };
          });

          animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);
      }
    } else if (e.touches.length === 1) {
      // Switched from pinch to single drag
      isDragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastPinchDist.current = 0;
    }
  }, [clampCamera]);

  // Mouse wheel zoom
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;

      setCamera(prev => {
        const newScale = Math.max(minScale, Math.min(maxScale, prev.scale * zoomFactor));
        const clamped = clampCamera(prev.x, prev.y, newScale);
        return { ...clamped, scale: newScale };
      });
    };

    vp.addEventListener('wheel', handleWheel, { passive: false });
    return () => vp.removeEventListener('wheel', handleWheel);
  }, [clampCamera, minScale, maxScale]);

  // Cleanup
  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return {
    viewportRef,
    camera,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
