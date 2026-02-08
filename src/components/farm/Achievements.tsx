import { CSSProperties, useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { WoodPanel } from '../common/WoodPanel';
import { useGameStore } from '../../store/gameStore';
import { useProgressStore } from '../../store/progressStore';
import { useFarmStore } from '../../store/farmStore';
import { useSound } from '../../hooks/useSound';
import { GiphyGif } from '../common/GiphyGif';
import { achievements, Achievement, checkAchievementUnlocked } from '../../data/achievements';

/* ── SVG Components ── */

function PadlockSVG() {
  return (
    <svg viewBox="0 0 32 40" width="28" height="35">
      <path d="M8 17 L8 12 Q8 3 16 3 Q24 3 24 12 L24 17" fill="none" stroke="#9E9E9E" strokeWidth="2.5" />
      <rect x="5" y="17" width="22" height="18" fill="#B0BEC5" rx="3" />
      <rect x="7" y="19" width="18" height="14" fill="#CFD8DC" rx="2" />
      <circle cx="16" cy="25" r="2.5" fill="#78909C" />
      <rect x="14.5" y="25" width="3" height="4" fill="#78909C" rx="0.5" />
    </svg>
  );
}

function MedalSVG({ color, isNew }: { color: string; isNew: boolean }) {
  return (
    <svg viewBox="0 0 48 56" width="44" height="52">
      {/* Ribbon */}
      <polygon points="18,0 14,22 24,18" fill="#E53935" />
      <polygon points="30,0 34,22 24,18" fill="#C62828" />
      {/* Medal body */}
      <circle cx="24" cy="32" r="16" fill={`url(#medal-grad-${color})`} stroke={isNew ? '#FFD700' : '#B8860B'} strokeWidth="2" />
      <circle cx="24" cy="32" r="12" fill="none" stroke={isNew ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'} strokeWidth="1" />
      {/* Shine */}
      <ellipse cx="20" cy="27" rx="4" ry="5" fill="rgba(255,255,255,0.2)" transform="rotate(-20 20 27)" />
      <defs>
        <radialGradient id={`medal-grad-${color}`}>
          <stop offset="0%" stopColor={color === 'gold' ? '#FFE082' : color === 'silver' ? '#E0E0E0' : '#FF8A65'} />
          <stop offset="100%" stopColor={color === 'gold' ? '#FFD700' : color === 'silver' ? '#BDBDBD' : '#E64A19'} />
        </radialGradient>
      </defs>
    </svg>
  );
}

function TorchGlow({ side }: { side: 'left' | 'right' }) {
  const x = side === 'left' ? '5%' : '95%';
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      [side]: 0,
      width: '40%',
      height: '200px',
      background: `radial-gradient(ellipse at ${x} 0%, rgba(255,160,50,0.15) 0%, transparent 70%)`,
      pointerEvents: 'none',
    }} />
  );
}

function ShelfSVG() {
  return (
    <svg viewBox="0 0 320 20" width="100%" height="20" preserveAspectRatio="none" style={{ display: 'block' }}>
      <rect x="0" y="0" width="320" height="8" fill="#8D6E63" />
      <rect x="0" y="8" width="320" height="4" fill="#6D4C41" />
      <rect x="0" y="0" width="320" height="2" fill="#A1887F" />
      {/* Brackets */}
      <rect x="20" y="8" width="6" height="12" fill="#5D4037" rx="1" />
      <rect x="294" y="8" width="6" height="12" fill="#5D4037" rx="1" />
    </svg>
  );
}

function SparkleEffect() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" style={{
      position: 'absolute', top: '-8px', right: '-8px', pointerEvents: 'none',
      animation: 'sparkleRotate 3s linear infinite',
    }}>
      <polygon points="30,2 33,22 52,12 36,27 52,35 33,32 38,52 30,36 22,52 27,32 8,35 24,27 8,12 27,22"
        fill="#FFD700" opacity="0.6" />
    </svg>
  );
}

