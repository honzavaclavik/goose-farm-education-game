import { CSSProperties, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { CurrencyDisplay } from '../common/CurrencyDisplay';
import { ProgressBar } from '../common/ProgressBar';
import { useGameStore } from '../../store/gameStore';
import { useFarmStore } from '../../store/farmStore';
import { useProgressStore } from '../../store/progressStore';
import { useCurrencyStore } from '../../store/currencyStore';
import { useFarmProduction } from '../../hooks/useFarmProduction';
import { useGooseBonus } from '../../hooks/useGooseBonus';
import { useEggProduction } from '../../hooks/useEggProduction';
import { useSound } from '../../hooks/useSound';
import { useFarmCamera } from '../../hooks/useFarmCamera';
import { useGooseWalk } from '../../hooks/useGooseWalk';
import { useDragElement } from '../../hooks/useDragElement';
import { FarmBackground } from './FarmBackground';
import { FarmGround } from './FarmGround';
import { FarmBuildings } from './FarmBuildings';
import { GooseSVG } from './GooseSVG';

const WORLD_WIDTH = 2200;
const WORLD_HEIGHT = 1600;

const BUILDING_BOXES: Record<string, { width: number; height: number }> = {
  coop: { width: 160, height: 150 },
  field: { width: 200, height: 180 },
  mill: { width: 140, height: 180 },
  market: { width: 180, height: 140 },
};

const GOOSE_BOX = { width: 80, height: 80 };

// Default building layout positions (used for initial placement)
function getBuildingWorldPosition(type: string, index: number): { x: number; y: number } {
  switch (type) {
    case 'coop':
      return { x: 200 + (index % 2) * 350, y: 250 + Math.floor(index / 2) * 300 };
    case 'field':
      return { x: 850, y: 200 + index * 300 };
    case 'mill':
      return { x: 550, y: 120 + index * 300 };
    case 'market':
      return { x: 1050, y: 400 + index * 300 };
    default:
      return { x: 400 + index * 200, y: 500 };
  }
}

export function FarmView() {
  const { setScreen } = useGameStore();
  const { geese, buildings, getGooseCapacity, positions, updatePosition } = useFarmStore();
  const { level, xp, xpToNextLevel } = useProgressStore();
  const { grain } = useCurrencyStore();
  const { feedingCost, feedGeese } = useFarmProduction();
  const { isAnyGooseHungry } = useGooseBonus();
  const { collectEgg, hasEgg } = useEggProduction();
  const { addEggs } = useCurrencyStore();
  const { play } = useSound();

  const [collectingEggs, setCollectingEggs] = useState<string[]>([]);
  const [feedMessage, setFeedMessage] = useState<string | null>(null);

  // Compute bounding box of all objects for initial camera fit
  const objectsBounds = useMemo(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let count = 0;

    buildings.forEach((building) => {
      const box = BUILDING_BOXES[building.type] ?? { width: 160, height: 150 };
      let pos = positions[building.id];
      if (!pos) {
        const buildingIndex = buildings
          .filter((b) => b.type === building.type)
          .indexOf(building);
        pos = getBuildingWorldPosition(building.type, buildingIndex);
      }
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + box.width);
      maxY = Math.max(maxY, pos.y + box.height);
      count++;
    });

    geese.forEach((goose) => {
      const pos = positions[goose.id];
      if (pos) {
        minX = Math.min(minX, pos.x);
        minY = Math.min(minY, pos.y);
        maxX = Math.max(maxX, pos.x + 80);
        maxY = Math.max(maxY, pos.y + 80);
        count++;
      }
    });

    if (count === 0) return null;
    return { minX, minY, maxX, maxY };
  }, [buildings, geese, positions]);

  // Camera (drag & zoom)
  const { viewportRef, camera, dragLocked, panBy, handlers } = useFarmCamera({
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    focusBounds: objectsBounds,
  });

  // Initialize positions for buildings that don't have one yet
  useEffect(() => {
    buildings.forEach((building) => {
      if (!positions[building.id]) {
        const buildingIndex = buildings
          .filter((b) => b.type === building.type)
          .indexOf(building);
        const pos = getBuildingWorldPosition(building.type, buildingIndex);
        updatePosition(building.id, pos.x, pos.y);
      }
    });
  }, [buildings, positions, updatePosition]);

  // Get resolved position for a building (from store or default)
  const getBuildingPos = useCallback(
    (buildingId: string, type: string, index: number) => {
      if (positions[buildingId]) return positions[buildingId];
      return getBuildingWorldPosition(type, index);
    },
    [positions],
  );

  // Build entries list for collision detection
  const buildingEntries = useMemo(
    () =>
      buildings.map((building) => {
        const buildingIndex = buildings
          .filter((b) => b.type === building.type)
          .indexOf(building);
        const pos = getBuildingPos(building.id, building.type, buildingIndex);
        const box = BUILDING_BOXES[building.type] ?? { width: 160, height: 150 };
        return { id: building.id, x: pos.x, y: pos.y, box };
      }),
    [buildings, getBuildingPos],
  );

  // Drag handler
  const handleDrop = useCallback(
    (id: string, x: number, y: number) => {
      updatePosition(id, x, y);
    },
    [updatePosition],
  );

  const { drag, createHandlers } = useDragElement({
    cameraScale: camera.scale,
    cameraLock: dragLocked,
    onDrop: handleDrop,
    buildings: buildingEntries,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    viewportRef,
    panBy,
  });

  // Calculate coop centers for goose walking — use dynamic positions
  // If a goose was manually dragged, use its stored position as wander center
  const coopCenters = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const coops = buildings.filter((b) => b.type === 'coop');

    geese.forEach((goose, gooseIndex) => {
      // If goose has a stored position (was manually placed), use it as wander center
      const storedPos = positions[goose.id];
      if (storedPos) {
        map.set(goose.id, { x: storedPos.x + 40, y: storedPos.y + 40 });
        return;
      }

      const coopIndex = coops.length > 0 ? gooseIndex % coops.length : 0;
      const coop = coops[coopIndex];
      if (coop) {
        const buildingIndex = buildings.filter((b) => b.type === 'coop').indexOf(coop);
        const pos = getBuildingPos(coop.id, 'coop', buildingIndex);
        const angle = ((gooseIndex * 137.5 + 200) % 360) * Math.PI / 180;
        const dist = 180 + (gooseIndex % 3) * 40;
        map.set(goose.id, {
          x: pos.x + 80 + Math.cos(angle) * dist,
          y: pos.y + 75 + Math.sin(angle) * dist,
        });
      } else {
        map.set(goose.id, { x: 400, y: 400 });
      }
    });

    return map;
  }, [geese, buildings, getBuildingPos, positions]);

  // Set of goose IDs that have been manually placed (have stored positions)
  const manuallyPlacedGooseIds = useMemo(() => {
    const set = new Set<string>();
    geese.forEach((g) => {
      if (positions[g.id]) set.add(g.id);
    });
    return set;
  }, [geese, positions]);

  const goosePositions = useGooseWalk({
    gooseIds: geese.map((g) => g.id),
    coopCenters,
    manuallyPlacedIds: manuallyPlacedGooseIds,
    wanderRadius: 150,
    interval: 3500,
  });

  const handleFeedGeese = useCallback(() => {
    const result = feedGeese();
    if (result.success && result.fedGeese > 0) {
      play('feed');
      setFeedMessage(`Nakrmeno ${result.fedGeese} hus! (-${result.cost} zrní)`);
    } else if (!result.success) {
      play('wrong');
      setFeedMessage(`Nemáš dost zrní! Potřebuješ ${result.cost} zrní.`);
    }
    setTimeout(() => setFeedMessage(null), 2500);
  }, [feedGeese, play]);

  const handleCollectEgg = useCallback((gooseId: string) => {
    // Don't collect egg during drag
    if (drag.draggedId) return;
    if (collectingEggs.includes(gooseId)) return;

    const eggsCollected = collectEgg(gooseId);
    if (eggsCollected === 0) return;

    addEggs(eggsCollected);
    play('collect');

    setCollectingEggs((prev) => [...prev, gooseId]);
    setFeedMessage(`+${eggsCollected} vejce!`);
    setTimeout(() => {
      setCollectingEggs((prev) => prev.filter((id) => id !== gooseId));
      setFeedMessage(null);
    }, 600);
  }, [collectingEggs, collectEgg, addEggs, play, drag.draggedId]);

  const capacity = getGooseCapacity();

  const isDragging = drag.draggedId !== null;

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 'var(--space-3) var(--space-4)',
    background: 'var(--texture-wood)',
    borderBottom: '3px solid var(--color-wood-border)',
    flexWrap: 'wrap',
    gap: 'var(--space-3)',
    boxShadow: '0 4px 12px rgba(90, 62, 34, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
    zIndex: 10,
    flexShrink: 0,
  };

  const levelBadgeStyle: CSSProperties = {
    background: 'radial-gradient(circle at 30% 30%, var(--color-gold-light) 0%, var(--color-gold) 50%, var(--color-gold-dark) 100%)',
    color: 'white',
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--radius-full)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    fontSize: 'var(--text-base)',
    textShadow: 'var(--text-outline-dark)',
    border: '2px solid var(--color-gold-dark)',
    boxShadow: '0 2px 8px rgba(212, 160, 23, 0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
  };

  const xpContainerStyle: CSSProperties = {
    width: '120px',
    marginTop: '4px',
  };

  const viewportStyle: CSSProperties = {
    flex: 1,
    minHeight: 0,
    position: 'relative',
    overflow: 'hidden',
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
  };

  const worldStyle: CSSProperties = {
    position: 'absolute',
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
    transformOrigin: '0 0',
    willChange: 'transform',
    overflow: 'visible',
  };

  const capacityStyle: CSSProperties = {
    background: 'var(--texture-wood)',
    padding: 'var(--space-2) var(--space-5)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'white',
    textShadow: 'var(--text-outline-brown)',
    boxShadow: 'var(--shadow-wood-panel)',
    border: '2px solid var(--color-wood-border)',
    display: 'inline-block',
  };

  const warningStyle: CSSProperties = {
    color: '#ff5722',
    fontSize: '12px',
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
  };

  const toastContainerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 1000,
    padding: 'var(--space-3)',
    paddingTop: '70px',
  };

  const toastStyle: CSSProperties = {
    background: 'linear-gradient(180deg, rgba(40,30,15,0.92) 0%, rgba(55,40,20,0.95) 100%)',
    color: '#f5e6c8',
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-base)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
    border: '1px solid rgba(212,160,23,0.4)',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    pointerEvents: 'auto',
    whiteSpace: 'nowrap',
  };

  const bottomBarStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-2)',
    padding: 'var(--space-3) var(--space-4)',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    background: 'var(--texture-stone)',
    borderTop: '3px solid var(--color-stone-dark)',
    zIndex: 10,
    boxShadow: '0 -4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    flexShrink: 0,
  };

  const statusBarStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: 'var(--space-2) var(--space-4)',
    justifyContent: 'center',
    flexWrap: 'wrap',
    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
    zIndex: 5,
    pointerEvents: 'none',
  };

  const statusItemStyle: CSSProperties = {
    pointerEvents: 'auto',
  };

  return (
    <div style={containerStyle}>
      <FarmBackground />

      {/* Header HUD */}
      <div style={headerStyle}>
        <div>
          <div style={levelBadgeStyle}>
            Level {level}
          </div>
          <div style={xpContainerStyle}>
            <ProgressBar
              current={xp}
              max={xpToNextLevel}
              color="#9c27b0"
              height={10}
              showLabel={false}
            />
          </div>
        </div>
        <CurrencyDisplay />
      </div>

      {/* Draggable farm viewport */}
      <div
        ref={viewportRef}
        style={viewportStyle}
        {...handlers}
      >
        <div style={worldStyle}>
          {/* Ground with grass, paths, decorations */}
          <FarmGround worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} />

          {/* Buildings */}
          {buildings.map((building) => {
            const buildingIndex = buildings
              .filter((b) => b.type === building.type)
              .indexOf(building);
            const pos = getBuildingPos(building.id, building.type, buildingIndex);
            const box = BUILDING_BOXES[building.type] ?? { width: 160, height: 150 };

            const isBeingDragged = drag.draggedId === building.id;
            const displayX = isBeingDragged ? drag.dragX : pos.x;
            const displayY = isBeingDragged ? drag.dragY : pos.y;

            const dragHandlers = createHandlers(
              building.id,
              pos.x,
              pos.y,
              true,
              box,
            );

            return (
              <div
                key={building.id}
                style={{
                  position: 'absolute',
                  left: displayX,
                  top: displayY,
                  width: `${box.width}px`,
                  height: `${box.height}px`,
                  zIndex: isBeingDragged ? 100 : 2,
                  transition: isBeingDragged ? 'none' : 'left 0.3s ease-out, top 0.3s ease-out',
                  transform: isBeingDragged ? 'scale(1.1)' : 'scale(1)',
                  filter: isBeingDragged
                    ? drag.hasCollision
                      ? 'drop-shadow(0 4px 8px rgba(255,0,0,0.5))'
                      : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    : isDragging
                      ? 'opacity(0.6)'
                      : 'none',
                  opacity: isDragging && !isBeingDragged ? 0.6 : 1,
                  cursor: 'pointer',
                  touchAction: 'none',
                }}
                {...dragHandlers}
              >
                {/* Collision indicator */}
                {isBeingDragged && drag.hasCollision && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -4,
                      border: '3px solid rgba(255, 60, 60, 0.7)',
                      borderRadius: '8px',
                      pointerEvents: 'none',
                      animation: 'shake 0.3s ease-in-out infinite',
                    }}
                  />
                )}
                {/* Valid position indicator */}
                {isBeingDragged && !drag.hasCollision && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -4,
                      border: '3px solid rgba(76, 175, 80, 0.6)',
                      borderRadius: '8px',
                      pointerEvents: 'none',
                    }}
                  />
                )}
                <FarmBuildings buildings={[building]} />
              </div>
            );
          })}

          {/* Free-roaming geese */}
          {geese.map((goose) => {
            const pos = goosePositions.find((p) => p.id === goose.id);
            if (!pos) return null;

            const isBeingDragged = drag.draggedId === goose.id;
            const displayX = isBeingDragged ? drag.dragX : pos.x - 40;
            const displayY = isBeingDragged ? drag.dragY : pos.y - 40;

            const dragHandlers = createHandlers(
              goose.id,
              pos.x - 40,
              pos.y - 40,
              false,
              GOOSE_BOX,
            );

            return (
              <div
                key={goose.id}
                style={{
                  position: 'absolute',
                  left: displayX,
                  top: displayY,
                  width: '80px',
                  height: '80px',
                  zIndex: isBeingDragged ? 100 : 3,
                  transition: isBeingDragged
                    ? 'none'
                    : 'left 2.5s ease-in-out, top 2.5s ease-in-out',
                  transform: isBeingDragged
                    ? 'scale(1.15)'
                    : pos.facingLeft
                      ? 'scaleX(-1)'
                      : 'scaleX(1)',
                  filter: isBeingDragged
                    ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    : undefined,
                  opacity: isDragging && !isBeingDragged ? 0.6 : 1,
                  cursor: 'pointer',
                  touchAction: 'none',
                }}
                {...dragHandlers}
              >
                <GooseSVG
                  rarity={goose.rarity}
                  isCollecting={collectingEggs.includes(goose.id)}
                  animationDelay={geese.indexOf(goose) * 0.3}
                  onClick={() => handleCollectEgg(goose.id)}
                  name={goose.name}
                  eggProduction={goose.eggProduction}
                  isHungry={isAnyGooseHungry}
                  hasEgg={hasEgg(goose.id)}
                  facingLeft={pos.facingLeft}
                />
              </div>
            );
          })}

          {/* Empty state */}
          {geese.length === 0 && (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: 'var(--text-xl)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)',
              textShadow: 'var(--text-outline-dark)',
              zIndex: 4,
              background: 'rgba(0,0,0,0.3)',
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-lg)',
            }}>
              Zatím nemáš žádné husy!
            </div>
          )}
        </div>

        {/* Status overlay at bottom of viewport */}
        <div style={statusBarStyle}>
          <div style={statusItemStyle}>
            <div style={capacityStyle}>
              {geese.length}/{capacity} hus
            </div>
          </div>
          {geese.length > 0 && (
            <div style={statusItemStyle}>
              {isAnyGooseHungry ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button onClick={handleFeedGeese} variant="warning" size="small">
                    Nakrmit husy ({feedingCost} zrní)
                  </Button>
                  {grain < feedingCost && <div style={warningStyle}>Málo zrní!</div>}
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(180deg, #66bb6a 0%, #43a047 100%)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'var(--font-bold)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-sm)',
                  borderBottom: '3px solid #2e7d32',
                  textShadow: 'var(--text-outline-dark)',
                }}>
                  Nakrmené
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {feedMessage && (
          <div style={toastContainerStyle}>
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={toastStyle}
            >
              {feedMessage}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <div style={bottomBarStyle}>
        <Button onClick={() => setScreen('minigameSelector')} variant="success" size="large">
          🎮 Hrát mini-hru
        </Button>
        <Button onClick={() => setScreen('shop')} variant="primary">
          🛒 Obchod
        </Button>
        <Button onClick={() => setScreen('dailyChallenges')} variant="warning">
          📅 Výzvy
        </Button>
        <Button onClick={() => setScreen('achievements')} variant="secondary">
          🏆 Úspěchy
        </Button>
        <Button onClick={() => setScreen('mainMenu')} variant="secondary">
          🏠 Menu
        </Button>
      </div>

      {/* CSS animation for collision shake */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
