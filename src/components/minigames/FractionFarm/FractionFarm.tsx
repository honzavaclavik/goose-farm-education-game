import { CSSProperties, useState, useEffect, ReactNode } from 'react';
import { MinigameWrapper, MinigameChildProps } from '../shared/MinigameWrapper';
import { useExerciseStore } from '../../../store/exerciseStore';
import { useProgressStore } from '../../../store/progressStore';
import { Button } from '../../common/Button';
import type { Exercise } from '../../../types/farm';

/** Renders a single fraction like "2/4" as stacked numerator / line / denominator */
function FractionDisplay({ numerator, denominator, fontSize }: { numerator: string; denominator: string; fontSize?: string }) {
  const size = fontSize ?? '1em';
  const digitSize = `calc(${size} * 0.75)`;
  return (
    <span style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      verticalAlign: 'middle',
      lineHeight: 1.1,
      margin: '0 2px',
    }}>
      <span style={{ fontSize: digitSize }}>{numerator}</span>
      <span style={{
        width: '100%',
        minWidth: `calc(${digitSize} + 8px)`,
        height: '2px',
        background: 'currentColor',
        borderRadius: '1px',
      }} />
      <span style={{ fontSize: digitSize }}>{denominator}</span>
    </span>
  );
}

/** Parses a text string and replaces fraction patterns (e.g. "1/2") with stacked fraction components */
function renderFractions(text: string, fontSize?: string): ReactNode {
  // Match fractions like 1/2, 12/34 but not inside longer words
  const parts = text.split(/(\d+\/\d+)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    const match = part.match(/^(\d+)\/(\d+)$/);
    if (match) {
      return <FractionDisplay key={i} numerator={match[1]} denominator={match[2]} fontSize={fontSize} />;
    }
    return <span key={i}>{part}</span>;
  });
}

const difficultyLabels: Record<number, { name: string; description: string }> = {
  1: { name: 'Začátečník', description: 'Sčítání a odčítání zlomků' },
  2: { name: 'Pokročilý', description: 'Porovnávání a složitější operace' },
  3: { name: 'Zkušený', description: 'Zlomky z čísel (1/2 z 10)' },
  4: { name: 'Expert', description: 'Složené zlomky (2/3 z 18)' },
  5: { name: 'Mistr', description: 'Slovní úlohy a zlomkové části' },
};

