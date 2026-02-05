import { CSSProperties, useState, useCallback } from 'react';
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
import { FarmBackground } from './FarmBackground';
import { FarmBuildings } from './FarmBuildings';
import { GooseSVG } from './GooseSVG';

const FenceDecoration = () => (
  <svg viewBox="0 0 400 30" style={{
    width: '380px',
    height: '30px',
    marginTop: '-4px',
  }}>
    {/* Fence posts */}
    {[20, 80, 140, 200, 260, 320, 380].map((x, i) => (
      <g key={i}>
        <rect x={x - 3} y="2" width="6" height="26" fill="#8D6E63" rx="1" />
        <rect x={x - 4} y="0" width="8" height="4" fill="#A1887F" rx="1" />
      </g>
    ))}
    {/* Rails */}
    <rect x="17" y="8" width="366" height="4" fill="#A1887F" rx="1" />
    <rect x="17" y="20" width="366" height="4" fill="#A1887F" rx="1" />
  </svg>
);

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

  const handleFeedGeese = useCallback(() => {
    const result = feedGeese();
    if (result.success && result.fedGeese > 0) {
      play('feed');
      setFeedMessage(`🌾 Nakrmeno ${result.fedGeese} hus! (-${result.cost} zrní)`);
    } else if (!result.success) {
      play('wrong');
      setFeedMessage(`❌ Nemáš dost zrní! Potřebuješ ${result.cost} zrní.`);
    }
    setTimeout(() => setFeedMessage(null), 2500);
  }, [feedGeese, play]);

  const handleCollectEgg = useCallback((gooseId: string) => {
    if (collectingEggs.includes(gooseId)) return;

    // Zkontrolovat zda má husa vejce k sebrání
    const eggsCollected = collectEgg(gooseId);
    if (eggsCollected === 0) return; // Husa nemá vejce

    // Přidat vejce
    addEggs(eggsCollected);
    play('collect');

    // Animace
    setCollectingEggs((prev) => [...prev, gooseId]);
    setFeedMessage(`🥚 +${eggsCollected} vejce!`);
    setTimeout(() => {
      setCollectingEggs((prev) => prev.filter((id) => id !== gooseId));
      setFeedMessage(null);
    }, 600);
  }, [collectingEggs, collectEgg, addEggs, play]);

  const capacity = getGooseCapacity();

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 'var(--space-4)',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    flexWrap: 'wrap',
    gap: 'var(--space-3)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  };

  const levelBadgeStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: 'var(--space-3) var(--space-5)',
    borderRadius: 'var(--radius-full)',
    fontWeight: 'var(--font-bold)',
    fontSize: 'var(--text-base)',
    boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.3)',
    position: 'relative',
    overflow: 'hidden',
  };

  const xpContainerStyle: CSSProperties = {
    width: '150px',
  };

  const farmAreaStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    padding: '10px',
  };

  const buildingsAndGooseContainer: CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '800px',
    height: '450px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const getBuildingPosition = (type: string, index: number): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      width: '140px',
      height: '130px',
      zIndex: 2,
      transition: 'transform 0.2s',
    };
    switch (type) {
      case 'coop':
        return { ...base, left: '5%', top: '10%' };
      case 'field':
        return { ...base, right: '5%', top: '10%' };
      case 'mill':
        return { ...base, left: '2%', bottom: '15%' };
      case 'market':
        return { ...base, right: '2%', bottom: '15%' };
      default:
        return { ...base, left: `${10 + index * 20}%`, top: '20%' };
    }
  };

  const gooseEnclosureStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 3,
  };

  const gooseAreaStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 40px',
    background: 'linear-gradient(135deg, rgba(124, 179, 66, 0.5) 0%, rgba(139, 195, 74, 0.7) 100%)',
    borderRadius: '24px',
    minHeight: '160px',
    minWidth: '260px',
    maxWidth: '380px',
    backdropFilter: 'blur(15px)',
    border: '4px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 2px 8px rgba(0,0,0,0.1)',
  };

  const capacityStyle: CSSProperties = {
    background: 'linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255,255,255,0.9) 100%)',
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-text-primary)',
    boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.9)',
    border: '3px solid rgba(255, 255, 255, 0.8)',
    display: 'inline-block',
  };

  const warningStyle: CSSProperties = {
    color: '#ff5722',
    fontSize: '12px',
    fontWeight: 'bold',
  };

  const feedMessageStyle: CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'var(--color-bg-card)',
    color: 'var(--color-text-primary)',
    padding: 'var(--space-5) var(--space-8)',
    borderRadius: 'var(--radius-xl)',
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-bold)',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
    boxShadow: 'var(--shadow-xl)',
    border: '3px solid white',
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-3)',
    padding: 'var(--space-5)',
    justifyContent: 'center',
    flexWrap: 'wrap',
    background: 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 1,
    boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
  };

  return (
    <div style={containerStyle}>
      <FarmBackground />
      <div style={{ ...headerStyle, zIndex: 1 }}>
        <div>
          <div style={{ position: 'relative' }}>
            <div style={levelBadgeStyle}>
              <span style={{ position: 'relative', zIndex: 1 }}>Level {level}</span>
            </div>
          </div>
          <div style={xpContainerStyle}>
            <ProgressBar
              current={xp}
              max={xpToNextLevel}
              color="#9c27b0"
              height={12}
              showLabel={false}
            />
          </div>
        </div>
        <CurrencyDisplay />
      </div>

      <div style={farmAreaStyle}>
        <div style={buildingsAndGooseContainer}>
          {/* Buildings positioned absolutely */}
          {buildings.map((building, index) => (
            <div key={building.id} style={getBuildingPosition(building.type, index)}>
              <FarmBuildings buildings={[building]} />
            </div>
          ))}

          {/* Goose enclosure centered */}
          <div style={gooseEnclosureStyle}>
            <FenceDecoration />
            <div style={gooseAreaStyle}>
              {geese.map((goose, index) => (
                <GooseSVG
                  key={goose.id}
                  rarity={goose.rarity}
                  isCollecting={collectingEggs.includes(goose.id)}
                  animationDelay={index * 0.3}
                  onClick={() => handleCollectEgg(goose.id)}
                  name={goose.name}
                  eggProduction={goose.eggProduction}
                  isHungry={isAnyGooseHungry}
                  hasEgg={hasEgg(goose.id)}
                />
              ))}
              {geese.length === 0 && (
                <div style={{
                  color: 'white',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 'var(--font-bold)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  zIndex: 1,
                }}>
                  Zatím nemáš žádné husy! 🪿
                </div>
              )}
            </div>
            <FenceDecoration />
          </div>
        </div>

        {/* Capacity + feeding below the island area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={capacityStyle}>
            🪿 {geese.length}/{capacity} hus
          </div>
          {geese.length > 0 && (
            <>
              {isAnyGooseHungry ? (
                <>
                  <Button onClick={handleFeedGeese} variant="warning" size="small">
                    ⚠️ Nakrmit husy ({feedingCost} zrní)
                  </Button>
                  {grain < feedingCost && <div style={warningStyle}>Málo zrní!</div>}
                </>
              ) : (
                <div style={{
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: 'white',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-bold)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}>
                  ✓ Nakrmené
                </div>
              )}
            </>
          )}
        </div>

        {feedMessage && <div style={feedMessageStyle}>{feedMessage}</div>}
      </div>

      <div style={actionsStyle}>
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
