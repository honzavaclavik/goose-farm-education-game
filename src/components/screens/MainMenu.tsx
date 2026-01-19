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
    // Zkontrolovat denní login bonus
    const isFirstToday = checkDailyLogin();
    if (isFirstToday) {
      addFeathers(dailyStreak); // Bonus peří za streak
    }
    setScreen('farm');
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(180deg, #87ceeb 0%, #98fb98 100%)',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(32px, 8vw, 56px)',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '3px 3px 0 #5a8f5a, 6px 6px 10px rgba(0,0,0,0.2)',
    marginBottom: '8px',
    textAlign: 'center',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 'clamp(16px, 4vw, 24px)',
    color: '#2e7d32',
    marginBottom: '40px',
    textAlign: 'center',
  };

  const gooseStyle: CSSProperties = {
    fontSize: 'clamp(80px, 20vw, 150px)',
    marginBottom: '20px',
    animation: 'bounce 2s infinite',
  };

  const statsStyle: CSSProperties = {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const statItemStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '12px 20px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  };

  const statLabelStyle: CSSProperties = {
    fontSize: '12px',
    color: '#666',
  };

  const statValueStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    maxWidth: '300px',
  };

  const versionStyle: CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    fontSize: '11px',
    color: 'rgba(0, 0, 0, 0.4)',
  };

  return (
    <div style={containerStyle}>
      <div style={gooseStyle}>🪿</div>
      <h1 style={titleStyle}>Husí Farma</h1>
      <p style={subtitleStyle}>Uč se pravopis a pěstuj husy!</p>

      <div style={statsStyle}>
        <div style={statItemStyle}>
          <div style={statLabelStyle}>Level</div>
          <div style={statValueStyle}>{level}</div>
        </div>
        <div style={statItemStyle}>
          <div style={statLabelStyle}>Denní streak</div>
          <div style={statValueStyle}>{dailyStreak}🔥</div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <Button onClick={handleStart} size="large" fullWidth>
          🎮 Hrát
        </Button>
        <Button
          onClick={() => setScreen('minigameSelector')}
          variant="secondary"
          size="medium"
          fullWidth
        >
          📚 Procvičování
        </Button>
      </div>

      <div style={versionStyle}>
        v{__APP_VERSION__} • {new Date(__BUILD_TIME__).toLocaleString('cs-CZ')}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
