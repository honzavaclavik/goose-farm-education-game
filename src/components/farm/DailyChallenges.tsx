import { CSSProperties, useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { useGameStore } from '../../store/gameStore';
import { useProgressStore } from '../../store/progressStore';
import { useCurrencyStore } from '../../store/currencyStore';
import { useSound } from '../../hooks/useSound';

interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  requirement: {
    type: 'games' | 'correct' | 'streak';
    value: number;
  };
  reward: {
    eggs: number;
    feathers: number;
    xp: number;
  };
}

const STORAGE_KEY = 'goose-farm-daily-challenges';

interface DailyChallengeState {
  date: string;
  challenges: DailyChallenge[];
  progress: Record<string, number>;
  claimed: string[];
}

function generateDailyChallenges(date: string): DailyChallenge[] {
  const seed = date.split('-').reduce((acc, val) => acc + parseInt(val, 10), 0);

  const allChallenges: DailyChallenge[] = [
    {
      id: 'games_3',
      name: 'Denní praxe',
      description: 'Zahraj 3 mini-hry',
      requirement: { type: 'games', value: 3 },
      reward: { eggs: 10, feathers: 0, xp: 50 },
    },
    {
      id: 'games_5',
      name: 'Pilný student',
      description: 'Zahraj 5 mini-her',
      requirement: { type: 'games', value: 5 },
      reward: { eggs: 20, feathers: 1, xp: 100 },
    },
    {
      id: 'correct_10',
      name: 'Správné odpovědi',
      description: 'Odpověz správně 10krát',
      requirement: { type: 'correct', value: 10 },
      reward: { eggs: 15, feathers: 0, xp: 75 },
    },
    {
      id: 'correct_20',
      name: 'Pravopisný mistr',
      description: 'Odpověz správně 20krát',
      requirement: { type: 'correct', value: 20 },
      reward: { eggs: 30, feathers: 1, xp: 150 },
    },
    {
      id: 'streak_5',
      name: 'Série!',
      description: 'Dosáhni série 5 správných',
      requirement: { type: 'streak', value: 5 },
      reward: { eggs: 25, feathers: 1, xp: 100 },
    },
    {
      id: 'streak_10',
      name: 'Husí horečka',
      description: 'Dosáhni série 10 správných',
      requirement: { type: 'streak', value: 10 },
      reward: { eggs: 50, feathers: 3, xp: 200 },
    },
  ];

  const shuffled = [...allChallenges].sort(
    (a, b) => ((seed * a.id.length) % 10) - ((seed * b.id.length) % 10)
  );

  return shuffled.slice(0, 3);
}

function loadState(): DailyChallengeState | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return null;
}

function saveState(state: DailyChallengeState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ── SVG Icons ── */

function GoosePathIndicator({ progress, color }: { progress: number; color: string }) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const pathLength = 220;
  const gooseX = 20 + clampedProgress * pathLength;

  return (
    <svg viewBox="0 0 260 32" width="100%" height="32" style={{ display: 'block' }}>
      {/* Dotted trail */}
      <line x1="20" y1="18" x2="240" y2="18" stroke="var(--color-wood-border)"
        strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
      {/* Filled trail */}
      <line x1="20" y1="18" x2={gooseX} y2="18" stroke={color}
        strokeWidth="3" strokeLinecap="round" />
      {/* Star at end */}
      <polygon points="240,10 242,15 248,16 243,20 244,26 240,23 236,26 237,20 232,16 238,15"
        fill={clampedProgress >= 1 ? '#FFD700' : '#BDBDBD'}
        stroke={clampedProgress >= 1 ? '#FFA000' : '#9E9E9E'}
        strokeWidth="0.5" />
      {clampedProgress >= 1 && (
        <polygon points="240,12 241.5,15.5 245,16.5 242.5,19 243,23 240,21"
          fill="rgba(255,255,255,0.3)" />
      )}
      {/* Mini goose at progress */}
      <g transform={`translate(${gooseX - 8}, 4)`}>
        <ellipse cx="8" cy="10" rx="6" ry="4" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
        <path d="M5 8 Q4 4 5 2" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="5" cy="2" r="2" fill="white" />
        <circle cx="4.5" cy="1.5" r="0.6" fill="#333" />
        <path d="M3 2.3 L1.5 2 L3 1.7" fill="#FF8F00" />
      </g>
    </svg>
  );
}