export function Achievements() {
  const { setScreen } = useGameStore();
  const {
    achievements: unlockedAchievements,
    unlockAchievement,
    totalGamesPlayed,
    totalCorrectAnswers,
    bestStreak,
    level,
    dailyStreak,
  } = useProgressStore();
  const { geese } = useFarmStore();
  const { play } = useSound();

  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const stats = {
      gamesPlayed: totalGamesPlayed,
      correctAnswers: totalCorrectAnswers,
      bestStreak,
      level,
      geeseCount: geese.length,
      dailyStreak,
    };

    const newUnlocks: string[] = [];

    achievements.forEach((achievement) => {
      if (!unlockedAchievements.includes(achievement.id)) {
        if (checkAchievementUnlocked(achievement, stats)) {
          unlockAchievement(achievement.id);
          newUnlocks.push(achievement.id);
        }
      }
    });

    if (newUnlocks.length > 0) {
      setNewlyUnlocked(newUnlocks);
      play('levelUp');
    }
  }, [
    totalGamesPlayed,
    totalCorrectAnswers,
    bestStreak,
    level,
    geese.length,
    dailyStreak,
    unlockedAchievements,
    unlockAchievement,
    play,
  ]);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Top 3 unlocked achievements for trophy showcase
  const topAchievements = achievements
    .filter((a) => unlockedAchievements.includes(a.id))
    .slice(-3)
    .reverse();

  const getMedalColor = (achievement: Achievement): string => {
    const { type, value } = achievement.requirement;
    if (type === 'streak' && value >= 20) return 'gold';
    if (type === 'level' && value >= 25) return 'gold';
    if (type === 'correct_answers' && value >= 500) return 'gold';
    if (type === 'games_played' && value >= 50) return 'silver';
    return 'bronze';
  };

  /* ── Styles ── */

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: `
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 26px,
        rgba(0, 0, 0, 0.05) 26px,
        rgba(0, 0, 0, 0.05) 28px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 4px,
        rgba(0, 0, 0, 0.02) 4px,
        rgba(0, 0, 0, 0.02) 5px
      ),
      linear-gradient(180deg, #3E2723 0%, #2A1B12 100%)
    `,
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle: CSSProperties = {
    padding: 'var(--space-5)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  };

  const titleStyle: CSSProperties = {
    fontSize: 'var(--text-3xl)',
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--font-extrabold)',
    color: 'white',
    textShadow: 'var(--text-outline-dark)',
    margin: 0,
    marginBottom: 'var(--space-2)',
  };

  const statsStyle: CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-parchment)',
    marginBottom: 'var(--space-3)',
  };

  const progressBarBgStyle: CSSProperties = {
    background: 'var(--color-wood-dark)',
    borderRadius: 'var(--radius-full)',
    height: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: '300px',
    margin: '0 auto',
  };

  const progressBarFillStyle: CSSProperties = {
    width: `${progressPercent}%`,
    height: '100%',
    background: 'linear-gradient(90deg, #FFD700 0%, #FFA000 100%)',
    transition: 'width 0.5s ease',
    borderRadius: 'inherit',
    position: 'relative',
  };

  const showcaseStyle: CSSProperties = {
    padding: '0 var(--space-4) var(--space-2)',
    position: 'relative',
    zIndex: 1,
  };

  const showcaseInnerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-6)',
    padding: 'var(--space-4) var(--space-2)',
    marginBottom: '0',
  };

  const showcaseItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-1)',
  };

  const showcaseNameStyle: CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-gold-light)',
    textAlign: 'center',
    maxWidth: '80px',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 'var(--space-3)',
    padding: 'var(--space-4)',
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    zIndex: 1,
  };

  const cardUnlockedStyle = (isNew: boolean): CSSProperties => ({
    background: isNew
      ? 'linear-gradient(135deg, #FFF8E1 0%, #FFE082 100%)'
      : 'linear-gradient(135deg, var(--color-parchment) 0%, var(--color-parchment-mid) 100%)',
    borderRadius: 'var(--radius-md)',
    border: isNew
      ? '2px solid var(--color-gold)'
      : '2px solid var(--color-gold-dark)',
    padding: 'var(--space-3)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: isNew
      ? '0 0 16px rgba(255,215,0,0.5), 0 4px 8px rgba(0,0,0,0.2)'
      : '0 4px 8px rgba(0,0,0,0.2)',
    animation: isNew ? 'achieveBounce 0.5s ease-out' : 'none',
  });

  const cardLockedStyle: CSSProperties = {
    background: 'var(--texture-stone)',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--color-stone-dark)',
    padding: 'var(--space-3)',
    textAlign: 'center',
    opacity: 0.55,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  const cardEmojiStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '44px',
    marginBottom: 'var(--space-2)',
  };

  const cardNameUnlockedStyle: CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-wood-dark)',
    marginBottom: '2px',
  };

  const cardNameLockedStyle: CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-stone-mid)',
    marginBottom: '2px',
  };

  const cardDescUnlockedStyle: CSSProperties = {
    fontSize: '11px',
    color: 'var(--color-stone-dark)',
    lineHeight: 1.3,
  };

  const cardDescLockedStyle: CSSProperties = {
    fontSize: '11px',
    color: 'var(--color-stone-mid)',
    lineHeight: 1.3,
  };

  const footerStyle: CSSProperties = {
    padding: 'var(--space-5)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <TorchGlow side="left" />
      <TorchGlow side="right" />

      <div style={headerStyle}>
        <h1 style={titleStyle}>Úspěchy</h1>
        <div style={statsStyle}>
          {unlockedCount} / {totalCount} ({progressPercent}%)
        </div>
        <div style={progressBarBgStyle}>
          <div style={progressBarFillStyle} />
        </div>
      </div>

      {/* Trophy Showcase */}
      {topAchievements.length > 0 && (
        <div style={showcaseStyle}>
          <WoodPanel variant="dark" style={{ padding: 0 }}>
            <div style={showcaseInnerStyle}>
              {topAchievements.map((achievement) => {
                const isNew = newlyUnlocked.includes(achievement.id);
                return (
                  <div key={achievement.id} style={showcaseItemStyle}>
                    <MedalSVG color={getMedalColor(achievement)} isNew={isNew} />
                    <div style={showcaseNameStyle}>{achievement.name}</div>
                  </div>
                );
              })}
            </div>
            <ShelfSVG />
          </WoodPanel>
        </div>
      )}

      {/* Grid */}
      <div style={gridStyle}>
        {achievements.map((achievement) => {
          const unlocked = unlockedAchievements.includes(achievement.id);
          const isNew = newlyUnlocked.includes(achievement.id);

          if (unlocked) {
            return (
              <div key={achievement.id} style={cardUnlockedStyle(isNew)}>
                {isNew && <SparkleEffect />}
                {isNew && achievement.id === newlyUnlocked[0] && (
                  <GiphyGif tag="trophy celebration" fallbackEmoji="🏆" />
                )}
                <div style={cardEmojiStyle}>
                  <span style={{ fontSize: '32px' }}>{achievement.emoji}</span>
                </div>
                <div style={cardNameUnlockedStyle}>{achievement.name}</div>
                <div style={cardDescUnlockedStyle}>{achievement.description}</div>
              </div>
            );
          }

          return (
            <div key={achievement.id} style={cardLockedStyle}>
              <div style={cardEmojiStyle}>
                <PadlockSVG />
              </div>
              <div style={cardNameLockedStyle}>{achievement.name}</div>
              <div style={cardDescLockedStyle}>{achievement.description}</div>
            </div>
          );
        })}
      </div>

      <div style={footerStyle}>
        <Button onClick={() => setScreen('farm')} variant="secondary" size="large">
          ← Zpět na farmu
        </Button>
      </div>

      <style>{`
        @keyframes achieveBounce {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkleRotate {
          0% { transform: rotate(0deg); opacity: 0.6; }
          50% { opacity: 1; }
          100% { transform: rotate(360deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
