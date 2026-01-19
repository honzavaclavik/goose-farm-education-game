import { CSSProperties, useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { useGameStore } from '../../store/gameStore';
import { useProgressStore } from '../../store/progressStore';
import { useCurrencyStore } from '../../store/currencyStore';
import { useSound } from '../../hooks/useSound';

interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  emoji: string;
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
  // Použijeme datum jako seed pro konzistentní výzvy každý den
  const seed = date.split('-').reduce((acc, val) => acc + parseInt(val, 10), 0);

  const allChallenges: DailyChallenge[] = [
    {
      id: 'games_3',
      name: 'Denní praxe',
      description: 'Zahraj 3 mini-hry',
      emoji: '🎮',
      requirement: { type: 'games', value: 3 },
      reward: { eggs: 10, feathers: 0, xp: 50 },
    },
    {
      id: 'games_5',
      name: 'Pilný student',
      description: 'Zahraj 5 mini-her',
      emoji: '📚',
      requirement: { type: 'games', value: 5 },
      reward: { eggs: 20, feathers: 1, xp: 100 },
    },
    {
      id: 'correct_10',
      name: 'Správné odpovědi',
      description: 'Odpověz správně 10krát',
      emoji: '✅',
      requirement: { type: 'correct', value: 10 },
      reward: { eggs: 15, feathers: 0, xp: 75 },
    },
    {
      id: 'correct_20',
      name: 'Pravopisný mistr',
      description: 'Odpověz správně 20krát',
      emoji: '⭐',
      requirement: { type: 'correct', value: 20 },
      reward: { eggs: 30, feathers: 1, xp: 150 },
    },
    {
      id: 'streak_5',
      name: 'Série!',
      description: 'Dosáhni série 5 správných',
      emoji: '🔥',
      requirement: { type: 'streak', value: 5 },
      reward: { eggs: 25, feathers: 1, xp: 100 },
    },
    {
      id: 'streak_10',
      name: 'Husí horečka',
      description: 'Dosáhni série 10 správných',
      emoji: '🪿',
      requirement: { type: 'streak', value: 10 },
      reward: { eggs: 50, feathers: 3, xp: 200 },
    },
  ];

  // Vyber 3 náhodné výzvy na základě seedu
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
    // Nový den - resetovat výzvy
    return {
      date: today,
      challenges: generateDailyChallenges(today),
      progress: {},
      claimed: [],
    };
  });

  // Uložit stav při změně
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Aktualizovat progress
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

    // Dát odměnu
    addEggs(challenge.reward.eggs);
    addFeathers(challenge.reward.feathers);
    addXp(challenge.reward.xp);
    play('purchase');

    setState((prev) => ({
      ...prev,
      claimed: [...prev.claimed, challenge.id],
    }));
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #ff6f00 0%, #ff9800 100%)',
  };

  const headerStyle: CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: 'white',
  };

  const titleStyle: CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
    marginBottom: '8px',
  };

  const dateStyle: CSSProperties = {
    fontSize: '14px',
    opacity: 0.8,
  };

  const listStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    flex: 1,
  };

  const challengeCardStyle = (
    completed: boolean,
    claimed: boolean
  ): CSSProperties => ({
    background: claimed
      ? 'rgba(76, 175, 80, 0.9)'
      : completed
      ? 'rgba(255, 255, 255, 0.95)'
      : 'rgba(255, 255, 255, 0.8)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  });

  const emojiStyle: CSSProperties = {
    fontSize: '40px',
    minWidth: '50px',
    textAlign: 'center',
  };

  const contentStyle: CSSProperties = {
    flex: 1,
  };

  const nameStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  };

  const descStyle: CSSProperties = {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px',
  };

  const rewardStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#888',
  };

  const footerStyle: CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    background: 'rgba(0, 0, 0, 0.2)',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>📅 Denní výzvy</h1>
        <div style={dateStyle}>{formatDate(today)}</div>
      </div>

      <div style={listStyle}>
        {state.challenges.map((challenge) => {
          const currentProgress = state.progress[challenge.id] || 0;
          const isCompleted = currentProgress >= challenge.requirement.value;
          const isClaimed = state.claimed.includes(challenge.id);

          return (
            <div
              key={challenge.id}
              style={challengeCardStyle(isCompleted, isClaimed)}
            >
              <div style={emojiStyle}>
                {isClaimed ? '✅' : challenge.emoji}
              </div>
              <div style={contentStyle}>
                <div style={nameStyle}>{challenge.name}</div>
                <div style={descStyle}>{challenge.description}</div>

                <ProgressBar
                  current={Math.min(currentProgress, challenge.requirement.value)}
                  max={challenge.requirement.value}
                  color={isCompleted ? '#4caf50' : '#ff9800'}
                  height={8}
                  label={`${Math.min(currentProgress, challenge.requirement.value)}/${challenge.requirement.value}`}
                />

                <div style={rewardStyle}>
                  {challenge.reward.eggs > 0 && (
                    <span>🥚 +{challenge.reward.eggs}</span>
                  )}
                  {challenge.reward.feathers > 0 && (
                    <span>🪶 +{challenge.reward.feathers}</span>
                  )}
                  {challenge.reward.xp > 0 && (
                    <span>⭐ +{challenge.reward.xp} XP</span>
                  )}
                </div>
              </div>

              {isCompleted && !isClaimed && (
                <Button
                  onClick={() => claimReward(challenge)}
                  variant="success"
                  size="small"
                >
                  Vyzvednout
                </Button>
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
    </div>
  );
}