function GoldenCheckmark() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <circle cx="20" cy="20" r="18" fill="url(#gold-check-grad)" stroke="#FFA000" strokeWidth="2" />
      <defs>
        <radialGradient id="gold-check-grad">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FFD700" />
        </radialGradient>
      </defs>
      <path d="M12 20 L17 25 L28 14" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FarmSilhouette() {
  return (
    <svg viewBox="0 0 400 80" width="100%" height="80"
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0.12, pointerEvents: 'none' }}
      preserveAspectRatio="xMidYMax slice">
      {/* Hills */}
      <path d="M0 80 Q50 40 100 55 Q150 30 200 50 Q250 25 300 45 Q350 30 400 50 L400 80 Z" fill="#3E2723" />
      {/* Barn */}
      <rect x="60" y="30" width="30" height="25" fill="#3E2723" />
      <polygon points="55,30 75,12 95,30" fill="#3E2723" />
      {/* Silo */}
      <rect x="100" y="22" width="12" height="33" fill="#3E2723" />
      <ellipse cx="106" cy="22" rx="6" ry="4" fill="#3E2723" />
      {/* Windmill */}
      <rect x="250" y="20" width="10" height="35" fill="#3E2723" />
      <line x1="255" y1="20" x2="275" y2="10" stroke="#3E2723" strokeWidth="2" />
      <line x1="255" y1="20" x2="235" y2="10" stroke="#3E2723" strokeWidth="2" />
      <line x1="255" y1="20" x2="265" y2="0" stroke="#3E2723" strokeWidth="2" />
      <line x1="255" y1="20" x2="245" y2="38" stroke="#3E2723" strokeWidth="2" />
      {/* Tree */}
      <rect x="340" y="32" width="5" height="23" fill="#3E2723" />
      <circle cx="342" cy="26" r="14" fill="#3E2723" />
      {/* Fence */}
      {[150, 165, 180, 195, 210].map((x) => (
        <rect key={x} x={x} y="42" width="2" height="13" fill="#3E2723" />
      ))}
      <line x1="150" y1="46" x2="212" y2="46" stroke="#3E2723" strokeWidth="1.5" />
      <line x1="150" y1="50" x2="212" y2="50" stroke="#3E2723" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Reward SVG Icons ── */

function EggRewardIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" style={{ verticalAlign: 'middle' }}>
      <ellipse cx="7" cy="8" rx="5" ry="5.5" fill="#FFF8E1" stroke="#FFE082" strokeWidth="0.8" />
      <ellipse cx="6" cy="6.5" rx="1.5" ry="2" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

function FeatherRewardIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" style={{ verticalAlign: 'middle' }}>
      <path d="M7 1 Q10.5 5 9 12 Q7 8.5 5 12 Q3.5 5 7 1Z" fill="#90CAF9" stroke="#64B5F6" strokeWidth="0.4" />
      <line x1="7" y1="2" x2="7" y2="12" stroke="#42A5F5" strokeWidth="0.4" />
    </svg>
  );
}

function XpRewardIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" style={{ verticalAlign: 'middle' }}>
      <polygon points="7,1 8.5,5 13,5.5 9.5,8.5 10.5,13 7,10.5 3.5,13 4.5,8.5 1,5.5 5.5,5"
        fill="#FFD700" stroke="#FFA000" strokeWidth="0.5" />
    </svg>
  );
}