export function FractionFarm() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const { getCategoryDifficulty } = useProgressStore();
  const { exercises } = useExerciseStore();

  // Zjistíme kolik cvičení je pro každou obtížnost
  const getExerciseCount = (difficulty: number) => {
    return exercises.fractions.filter((ex) => ex.difficulty === difficulty).length;
  };

  if (selectedDifficulty === null) {
    const recommendedDifficulty = getCategoryDifficulty('fractions');

    const containerStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)',
    };

    const cardStyle: CSSProperties = {
      background: 'white',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      maxWidth: '500px',
      width: '100%',
    };

    const titleStyle: CSSProperties = {
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '8px',
      color: '#1976d2',
    };

    const subtitleStyle: CSSProperties = {
      fontSize: '14px',
      textAlign: 'center',
      marginBottom: '24px',
      color: '#666',
    };

    const difficultyGridStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '24px',
    };

    const getDifficultyButtonStyle = (_level: number, isRecommended: boolean): CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderRadius: '12px',
      border: isRecommended ? '3px solid #4caf50' : '2px solid #e0e0e0',
      background: isRecommended ? '#e8f5e9' : 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
    });

    const levelIndicatorStyle = (_level: number): CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    });

    const starsStyle: CSSProperties = {
      fontSize: '18px',
    };

    const labelContainerStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    };

    const levelNameStyle: CSSProperties = {
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#333',
    };

    const levelDescStyle: CSSProperties = {
      fontSize: '12px',
      color: '#666',
    };

    const countBadgeStyle: CSSProperties = {
      background: '#f5f5f5',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      color: '#666',
    };

    const recommendedBadgeStyle: CSSProperties = {
      background: '#4caf50',
      color: 'white',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
    };

    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={titleStyle}>🧮 Zlomková farma</div>
          <div style={subtitleStyle}>Vyber si obtížnost</div>

          <div style={difficultyGridStyle}>
            {[1, 2, 3, 4, 5].map((level) => {
              const isRecommended = level === recommendedDifficulty;
              const count = getExerciseCount(level);
              const info = difficultyLabels[level];

              return (
                <div
                  key={level}
                  style={getDifficultyButtonStyle(level, isRecommended)}
                  onClick={() => setSelectedDifficulty(level)}
                  onMouseEnter={(e) => {
                    if (!isRecommended) {
                      e.currentTarget.style.borderColor = '#1976d2';
                      e.currentTarget.style.background = '#e3f2fd';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isRecommended) {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                >
                  <div style={levelIndicatorStyle(level)}>
                    <div style={starsStyle}>
                      {'⭐'.repeat(level)}
                    </div>
                    <div style={labelContainerStyle}>
                      <div style={levelNameStyle}>{info.name}</div>
                      <div style={levelDescStyle}>{info.description}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {isRecommended && <div style={recommendedBadgeStyle}>Doporučeno</div>}
                    <div style={countBadgeStyle}>{count} úloh</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Button
              variant="primary"
              size="large"
              onClick={() => setSelectedDifficulty(recommendedDifficulty)}
            >
              ▶ Začít s doporučenou obtížností
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MinigameWrapper title="🧮 Zlomková farma" category="fractions" totalQuestions={10}>
      {(props) => <FractionFarmGame {...props} forcedDifficulty={selectedDifficulty} />}
    </MinigameWrapper>
  );
}

interface FractionFarmGameProps extends MinigameChildProps {
  forcedDifficulty?: number;
}

function FractionFarmGame({
  onCorrect,
  onWrong,
  streak: _streak,
  isGooseFever,
  showHint,
  requestHint,
  correctDelay,
  wrongDelay,
  addToHistory,
  forcedDifficulty,
}: FractionFarmGameProps) {
  void _streak;
  const { markExerciseUsed, exercises } = useExerciseStore();
  const { getCategoryDifficulty } = useProgressStore();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNextExercise();
  }, []);

  const loadNextExercise = () => {
    // Použij zvolenou obtížnost, jinak automatickou
    const difficulty = forcedDifficulty ?? getCategoryDifficulty('fractions');

    // Filtrujeme přímo podle zvolené obtížnosti (přesně, ne <=)
    const available = exercises.fractions.filter(
      (ex) => ex.difficulty === difficulty && !usedIds.has(ex.id)
    );

    let ex: Exercise | null = null;
    if (available.length > 0) {
      ex = available[Math.floor(Math.random() * available.length)];
    } else {
      // Reset pokud jsme prošli všechny
      setUsedIds(new Set());
      const allForDifficulty = exercises.fractions.filter(
        (ex) => ex.difficulty === difficulty
      );
      if (allForDifficulty.length > 0) {
        ex = allForDifficulty[Math.floor(Math.random() * allForDifficulty.length)];
      }
    }

    if (ex) {
      setExercise(ex);
      setUsedIds((prev) => new Set([...prev, ex!.id]));
      markExerciseUsed(ex.id);
    }
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered || !exercise) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const correct = answer === exercise.answer;
    setIsCorrect(correct);

    addToHistory({
      word: exercise.word,
      answer: exercise.answer,
      userAnswer: answer,
      isCorrect: correct,
    });

    // Zvuky se přehrají ihned při vyhodnocení
    if (correct) {
      onCorrect();
    } else {
      onWrong();
    }

    // Načtení dalšího příkladu až po prodlevě
    const delay = correct ? correctDelay : wrongDelay;
    setTimeout(() => {
      loadNextExercise();
    }, delay);
  };

  if (!exercise) {
    return <div>Nacitam cviceni...</div>;
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    width: '100%',
    maxWidth: '500px',
  };

  const barnStyle: CSSProperties = {
    background: 'linear-gradient(180deg, #d32f2f 0%, #b71c1c 100%)',
    borderRadius: '20px 20px 0 0',
    width: 'min(90vw, 400px)',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    position: 'relative',
  };

  const roofStyle: CSSProperties = {
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '80px solid transparent',
    borderRight: '80px solid transparent',
    borderBottom: '40px solid #8b4513',
  };

  const questionStyle: CSSProperties = {
    fontSize: 'clamp(18px, 5vw, 28px)',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    textAlign: 'center',
    lineHeight: 1.4,
  };

  const optionsContainerStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    width: '100%',
    maxWidth: '400px',
  };

  const getOptionStyle = (option: string): CSSProperties => {
    let background = 'linear-gradient(180deg, #fff8e1 0%, #ffe0b2 100%)';
    let transform = 'scale(1)';
    let boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    let border = '3px solid #ff9800';

    if (isAnswered && option === exercise.answer) {
      background = 'linear-gradient(180deg, #c8e6c9 0%, #81c784 100%)';
      border = '3px solid #4caf50';
      transform = 'scale(1.05)';
    } else if (isAnswered && option === selectedAnswer && !isCorrect) {
      background = 'linear-gradient(180deg, #ffcdd2 0%, #ef9a9a 100%)';
      border = '3px solid #f44336';
      transform = 'scale(0.95)';
    }

    return {
      background,
      border,
      borderRadius: '16px',
      padding: '16px 12px',
      cursor: isAnswered ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      transform,
      boxShadow,
      fontSize: 'clamp(16px, 4vw, 22px)',
      fontWeight: 'bold',
      color: '#5d4037',
      textAlign: 'center',
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

  const hintStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#666',
    maxWidth: '350px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const ruleStyle: CSSProperties = {
    background: isCorrect ? '#c8e6c9' : '#ffcdd2',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#333',
    maxWidth: '350px',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease',
  };

  const feedbackStyle: CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '36px',
    animation: 'pop 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={{ position: 'relative', marginTop: '40px' }}>
        <div style={roofStyle} />
        <div style={barnStyle}>
          <div style={questionStyle}>{renderFractions(exercise.word, 'clamp(18px, 5vw, 28px)')}</div>
          {isAnswered && (
            <div style={feedbackStyle}>{isCorrect ? '✓' : '✗'}</div>
          )}
        </div>
      </div>

      {showHint && !isAnswered && (
        <div style={hintStyle}>💡 {renderFractions(exercise.hint, '14px')}</div>
      )}

      {isAnswered && <div style={ruleStyle}>📚 {renderFractions(exercise.rule, '14px')}</div>}

      <div style={optionsContainerStyle}>
        {exercise.options?.map((option) => (
          <div
            key={option}
            style={getOptionStyle(option)}
            onClick={() => handleAnswer(option)}
          >
            {renderFractions(option, 'clamp(16px, 4vw, 22px)')}
          </div>
        ))}
      </div>

      {!showHint && !isAnswered && (
        <button
          onClick={requestHint}
          style={{
            background: 'none',
            border: 'none',
            color: '#1976d2',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline',
          }}
        >
          💡 Potrebuji napovedu
        </button>
      )}

      {isGooseFever && (
        <div
          style={{
            background: '#ffeb3b',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 'bold',
            animation: 'pulse 0.5s infinite',
          }}
        >
          🪿 2x BODY! 🪿
        </div>
      )}

      <style>{`
        @keyframes pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
