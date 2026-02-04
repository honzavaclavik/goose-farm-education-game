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

export function FarmView() {
  const { setScreen } = useGameStore();
  const { geese, buildings, getGooseCapacity } = useFarmStore();
  const { level, xp, xpToNextLevel } = useProgressStore();
  const { grain } = useCurrencyStore();
  const { grainPerMinute, feedingCost, feedGeese } = useFarmProduction();
  const { totalEggMultiplier, isAnyGooseHungry } = useGooseBonus();
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

  const GlossyOverlay = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
      pointerEvents: 'none',
      borderRadius: 'inherit',
    }} />
  );

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
    padding: '20px',
    position: 'relative',
    zIndex: 1,
  };

  const buildingAreaStyle: CSSProperties = {
    marginBottom: '50px',
    width: '100%',
    maxWidth: '600px',
  };

  const gooseAreaStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-3)',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 'var(--space-6)',
    background: 'linear-gradient(135deg, rgba(124, 179, 66, 0.4) 0%, rgba(139, 195, 74, 0.6) 100%)',
    borderRadius: 'var(--radius-2xl)',
    minHeight: '180px',
    maxWidth: '600px',
    backdropFilter: 'blur(15px)',
    border: '5px solid rgba(255, 255, 255, 0.4)',
    boxShadow: 'var(--shadow-xl), inset 0 3px 12px rgba(0,0,0,0.15), 0 0 20px rgba(139,195,74,0.3)',
    position: 'relative',
  };

  const capacityStyle: CSSProperties = {
    background: 'linear-gradient(135deg, var(--color-bg-card) 0%, rgba(255,255,255,0.9) 100%)',
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-full)',
    marginTop: 'var(--space-4)',
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-text-primary)',
    boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.9)',
    border: '3px solid rgba(255, 255, 255, 0.8)',
    display: 'inline-block',
  };

  const productionInfoStyle: CSSProperties = {
    background: 'linear-gradient(135deg, var(--color-warning) 0%, var(--color-secondary) 100%)',
    padding: 'var(--space-3) var(--space-5)',
    borderRadius: 'var(--radius-full)',
    marginBottom: 'var(--space-4)',
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-bold)',
    color: 'white',
    boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.4)',
    animation: 'pulse 2s ease-in-out infinite',
  };


  const feedingAreaStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '15px',
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
              <GlossyOverlay />
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
        {/* Info panel - jak husy fungují */}
        <div
          style={{
            background: 'var(--color-bg-card)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
            maxWidth: '400px',
            boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.8)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>
            🪿 Jak husy fungují:
          </div>
          <div style={{ lineHeight: '1.5', color: '#555' }}>
            Každá husa zvyšuje odměny z mini-her.
            {geese.length > 0 && (
              <span style={{ fontWeight: 'bold', color: '#4caf50' }}>
                {' '}Aktuální bonus: x{totalEggMultiplier.toFixed(1)}
              </span>
            )}
            {isAnyGooseHungry && (
              <span style={{ color: '#ff9800', fontWeight: 'bold' }}>
                {' '}(hladové = 50%)
              </span>
            )}
          </div>
        </div>

        {/* Produkce zrní info */}
        {grainPerMinute > 0 && (
          <div style={productionInfoStyle}>
            🌾 +{grainPerMinute} zrní/min
          </div>
        )}

        <div style={buildingAreaStyle}>
          <FarmBuildings buildings={buildings} />
        </div>

        {/* Krmení hus */}
        {geese.length > 0 && (
          <div style={feedingAreaStyle}>
            {isAnyGooseHungry ? (
              <>
                <Button
                  onClick={handleFeedGeese}
                  variant="warning"
                  size="small"
                >
                  ⚠️ Nakrmit husy ({feedingCost} zrní)
                </Button>
                {grain < feedingCost && (
                  <div style={warningStyle}>Málo zrní!</div>
                )}
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
                ✓ Husy jsou nakrmené
              </div>
            )}
          </div>
        )}

        <div style={gooseAreaStyle}>
          {/* Dekorativní prvky - tráva */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            fontSize: '24px',
            opacity: 0.6,
          }}>
            🌿
          </div>
          <div style={{
            position: 'absolute',
            bottom: '15px',
            right: '15px',
            fontSize: '20px',
            opacity: 0.6,
          }}>
            🌸
          </div>
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '20px',
            fontSize: '18px',
            opacity: 0.5,
          }}>
            🌼
          </div>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '25px',
            fontSize: '22px',
            opacity: 0.5,
          }}>
            🌿
          </div>

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

        <div style={capacityStyle}>
          🪿 {geese.length}/{capacity} hus
        </div>

        {/* Feed message */}
        {feedMessage && (
          <div style={feedMessageStyle}>{feedMessage}</div>
        )}
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
