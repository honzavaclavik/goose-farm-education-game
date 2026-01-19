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
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    flexWrap: 'wrap',
    gap: '10px',
  };

  const levelBadgeStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '20px',
    background: 'rgba(124, 179, 66, 0.4)',
    borderRadius: '20px',
    minHeight: '150px',
    maxWidth: '550px',
    backdropFilter: 'blur(5px)',
    border: '3px solid rgba(85, 139, 47, 0.5)',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
  };

  const capacityStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '8px 16px',
    borderRadius: '10px',
    marginTop: '10px',
    fontSize: '14px',
    color: '#333',
  };

  const productionInfoStyle: CSSProperties = {
    background: 'rgba(255, 193, 7, 0.9)',
    padding: '8px 16px',
    borderRadius: '10px',
    marginBottom: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
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
    background: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <FarmBackground />
      <div style={{ ...headerStyle, zIndex: 1 }}>
        <div>
          <div style={levelBadgeStyle}>Level {level}</div>
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
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '15px',
            fontSize: '13px',
            maxWidth: '400px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
              <div style={{ color: '#4caf50', fontSize: '14px', fontWeight: 'bold' }}>
                ✓ Husy jsou nakrmené
              </div>
            )}
          </div>
        )}

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
            <div style={{ color: 'white', fontSize: '18px', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
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
