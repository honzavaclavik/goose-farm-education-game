import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';

interface CameraState {
  x: number;
  y: number;
  scale: number;
}

interface FocusBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface UseFarmCameraOptions {
  worldWidth: number;
  worldHeight: number;
  minScale?: number;
  maxScale?: number;
  initialX?: number;
  initialY?: number;
  /** Bounding box of all objects — camera will fit & center on this area */
  focusBounds?: FocusBounds | null;
}

export function useFarmCamera({
  worldWidth,
  worldHeight,
  minScale = 0.5,
  maxScale = 1.5,
  initialX,
  initialY,
  focusBounds,
}: UseFarmCameraOptions) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [camera, setCamera] = useState<CameraState>({
    x: initialX ?? 0,
    y: initialY ?? 0,
    scale: 1,
  });
  const hasInitialized = useRef(false);

  // When true, camera ignores all pan/zoom events (element drag in progress)
  const dragLocked = useRef(false);

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

    // Symmetric clamping: equal overscroll margin on all sides
    const marginX = vpW * 0.3;
    const marginY = vpH * 0.3;
    const minX = vpW - scaledW - marginX;
    const maxX = marginX;
    const minY = vpH - scaledH - marginY;
    const maxY = marginY;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  }, [worldWidth, worldHeight]);

  // Fit-to-view on mount: calculate scale and center based on actual viewport
  // useLayoutEffect ensures we measure after DOM paint but before user sees it
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp || hasInitialized.current) return;

    const vpW = vp.clientWidth;
    const vpH = vp.clientHeight;
    if (vpW === 0 || vpH === 0) return; // not laid out yet

    hasInitialized.current = true;

    let scale: number;
    let x: number;
    let y: number;

    if (focusBounds) {
      const boundsW = focusBounds.maxX - focusBounds.minX;
      const boundsH = focusBounds.maxY - focusBounds.minY;
      const centerX = (focusBounds.minX + focusBounds.maxX) / 2;
      const centerY = (focusBounds.minY + focusBounds.maxY) / 2;

      // Fit objects bounding box into viewport with generous padding
      const padding = 0.75; // 75% of viewport used — leaves room around objects
      const fitW = boundsW > 0 ? (vpW * padding) / boundsW : maxScale;
      const fitH = boundsH > 0 ? (vpH * padding) / boundsH : maxScale;
      scale = Math.max(minScale, Math.min(maxScale, Math.min(fitW, fitH)));

      // Center on bounds center
      x = vpW / 2 - centerX * scale;
      y = vpH / 2 - centerY * scale;
      const clamped = clampCamera(x, y, scale);
      x = clamped.x;
      y = clamped.y;
    } else {
      // Fallback: fit entire world
      const padding = 0.9;
      const fitScale = Math.min(
        (vpW * padding) / worldWidth,
        (vpH * padding) / worldHeight,
      );
      scale = Math.max(minScale, Math.min(maxScale, fitScale));
      x = (vpW - worldWidth * scale) / 2;
      y = (vpH - worldHeight * scale) / 2;
    }

    setCamera({ x, y, scale });
  }, [worldWidth, worldHeight, minScale, maxScale, focusBounds, clampCamera]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (dragLocked.current) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragLocked.current || !isDragging.current) return;

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
    if (dragLocked.current) return;
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
    if (dragLocked.current) return;
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
      const tdx = e.touches[0].clientX - e.touches[1].clientX;
      const tdy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(tdx * tdx + tdy * tdy);

      if (lastPinchDist.current > 0) {
        const scaleFactor = dist / lastPinchDist.current;

        // Pinch center (midpoint between two fingers)
        const vp = viewportRef.current;
        const rect = vp?.getBoundingClientRect();
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - (rect?.left ?? 0);
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - (rect?.top ?? 0);

        setCamera(prev => {
          const newScale = Math.max(minScale, Math.min(maxScale, prev.scale * scaleFactor));
          const worldX = (midX - prev.x) / prev.scale;
          const worldY = (midY - prev.y) / prev.scale;
          const newX = midX - worldX * newScale;
          const newY = midY - worldY * newScale;
          const clamped = clampCamera(newX, newY, newScale);
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
      if (dragLocked.current) return;
      const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;

      // Zoom towards cursor position
      const rect = vp.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      setCamera(prev => {
        const newScale = Math.max(minScale, Math.min(maxScale, prev.scale * zoomFactor));
        // Keep the world point under the cursor fixed:
        // cursorX = worldX * oldScale + oldX  =>  worldX = (cursorX - oldX) / oldScale
        // cursorX = worldX * newScale + newX  =>  newX = cursorX - worldX * newScale
        const worldX = (cursorX - prev.x) / prev.scale;
        const worldY = (cursorY - prev.y) / prev.scale;
        const newX = cursorX - worldX * newScale;
        const newY = cursorY - worldY * newScale;
        const clamped = clampCamera(newX, newY, newScale);
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

  // Programmatic pan (used by drag auto-scroll)
  const panBy = useCallback((dx: number, dy: number) => {
    setCamera(prev => {
      const clamped = clampCamera(prev.x + dx, prev.y + dy, prev.scale);
      return { ...prev, ...clamped };
    });
  }, [clampCamera]);

  return {
    viewportRef,
    camera,
    dragLocked,
    panBy,
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
