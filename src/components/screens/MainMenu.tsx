import { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { GooseSVG } from '../farm/GooseSVG';
import { useGameStore } from '../../store/gameStore';
import { useProgressStore } from '../../store/progressStore';
import { useCurrencyStore } from '../../store/currencyStore';

const CloudSVG = ({ size = 60, opacity = 0.7 }: { size?: number; opacity?: number }) => (
  <svg viewBox="0 0 100 50" width={size} height={size * 0.5} style={{ opacity }}>
    <ellipse cx="50" cy="35" rx="40" ry="15" fill="white" />
    <ellipse cx="35" cy="28" rx="22" ry="16" fill="white" />
    <ellipse cx="60" cy="25" rx="25" ry="18" fill="white" />
    <ellipse cx="45" cy="22" rx="18" ry="14" fill="white" />
  </svg>
);

const SunSVG = () => (
  <svg viewBox="0 0 120 120" width="120" height="120" style={{ opacity: 0.9 }}>
    <defs>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="40%" stopColor="#FFD54F" />
        <stop offset="70%" stopColor="#FFB300" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="60" cy="60" r="58" fill="url(#sunGlow)" />
    <circle cx="60" cy="60" r="28" fill="#FDD835" />
    <circle cx="60" cy="60" r="22" fill="#FFEE58" />
    <circle cx="52" cy="52" r="8" fill="rgba(255,255,255,0.4)" />
  </svg>
);

const FarmSilhouetteSVG = () => (
  <svg viewBox="0 0 400 80" preserveAspectRatio="none" style={{ width: '100%', height: '80px' }}>
    {/* Ground */}
    <rect x="0" y="50" width="400" height="30" fill="#5a8f3e" />
    <rect x="0" y="55" width="400" height="25" fill="#4a7d32" />
    {/* Barn */}
    <rect x="40" y="20" width="50" height="30" fill="#6D4C41" />
    <polygon points="35,20 90,20 65,2" fill="#8D6E63" />
    <rect x="55" y="30" width="12" height="20" fill="#5D4037" />
    {/* Silo */}
    <rect x="100" y="15" width="18" height="35" fill="#78909C" rx="2" />
    <ellipse cx="109" cy="15" rx="9" ry="3" fill="#90A4AE" />
    {/* Windmill */}
    <rect x="280" y="22" width="12" height="28" fill="#A1887F" />
    <line x1="286" y1="22" x2="286" y2="2" stroke="#8D6E63" strokeWidth="2" />
    <line x1="286" y1="12" x2="270" y2="6" stroke="#8D6E63" strokeWidth="1.5" />
    <line x1="286" y1="12" x2="302" y2="6" stroke="#8D6E63" strokeWidth="1.5" />
    <line x1="286" y1="12" x2="270" y2="18" stroke="#8D6E63" strokeWidth="1.5" />
    <line x1="286" y1="12" x2="302" y2="18" stroke="#8D6E63" strokeWidth="1.5" />
    {/* Trees */}
    <circle cx="160" cy="30" r="15" fill="#388E3C" />
    <rect x="158" y="35" width="4" height="15" fill="#5D4037" />
    <circle cx="200" cy="32" r="12" fill="#43A047" />
    <rect x="198" y="37" width="4" height="13" fill="#5D4037" />
    <circle cx="340" cy="28" r="18" fill="#2E7D32" />
    <circle cx="350" cy="34" r="12" fill="#388E3C" />
    <rect x="338" y="38" width="5" height="12" fill="#5D4037" />
    {/* Fence */}
    {[220, 235, 250].map((x) => (
      <g key={x}>
        <rect x={x} y="38" width="3" height="12" fill="#8D6E63" />
      </g>
    ))}
    <rect x="220" y="40" width="33" height="2" fill="#A1887F" />
    <rect x="220" y="46" width="33" height="2" fill="#A1887F" />
  </svg>
);

const StreakFireSVG = () => (
  <svg viewBox="0 0 24 30" width="28" height="35">
    <defs>
      <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FF6F00" />
        <stop offset="50%" stopColor="#FF9800" />
        <stop offset="100%" stopColor="#FDD835" />
      </linearGradient>
    </defs>
    <path d="M12 2 C8 8, 4 14, 6 22 C8 26, 10 28, 12 28 C14 28, 16 26, 18 22 C20 14, 16 8, 12 2Z" fill="url(#fireGrad)" />
    <path d="M12 10 C10 14, 8 18, 9 23 C10 25, 11 26, 12 26 C13 26, 14 25, 15 23 C16 18, 14 14, 12 10Z" fill="#FFEE58" />
    <ellipse cx="12" cy="22" rx="3" ry="4" fill="rgba(255,255,255,0.3)" />
  </svg>
);

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
    background: `
      linear-gradient(180deg,
        #87CEEB 0%,
        #B4E4F7 30%,
        #FFECD2 60%,
        #FFD4A8 75%,
        #7CB342 76%,
        #5a8f3e 100%
      )
    `,
    position: 'relative',
    overflow: 'hidden',
  };

  const sunStyle: CSSProperties = {
    position: 'absolute',
    top: '5%',
    right: '10%',
    animation: 'pulse 4s ease-in-out infinite',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(36px, 10vw, 72px)',
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--font-extrabold)',
    color: 'var(--color-white)',
    textShadow: `
      -2px -2px 0 #5a3e22,
       2px -2px 0 #5a3e22,
      -2px  2px 0 #5a3e22,
       2px  2px 0 #5a3e22,
       0 4px 0 #5a3e22,
       0 6px 12px rgba(0,0,0,0.3)
    `,
    marginBottom: '0',
    textAlign: 'center',
    zIndex: 2,
    letterSpacing: '1px',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 'clamp(14px, 3.5vw, 20px)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-parchment)',
    textShadow: 'var(--text-outline-brown)',
    marginBottom: 'var(--space-8)',
    textAlign: 'center',
    zIndex: 2,
  };

  const gooseContainerStyle: CSSProperties = {
    position: 'relative',
    marginBottom: 'var(--space-4)',
    width: '120px',
    height: '120px',
    zIndex: 2,
  };

  const statsStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-4)',
    marginBottom: 'var(--space-8)',
    flexWrap: 'wrap',
    justifyContent: 'center',
    zIndex: 2,
  };

  const statPanelStyle: CSSProperties = {
    background: 'var(--texture-wood)',
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    boxShadow: 'var(--shadow-wood-panel)',
    border: '2px solid var(--color-wood-border)',
    minWidth: '110px',
  };

  const statLabelStyle: CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-parchment)',
    textShadow: 'var(--text-outline-brown)',
    marginBottom: '2px',
  };

  const statValueStyle: CSSProperties = {
    fontSize: 'var(--text-2xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-extrabold)',
    color: 'white',
    textShadow: 'var(--text-outline-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
    width: '100%',
    maxWidth: '320px',
    zIndex: 2,
  };

  const versionStyle: CSSProperties = {
    position: 'absolute',
    bottom: 'var(--space-3)',
    right: 'var(--space-3)',
    fontSize: 'var(--text-xs)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'white',
    textShadow: 'var(--text-outline-brown)',
    background: 'var(--texture-wood)',
    padding: 'var(--space-1) var(--space-3)',
    borderRadius: 'var(--radius-sm)',
    border: '2px solid var(--color-wood-border)',
    boxShadow: 'var(--shadow-wood-panel)',
    zIndex: 2,
  };

  const silhouetteStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    opacity: 0.6,
  };

  return (
    <div style={containerStyle}>
      {/* Sun */}
      <div style={sunStyle}>
        <SunSVG />
      </div>

      {/* Parallax clouds */}
      <motion.div
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '8%', left: '5%', zIndex: 1 }}
      >
        <CloudSVG size={80} opacity={0.7} />
      </motion.div>
      <motion.div
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '15%', right: '25%', zIndex: 1 }}
      >
        <CloudSVG size={50} opacity={0.5} />
      </motion.div>
      <motion.div
        animate={{ x: [0, 15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '22%', left: '30%', zIndex: 1 }}
      >
        <CloudSVG size={60} opacity={0.4} />
      </motion.div>

      {/* Goose mascot */}
      <motion.div
        style={gooseContainerStyle}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <GooseSVG rarity="legendary" animationDelay={0} />
      </motion.div>

      <motion.h1
        style={titleStyle}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
      >
        Husí Farma
      </motion.h1>
      <motion.p
        style={subtitleStyle}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Uč se pravopis a pěstuj husy!
      </motion.p>

      <div style={statsStyle}>
        <motion.div
          style={statPanelStyle}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 15 }}
        >
          <div style={statLabelStyle}>Level</div>
          <div style={statValueStyle}>
            <svg viewBox="0 0 20 20" width="20" height="20">
              <circle cx="10" cy="10" r="9" fill="none" stroke="#FFD700" strokeWidth="2" />
              <text x="10" y="14" textAnchor="middle" fill="#FFD700" fontSize="11" fontWeight="bold">{level}</text>
            </svg>
            {level}
          </div>
        </motion.div>
        <motion.div
          style={statPanelStyle}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
        >
          <div style={statLabelStyle}>Denní streak</div>
          <div style={statValueStyle}>
            <StreakFireSVG />
            {dailyStreak}
          </div>
        </motion.div>
      </div>

      <motion.div
        style={buttonContainerStyle}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
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
      </motion.div>

      {/* Farm silhouette */}
      <div style={silhouetteStyle}>
        <FarmSilhouetteSVG />
      </div>

      <div style={versionStyle}>
        v{__APP_VERSION__} • {new Date(__BUILD_TIME__).toLocaleString('cs-CZ')}
      </div>
    </div>
  );
}
