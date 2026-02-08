import { useCallback, useRef, useState } from 'react';

interface BoundingBox {
  width: number;
  height: number;
}

interface ElementEntry {
  id: string;
  x: number;
  y: number;
  box: BoundingBox;
}

interface DragState {
  draggedId: string | null;
  dragX: number;
  dragY: number;
  hasCollision: boolean;
}

interface UseDragElementOptions {
  cameraScale: number;
  cameraLock: React.MutableRefObject<boolean>;
  onDrop: (id: string, x: number, y: number) => void;
  buildings: ElementEntry[];
  worldWidth: number;
  worldHeight: number;
  longPressDuration?: number;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  panBy: (dx: number, dy: number) => void;
}

// Edge zone size in px and max pan speed in px/frame
const EDGE_ZONE = 60;
const MAX_PAN_SPEED = 8;

export function useDragElement({
  cameraScale,
  cameraLock,
  onDrop,
  buildings,
  worldWidth,
  worldHeight,
  longPressDuration = 500,
  viewportRef,
  panBy,
}: UseDragElementOptions) {
  const [drag, setDrag] = useState<DragState>({
    draggedId: null,
    dragX: 0,
    dragY: 0,
    hasCollision: false,
  });

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startScreenPos = useRef({ x: 0, y: 0 });
  const isLongPressing = useRef(false);
  const activeDrag = useRef<{
    id: string;
    isBuilding: boolean;
    originX: number;
    originY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const pointerTarget = useRef<{ element: HTMLElement; pointerId: number } | null>(null);

  // Edge auto-scroll state
  const autoScrollRef = useRef<number>(0);
  const screenPos = useRef({ x: 0, y: 0 });
  const currentBoxRef = useRef<BoundingBox>({ width: 80, height: 80 });
  const currentIsBuildingRef = useRef(false);

  // --- Utility functions (order matters for deps) ---

  const checkCollision = useCallback(
    (id: string, x: number, y: number, box: BoundingBox): boolean => {
      for (const b of buildings) {
        if (b.id === id) continue;
        const overlapX = x < b.x + b.box.width && x + box.width > b.x;
        const overlapY = y < b.y + b.box.height && y + box.height > b.y;
        if (overlapX && overlapY) return true;
      }
      return false;
    },
    [buildings],
  );

  const clampToWorld = useCallback(
    (x: number, y: number): { x: number; y: number } => ({
      x: Math.max(0, Math.min(worldWidth - 160, x)),
      y: Math.max(0, Math.min(worldHeight - 150, y)),
    }),
    [worldWidth, worldHeight],
  );

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    isLongPressing.current = false;
  }, []);

  // --- Edge auto-scroll ---

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = 0;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) return;

    const tick = () => {
      if (!activeDrag.current) {
        autoScrollRef.current = 0;
        return;
      }

      const vp = viewportRef.current;
      if (!vp) {
        autoScrollRef.current = requestAnimationFrame(tick);
        return;
      }

      const rect = vp.getBoundingClientRect();
      const sx = screenPos.current.x;
      const sy = screenPos.current.y;

      let panX = 0;
      let panY = 0;

      const leftDepth = Math.max(0, EDGE_ZONE - (sx - rect.left)) / EDGE_ZONE;
      const rightDepth = Math.max(0, EDGE_ZONE - (rect.right - sx)) / EDGE_ZONE;
      const topDepth = Math.max(0, EDGE_ZONE - (sy - rect.top)) / EDGE_ZONE;
      const bottomDepth = Math.max(0, EDGE_ZONE - (rect.bottom - sy)) / EDGE_ZONE;

      if (leftDepth > 0) panX = MAX_PAN_SPEED * leftDepth;
      if (rightDepth > 0) panX = -MAX_PAN_SPEED * rightDepth;
      if (topDepth > 0) panY = MAX_PAN_SPEED * topDepth;
      if (bottomDepth > 0) panY = -MAX_PAN_SPEED * bottomDepth;

      if (panX !== 0 || panY !== 0) {
        panBy(panX, panY);

        // Shift element origin so it stays under the finger
        const ad = activeDrag.current;
        ad.originX -= panX / cameraScale;
        ad.originY -= panY / cameraScale;

        // Recalculate drag position
        const dx = (screenPos.current.x - startScreenPos.current.x) / cameraScale;
        const dy = (screenPos.current.y - startScreenPos.current.y) / cameraScale;
        const clamped = clampToWorld(ad.originX + dx, ad.originY + dy);
        const collision = currentIsBuildingRef.current
          ? checkCollision(ad.id, clamped.x, clamped.y, currentBoxRef.current)
          : false;

        setDrag({
          draggedId: ad.id,
          dragX: clamped.x,
          dragY: clamped.y,
          hasCollision: collision,
        });
      }

      autoScrollRef.current = requestAnimationFrame(tick);
    };

    autoScrollRef.current = requestAnimationFrame(tick);
  }, [viewportRef, panBy, cameraScale, clampToWorld, checkCollision]);

  // --- Per-element handlers ---

  const createHandlers = useCallback(
    (
      id: string,
      currentX: number,
      currentY: number,
      isBuilding: boolean,
      box: BoundingBox,
    ) => {
      const onPointerDown = (e: React.PointerEvent) => {
        if (activeDrag.current) return;

        startScreenPos.current = { x: e.clientX, y: e.clientY };
        screenPos.current = { x: e.clientX, y: e.clientY };
        isLongPressing.current = true;

        pointerTarget.current = {
          element: e.currentTarget as HTMLElement,
          pointerId: e.pointerId,
        };

        longPressTimer.current = setTimeout(() => {
          if (!isLongPressing.current) return;

          activeDrag.current = {
            id,
            isBuilding,
            originX: currentX,
            originY: currentY,
            offsetX: 0,
            offsetY: 0,
          };

          currentBoxRef.current = box;
          currentIsBuildingRef.current = isBuilding;
          cameraLock.current = true;

          if (navigator.vibrate) {
            navigator.vibrate(50);
          }

          const collision = isBuilding
            ? checkCollision(id, currentX, currentY, box)
            : false;

          setDrag({
            draggedId: id,
            dragX: currentX,
            dragY: currentY,
            hasCollision: collision,
          });

          // Start edge auto-scroll loop
          startAutoScroll();

          if (pointerTarget.current) {
            try {
              pointerTarget.current.element.setPointerCapture(
                pointerTarget.current.pointerId,
              );
            } catch {
              // pointer may have been released already
            }
          }
        }, longPressDuration);
      };

      const onPointerMove = (e: React.PointerEvent) => {
        // Update screen position for auto-scroll
        screenPos.current = { x: e.clientX, y: e.clientY };

        if (isLongPressing.current && !activeDrag.current) {
          const dx = e.clientX - startScreenPos.current.x;
          const dy = e.clientY - startScreenPos.current.y;
          if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            cancelLongPress();
          }
          return;
        }

        if (!activeDrag.current || activeDrag.current.id !== id) return;

        e.preventDefault();
        e.stopPropagation();

        const dx = (e.clientX - startScreenPos.current.x) / cameraScale;
        const dy = (e.clientY - startScreenPos.current.y) / cameraScale;

        const raw = {
          x: activeDrag.current.originX + dx,
          y: activeDrag.current.originY + dy,
        };
        const clamped = clampToWorld(raw.x, raw.y);

        const collision = isBuilding
          ? checkCollision(id, clamped.x, clamped.y, box)
          : false;

        setDrag({
          draggedId: id,
          dragX: clamped.x,
          dragY: clamped.y,
          hasCollision: collision,
        });
      };

      const onPointerUp = () => {
        cancelLongPress();
        stopAutoScroll();

        if (!activeDrag.current || activeDrag.current.id !== id) return;

        const current = activeDrag.current;
        const isB = current.isBuilding;

        setDrag((prev) => {
          if (isB && prev.hasCollision) {
            onDrop(id, current.originX, current.originY);
          } else {
            onDrop(id, prev.dragX, prev.dragY);
          }
          return { draggedId: null, dragX: 0, dragY: 0, hasCollision: false };
        });

        activeDrag.current = null;
        cameraLock.current = false;
      };

      return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
      };
    },
    [
      cameraScale,
      cameraLock,
      onDrop,
      checkCollision,
      clampToWorld,
      cancelLongPress,
      stopAutoScroll,
      startAutoScroll,
      longPressDuration,
    ],
  );

  return {
    drag,
    createHandlers,
  };
}
