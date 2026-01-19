import { CSSProperties, useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { useGameStore } from '../../store/gameStore';
import { useProgressStore } from '../../store/progressStore';
import { useFarmStore } from '../../store/farmStore';
import { useSound } from '../../hooks/useSound';
import { achievements, checkAchievementUnlocked } from '../../data/achievements';

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

  // Kontrola a odemknutí achievementů
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

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a237e 0%, #3949ab 100%)',
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

  const statsStyle: CSSProperties = {
    fontSize: '14px',
    opacity: 0.8,
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    padding: '16px',
    flex: 1,
    overflowY: 'auto',
  };

  const achievementCardStyle = (
    unlocked: boolean,
    isNew: boolean
  ): CSSProperties => ({
    background: unlocked
      ? isNew
        ? 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)'
        : 'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)'
      : 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
    opacity: unlocked ? 1 : 0.5,
    transition: 'all 0.3s ease',
    animation: isNew ? 'glow 1s infinite alternate' : 'none',
  });

  const emojiStyle: CSSProperties = {
    fontSize: '40px',
    marginBottom: '8px',
  };

  const nameStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '4px',
  };

  const descStyle: CSSProperties = {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.8)',
  };

  const footerStyle: CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    background: 'rgba(0, 0, 0, 0.2)',
  };

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🏆 Úspěchy</h1>
        <div style={statsStyle}>
          {unlockedCount} / {totalCount} ({progressPercent}%)
        </div>
        <div
          style={{
            marginTop: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            height: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ffd700 0%, #ffb300 100%)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      <div style={gridStyle}>
        {achievements.map((achievement) => {
          const unlocked = unlockedAchievements.includes(achievement.id);
          const isNew = newlyUnlocked.includes(achievement.id);

          return (
            <div
              key={achievement.id}
              style={achievementCardStyle(unlocked, isNew)}
            >
              <div style={emojiStyle}>
                {unlocked ? achievement.emoji : '🔒'}
              </div>
              <div style={nameStyle}>{achievement.name}</div>
              <div style={descStyle}>{achievement.description}</div>
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
        @keyframes glow {
          from { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
          to { box-shadow: 0 0 25px rgba(255, 215, 0, 0.9); }
        }
      `}</style>
    </div>
  );
}
