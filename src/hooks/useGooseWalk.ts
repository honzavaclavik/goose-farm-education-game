import { useState, useEffect, useRef } from 'react';

interface GoosePosition {
  id: string;
  x: number;
  y: number;
  facingLeft: boolean;
}

interface UseGooseWalkOptions {
  gooseIds: string[];
  /** Center position of the coop each goose belongs to */
  coopCenters: Map<string, { x: number; y: number }>;
  /** Radius of wandering area around coop */
  wanderRadius?: number;
  /** Interval between position changes (ms) */
  interval?: number;
}

export function useGooseWalk({
  gooseIds,
  coopCenters,
  wanderRadius = 90,
  interval = 4000,
}: UseGooseWalkOptions): GoosePosition[] {
  const [positions, setPositions] = useState<GoosePosition[]>(() =>
    gooseIds.map((id) => {
      const center = coopCenters.get(id) ?? { x: 400, y: 400 };
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * wanderRadius * 0.5;
      return {
        id,
        x: center.x + Math.cos(angle) * dist,
        y: center.y + Math.sin(angle) * dist,
        facingLeft: Math.random() > 0.5,
      };
    })
  );

  const prevIdsRef = useRef<string[]>([]);

  // Update positions when goose list changes
  useEffect(() => {
    const prevIds = prevIdsRef.current;
    const newIds = gooseIds.filter((id) => !prevIds.includes(id));
    const removedIds = prevIds.filter((id) => !gooseIds.includes(id));

    if (newIds.length > 0 || removedIds.length > 0) {
      setPositions((prev) => {
        const filtered = prev.filter((p) => gooseIds.includes(p.id));
        const added = newIds.map((id) => {
          const center = coopCenters.get(id) ?? { x: 400, y: 400 };
          return {
            id,
            x: center.x,
            y: center.y,
            facingLeft: false,
          };
        });
        return [...filtered, ...added];
      });
    }

    prevIdsRef.current = gooseIds;
  }, [gooseIds, coopCenters]);

  // Random walk interval
  useEffect(() => {
    if (gooseIds.length === 0) return;

    const timer = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          // Only move some geese each tick (50% chance)
          if (Math.random() > 0.5) return pos;

          const center = coopCenters.get(pos.id) ?? { x: 400, y: 400 };
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * wanderRadius;
          const newX = center.x + Math.cos(angle) * dist;
          const newY = center.y + Math.sin(angle) * dist;

          return {
            ...pos,
            x: newX,
            y: newY,
            facingLeft: newX < pos.x,
          };
        })
      );
    }, interval);

    return () => clearInterval(timer);
  }, [gooseIds.length, coopCenters, wanderRadius, interval]);

  return positions;
}
