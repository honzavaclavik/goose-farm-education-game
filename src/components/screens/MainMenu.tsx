import { CSSProperties } from 'react';
import { Button } from '../common/Button';
import { useGameStore } from '../../store/gameStore';
import { useProgressStore } from '../../store/progressStore';
import { useCurrencyStore } from '../../store/currencyStore';

export function MainMenu() {
  const { setScreen } = useGameStore();
  const { level, dailyStreak, checkDailyLogin } = useProgressStore();
  const { addFeathers } = useCurrencyStore();

  const handleStart = () => {
    const isFirstToday = checkDailyLogin();
    if (isFirstToday) {
      addFeathers(dailyStreak);
    }
    setScreen('farm');
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 'var(--space-6)',
    background: 'linear-gradient(180deg, var(--color-sky-start) 0%, var(--color-grass-end) 100%)',
    position: 'relative',
    overflow: 'hidden',
  };

  // Decorative clouds
  const cloudStyle: CSSProperties = {
    position: 'absolute',
    fontSize: '48px',
    opacity: 0.6,
    animation: 'float 4s ease-in-out infinite',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(32px, 8vw, 64px)',
    fontWeight: 'var(--font-extrabold)',
    color: 'var(--color-white)',
    textShadow: `
      3px 3px 0 #5a8f5a,
      6px 6px 10px rgba(0,0,0,0.3),
      0 0 30px rgba(255,255,255,0.3)
    `,
    marginBottom: 'var(--space-2)',
    textAlign: 'center',
    animation: 'bounce 2s ease-in-out infinite',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 'clamp(16px, 4vw, 24px)',
    color: '#2e7d32',
    marginBottom: 'var(--space-10)',
    textAlign: 'center',
    fontWeight: 'var(--font-semibold)',
    textShadow: '0 2px 4px rgba(255,255,255,0.8)',
  };

  const gooseContainerStyle: CSSProperties = {
    position: 'relative',
    marginBottom: 'var(--space-6)',
  };

  const gooseStyle: CSSProperties = {
    fontSize: 'clamp(80px, 20vw, 150px)',
    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
    animation: 'float 3s ease-in-out infinite',
  };

  const statsStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-5)',
    marginBottom: 'var(--space-8)',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const statItemStyle: CSSProperties = {
    background: 'var(--color-bg-card)',
    padding: 'var(--space-4) var(--space-6)',
    borderRadius: 'var(--radius-xl)',
    textAlign: 'center',
    boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.8)',
    minWidth: '120px',
    position: 'relative',
    overflow: 'hidden',
  };

  const statLabelStyle: CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    fontWeight: 'var(--font-medium)',
    marginBottom: 'var(--space-1)',
  };

  const statValueStyle: CSSProperties = {
    fontSize: 'var(--text-3xl)',
    fontWeight: 'var(--font-extrabold)',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-1)',
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
    width: '100%',
    maxWidth: '320px',
    zIndex: 1,
  };

  const versionStyle: CSSProperties = {
    position: 'absolute',
    bottom: 'var(--space-3)',
    right: 'var(--space-3)',
    fontSize: 'var(--text-xs)',
    color: 'rgba(0, 0, 0, 0.3)',
    background: 'rgba(255, 255, 255, 0.6)',
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-md)',
  };

  // Glossy overlay for stat cards
  const glossyOverlay: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle}>
      {/* Decorative clouds */}
      <div style={{ ...cloudStyle, top: '10%', left: '10%', animationDelay: '0s' }}>☁️</div>
      <div style={{ ...cloudStyle, top: '20%', right: '15%', animationDelay: '1s' }}>☁️</div>
      <div style={{ ...cloudStyle, bottom: '30%', left: '5%', animationDelay: '2s' }}>☁️</div>

      <div style={gooseContainerStyle}>
        <div style={gooseStyle}>🪿</div>
      </div>

      <h1 style={titleStyle}>Husí Farma</h1>
      <p style={subtitleStyle}>Uč se pravopis a pěstuj husy!</p>

      <div style={statsStyle}>
        <div style={statItemStyle}>
          <div style={glossyOverlay} />
          <div style={statLabelStyle}>Level</div>
          <div style={statValueStyle}>{level}</div>
        </div>
        <div style={statItemStyle}>
          <div style={glossyOverlay} />
          <div style={statLabelStyle}>Denní streak</div>
          <div style={statValueStyle}>
            {dailyStreak}
            <span style={{ fontSize: 'var(--text-xl)' }}>🔥</span>
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <Button onClick={handleStart} variant="success" size="large" fullWidth>
          🎮 Hrát
        </Button>
        <Button
          onClick={() => setScreen('minigameSelector')}
          variant="primary"
          size="medium"
          fullWidth
        >
          📚 Procvičování
        </Button>
      </div>

      <div style={versionStyle}>
        v{__APP_VERSION__} • {new Date(__BUILD_TIME__).toLocaleString('cs-CZ')}
      </div>
    </div>
  );
}