export function DailyChallenges() {
  const { setScreen } = useGameStore();
  const { totalGamesPlayed, totalCorrectAnswers, bestStreak, addXp } = useProgressStore();
  const { addEggs, addFeathers } = useCurrencyStore();
  const { play } = useSound();

  const today = new Date().toISOString().split('T')[0];

  const [state, setState] = useState<DailyChallengeState>(() => {
    const loaded = loadState();
    if (loaded && loaded.date === today) {
      return loaded;
    }
    return {
      date: today,
      challenges: generateDailyChallenges(today),
      progress: {},
      claimed: [],
    };
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const newProgress: Record<string, number> = {};

    state.challenges.forEach((challenge) => {
      switch (challenge.requirement.type) {
        case 'games':
          newProgress[challenge.id] = totalGamesPlayed;
          break;
        case 'correct':
          newProgress[challenge.id] = totalCorrectAnswers;
          break;
        case 'streak':
          newProgress[challenge.id] = bestStreak;
          break;
      }
    });

    setState((prev) => ({ ...prev, progress: newProgress }));
  }, [totalGamesPlayed, totalCorrectAnswers, bestStreak, state.challenges]);

  const claimReward = (challenge: DailyChallenge) => {
    if (state.claimed.includes(challenge.id)) return;

    const currentProgress = state.progress[challenge.id] || 0;
    if (currentProgress < challenge.requirement.value) return;

    addEggs(challenge.reward.eggs);
    addFeathers(challenge.reward.feathers);
    addXp(challenge.reward.xp);
    play('purchase');

    setState((prev) => ({
      ...prev,
      claimed: [...prev.claimed, challenge.id],
    }));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  /* ── Styles ── */

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: `
      linear-gradient(180deg,
        #FF6F00 0%,
        #FF8F00 20%,
        #FFA726 45%,
        #FFCC80 70%,
        #FFE0B2 100%)
    `,
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyle: CSSProperties = {
    padding: 'var(--space-5) var(--space-5) var(--space-3)',
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

  const dateStyle: CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-heading)',
    color: 'rgba(255,255,255,0.85)',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
  };

  const listStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
    padding: 'var(--space-4) var(--space-4)',
    flex: 1,
    position: 'relative',
    zIndex: 1,
  };

  const cardStyle = (isClaimed: boolean): CSSProperties => ({
    background: isClaimed
      ? `
        repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(76,175,80,0.04) 30px, rgba(76,175,80,0.04) 31px),
        radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 70%),
        linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%)
      `
      : 'var(--texture-parchment)',
    borderRadius: 'var(--radius-md)',
    border: isClaimed
      ? '2px solid var(--color-gold-dark)'
      : '2px solid var(--color-wood-border)',
    padding: 'var(--space-4)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-4)',
    boxShadow: 'var(--shadow-wood-panel)',
    position: 'relative',
    overflow: 'hidden',
  });

  const iconAreaStyle = (isClaimed: boolean): CSSProperties => ({
    minWidth: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: isClaimed ? '0' : 'var(--space-1)',
  });

  const contentStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const nameStyle: CSSProperties = {
    fontSize: 'var(--text-base)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-wood-dark)',
    marginBottom: 'var(--space-1)',
  };

  const descStyle: CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-stone-dark)',
    marginBottom: 'var(--space-3)',
  };

  const rewardRowStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-3)',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-wood-dark)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-semibold)',
    marginTop: 'var(--space-2)',
  };

  const rewardItemStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
  };

  const footerStyle: CSSProperties = {
    padding: 'var(--space-5)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <FarmSilhouette />

      <div style={headerStyle}>
        <h1 style={titleStyle}>Denní výzvy</h1>
        <div style={dateStyle}>{formatDate(today)}</div>
      </div>

      <div style={listStyle}>
        {state.challenges.map((challenge) => {
          const currentProgress = state.progress[challenge.id] || 0;
          const isCompleted = currentProgress >= challenge.requirement.value;
          const isClaimed = state.claimed.includes(challenge.id);
          const progressRatio = Math.min(currentProgress / challenge.requirement.value, 1);

          return (
            <div key={challenge.id} style={cardStyle(isClaimed)}>
              {/* Icon area */}
              <div style={iconAreaStyle(isClaimed)}>
                {isClaimed ? (
                  <GoldenCheckmark />
                ) : (
                  <ChallengeTypeIcon type={challenge.requirement.type} />
                )}
              </div>

              {/* Content */}
              <div style={contentStyle}>
                <div style={nameStyle}>{challenge.name}</div>
                <div style={descStyle}>{challenge.description}</div>

                {/* Goose path progress */}
                <GoosePathIndicator
                  progress={progressRatio}
                  color={isCompleted ? '#4caf50' : '#FF9800'}
                />

                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-stone-dark)',
                  textAlign: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'var(--font-bold)',
                  marginTop: '2px',
                }}>
                  {Math.min(currentProgress, challenge.requirement.value)} / {challenge.requirement.value}
                </div>

                {/* Rewards */}
                <div style={rewardRowStyle}>
                  {challenge.reward.eggs > 0 && (
                    <span style={rewardItemStyle}><EggRewardIcon /> +{challenge.reward.eggs}</span>
                  )}
                  {challenge.reward.feathers > 0 && (
                    <span style={rewardItemStyle}><FeatherRewardIcon /> +{challenge.reward.feathers}</span>
                  )}
                  {challenge.reward.xp > 0 && (
                    <span style={rewardItemStyle}><XpRewardIcon /> +{challenge.reward.xp} XP</span>
                  )}
                </div>
              </div>

              {/* Claim button */}
              {isCompleted && !isClaimed && (
                <div style={{ alignSelf: 'center' }}>
                  <button
                    onClick={() => claimReward(challenge)}
                    style={{
                      background: 'linear-gradient(180deg, #FFD54F 0%, #F9A825 100%)',
                      border: 'none',
                      borderBottom: '3px solid #E65100',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-2) var(--space-4)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'var(--font-bold)',
                      fontSize: 'var(--text-sm)',
                      color: 'white',
                      textShadow: 'var(--text-outline-dark)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: 'claimPulse 2s ease-in-out infinite',
                      boxShadow: '0 0 12px rgba(255,193,7,0.4)',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      animation: 'shimmerSlide 2s infinite',
                    }} />
                    <span style={{ position: 'relative', zIndex: 1 }}>Vyzvednout</span>
                  </button>
                </div>
              )}
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
        @keyframes shimmerSlide {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes claimPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(255,193,7,0.3); }
          50% { box-shadow: 0 0 20px rgba(255,193,7,0.6); }
        }
      `}</style>
    </div>
  );
}

/* ── Challenge Type Icons ── */

function ChallengeTypeIcon({ type }: { type: 'games' | 'correct' | 'streak' }) {
  if (type === 'games') {
    return (
      <svg viewBox="0 0 40 40" width="40" height="40">
        {/* Controller body */}
        <rect x="6" y="12" width="28" height="16" fill="#5D4037" rx="6" />
        <rect x="8" y="14" width="24" height="12" fill="#795548" rx="5" />
        {/* D-pad */}
        <rect x="12" y="17" width="3" height="7" fill="#A1887F" rx="0.5" />
        <rect x="10" y="19" width="7" height="3" fill="#A1887F" rx="0.5" />
        {/* Buttons */}
        <circle cx="27" cy="18" r="2" fill="#4CAF50" />
        <circle cx="31" cy="21" r="2" fill="#F44336" />
      </svg>
    );
  }

  if (type === 'correct') {
    return (
      <svg viewBox="0 0 40 40" width="40" height="40">
        <circle cx="20" cy="20" r="16" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="2" />
        <path d="M12 20 L17 25 L28 14" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // streak
  return (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <path d="M20 4 Q24 12 20 18 Q28 14 26 22 Q30 18 28 28 Q24 36 20 36 Q16 36 12 28 Q10 18 14 22 Q12 14 16 18 Q12 12 20 4Z"
        fill="#FF9800" />
      <path d="M20 14 Q22 18 20 22 Q24 20 22 26 Q20 30 18 26 Q16 20 20 22 Q16 18 20 14Z"
        fill="#FFD54F" />
    </svg>
  );
}
