import { useState, useEffect, CSSProperties } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';
import { useFarmStore } from '../../store/farmStore';
import { useProgressStore } from '../../store/progressStore';
import { useProductionStore, FEEDING_INTERVAL_MS } from '../../store/productionStore';

/**
 * Tajný debug panel - aktivuje se kliknutím 5x na verzi v patičce
 * nebo podržením 3 prstů na obrazovce 3 sekundy
 */
export function SecretDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [touchTimer, setTouchTimer] = useState<number | null>(null);

  const { eggs, grain, feathers, addEggs, addGrain, addFeathers } = useCurrencyStore();
  const { geese, buildings } = useFarmStore();
  const { level, xp, addXp } = useProgressStore();
  const { lastFeeding, setLastFeeding } = useProductionStore();

  const [now, setNow] = useState(Date.now());

  // Aktualizovat čas každou sekundu když je panel otevřený
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Reset tap count po 2 sekundách
  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => setTapCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  // Klávesová zkratka: Ctrl+Shift+D (pro desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handler pro aktivaci panelu (5 tapů)
  const handleVersionTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setIsOpen(true);
      setTapCount(0);
    }
  };

  // Handler pro 3-prstové podržení
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length >= 3) {
      const timer = window.setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      setTouchTimer(timer);
    }
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  // Simulovat nakrmení (nastavit lastFeeding na teď)
  const simulateFeed = () => {
    setLastFeeding(Date.now());
  };

  // Simulovat hlad (nastavit lastFeeding do minulosti)
  const simulateHunger = () => {
    setLastFeeding(Date.now() - FEEDING_INTERVAL_MS - 1000); // 5 minut + 1s v minulosti
  };

  const timeSinceFeeding = now - lastFeeding;
  const isHungry = timeSinceFeeding >= FEEDING_INTERVAL_MS;
  const timeUntilHungry = Math.max(0, FEEDING_INTERVAL_MS - timeSinceFeeding);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const panelStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    color: '#0f0',
    fontFamily: 'monospace',
    fontSize: '12px',
    padding: '20px',
    zIndex: 10000,
    overflow: 'auto',
  };

  const buttonStyle: CSSProperties = {
    background: '#333',
    color: '#0f0',
    border: '1px solid #0f0',
    padding: '8px 16px',
    margin: '4px',
    cursor: 'pointer',
    fontFamily: 'monospace',
  };

  const sectionStyle: CSSProperties = {
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #333',
  };

  // Aktivační oblast - větší klikatelná zóna v pravém dolním rohu
  const activatorStyle: CSSProperties = {
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: 'rgba(255,255,255,0.15)',
    cursor: 'pointer',
    userSelect: 'none',
    zIndex: 9999,
    // Debug: dočasně viditelné pozadí pro testování
    // background: 'rgba(255,0,0,0.3)',
  };

  return (
    <>
      {/* Aktivační oblast */}
      <div
        style={activatorStyle}
        onClick={handleVersionTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tapCount > 0 ? `${tapCount}/5` : 'v1.0'}
      </div>

      {/* Debug panel */}
      {isOpen && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#0f0' }}>🔧 DEBUG PANEL</h2>
            <button style={buttonStyle} onClick={() => setIsOpen(false)}>✕ Zavřít</button>
          </div>

          {/* Stav krmení */}
          <div style={sectionStyle}>
            <h3 style={{ color: '#ff0', margin: '0 0 10px 0' }}>🪿 Stav krmení</h3>
            <div>lastFeedingTime: {new Date(lastFeeding).toLocaleTimeString()}</div>
            <div>Čas od nakrmení: {formatTime(timeSinceFeeding)}</div>
            <div>FEEDING_INTERVAL_MS: {formatTime(FEEDING_INTERVAL_MS)}</div>
            <div style={{ color: isHungry ? '#f00' : '#0f0', fontWeight: 'bold' }}>
              Stav: {isHungry ? '🔴 HLADOVÉ' : '🟢 NAKRMENÉ'}
            </div>
            {!isHungry && <div>Hlad za: {formatTime(timeUntilHungry)}</div>}
            <div style={{ marginTop: '10px' }}>
              <button style={buttonStyle} onClick={simulateFeed}>
                ✅ Simulovat nakrmení
              </button>
              <button style={buttonStyle} onClick={simulateHunger}>
                ❌ Simulovat hlad
              </button>
            </div>
          </div>

          {/* Měny */}
          <div style={sectionStyle}>
            <h3 style={{ color: '#ff0', margin: '0 0 10px 0' }}>💰 Měny</h3>
            <div>Vejce: {eggs}</div>
            <div>Zrní: {grain}</div>
            <div>Peří: {feathers}</div>
            <div style={{ marginTop: '10px' }}>
              <button style={buttonStyle} onClick={() => addEggs(100)}>+100 vejce</button>
              <button style={buttonStyle} onClick={() => addGrain(100)}>+100 zrní</button>
              <button style={buttonStyle} onClick={() => addFeathers(100)}>+100 peří</button>
            </div>
          </div>

          {/* Progress */}
          <div style={sectionStyle}>
            <h3 style={{ color: '#ff0', margin: '0 0 10px 0' }}>📊 Progress</h3>
            <div>Level: {level}</div>
            <div>XP: {xp}</div>
            <div style={{ marginTop: '10px' }}>
              <button style={buttonStyle} onClick={() => addXp(100)}>+100 XP</button>
            </div>
          </div>

          {/* Farm stav */}
          <div style={sectionStyle}>
            <h3 style={{ color: '#ff0', margin: '0 0 10px 0' }}>🏠 Farma</h3>
            <div>Počet hus: {geese.length}</div>
            <div>Husy: {geese.map(g => g.name).join(', ') || 'žádné'}</div>
            <div>Budovy: {buildings.length}</div>
          </div>

          {/* LocalStorage */}
          <div style={sectionStyle}>
            <h3 style={{ color: '#ff0', margin: '0 0 10px 0' }}>💾 localStorage</h3>
            <button style={buttonStyle} onClick={() => {
              if (confirm('Opravdu smazat všechna data?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}>
              🗑️ Smazat vše a reload
            </button>
          </div>
        </div>
      )}
    </>
  );
}
