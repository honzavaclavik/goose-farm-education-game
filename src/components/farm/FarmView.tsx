import { CSSProperties, useState, useCallback, useMemo } from 'react';
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
import { FarmBackground } from './FarmBackground';
import { FarmGround } from './FarmGround';
import { FarmBuildings } from './FarmBuildings';
import { GooseSVG } from './GooseSVG';

const WORLD_WIDTH = 1400;
const WORLD_HEIGHT = 1000;

// Building layout positions on the world map
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
  const { geese, buildings, getGooseCapacity } = useFarmStore();
  const { level, xp, xpToNextLevel } = useProgressStore();
  const { grain } = useCurrencyStore();
  const { feedingCost, feedGeese } = useFarmProduction();
  const { isAnyGooseHungry } = useGooseBonus();
  const { collectEgg, hasEgg } = useEggProduction();
  const { addEggs } = useCurrencyStore();
  const { play } = useSound();

  const [collectingEggs, setCollectingEggs] = useState<string[]>([]);
  const [feedMessage, setFeedMessage] = useState<string | null>(null);

  // Camera (drag & zoom)
  const { viewportRef, camera, handlers } = useFarmCamera({
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
  });

  // Calculate coop centers for goose walking
  const coopCenters = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const coops = buildings.filter((b) => b.type === 'coop');

    geese.forEach((goose, gooseIndex) => {
      // Assign each goose to a coop (round-robin)
      const coopIndex = coops.length > 0 ? gooseIndex % coops.length : 0;
      const coop = coops[coopIndex];
      if (coop) {
        const buildingIndex = buildings.filter((b) => b.type === 'coop').indexOf(coop);
        const pos = getBuildingWorldPosition('coop', buildingIndex);
        // Building center is at (pos.x + 80, pos.y + 75) and is ~160x150
        // Place each goose's wander center in a ring around the building
        // using golden angle for even distribution
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
  }, [geese, buildings]);

  const goosePositions = useGooseWalk({
    gooseIds: geese.map((g) => g.id),
    coopCenters,
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
  }, [collectingEggs, collectEgg, addEggs, play]);

  const capacity = getGooseCapacity();

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
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
    position: 'relative',
    overflow: 'hidden',
    cursor: 'grab',
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

  const feedMessageStyle: CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'var(--texture-parchment)',
    color: 'var(--color-wood-dark)',
    padding: 'var(--space-5) var(--space-8)',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    zIndex: 1000,
    boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
    border: 'var(--border-gold-frame)',
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
            const pos = getBuildingWorldPosition(building.type, buildingIndex);
            return (
              <div
                key={building.id}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  width: '160px',
                  height: '150px',
                  zIndex: 2,
                  transition: 'transform 0.2s',
                }}
              >
                <FarmBuildings buildings={[building]} />
              </div>
            );
          })}

          {/* Free-roaming geese */}
          {geese.map((goose) => {
            const pos = goosePositions.find((p) => p.id === goose.id);
            if (!pos) return null;

            return (
              <div
                key={goose.id}
                style={{
                  position: 'absolute',
                  left: pos.x - 40,
                  top: pos.y - 40,
                  width: '80px',
                  height: '80px',
                  zIndex: 3,
                  transition: 'left 2.5s ease-in-out, top 2.5s ease-in-out',
                  transform: pos.facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
                }}
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

      {/* Feed message popup */}
      <AnimatePresence>
        {feedMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={feedMessageStyle}
          >
            {feedMessage}
          </motion.div>
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
    </div>
  );
}
