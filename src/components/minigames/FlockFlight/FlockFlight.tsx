import { CSSProperties, useState, useEffect } from 'react';
import { MinigameWrapper, MinigameChildProps } from '../shared/MinigameWrapper';
import { useExerciseStore } from '../../../store/exerciseStore';
import { useProgressStore } from '../../../store/progressStore';
import type { Exercise } from '../../../types/farm';

export function FlockFlight() {
  return (
    <MinigameWrapper title="🦆 Přelet hejna" category="declaredWords" totalQuestions={10}>
      {(props) => <FlockFlightGame {...props} />}
    </MinigameWrapper>
  );
}

function FlockFlightGame({
  onCorrect,
  onWrong,
  showHint,
  requestHint,
  correctDelay,
  wrongDelay,
  addToHistory,
}: MinigameChildProps) {
  const { getRandomExercise, markExerciseUsed } = useExerciseStore();
  const { getCategoryDifficulty } = useProgressStore();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [birdPositions, setBirdPositions] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    loadNextExercise();
  }, []);

  // Animace ptáků
  useEffect(() => {
    if (!isAnswered) {
      const interval = setInterval(() => {
        setBirdPositions((prev) =>
          prev.map((p, i) => (p + 2 + i * 0.5) % 100)
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isAnswered]);

  const loadNextExercise = () => {
    const difficulty = getCategoryDifficulty('declaredWords');
    const ex = getRandomExercise('declaredWords', difficulty);
    if (ex) {
      setExercise(ex);
      markExerciseUsed(ex.id);
    }
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setBirdPositions([0, 10, 20]);
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered || !exercise) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const correct = answer === exercise.answer;
    setIsCorrect(correct);

    // Přidat do historie
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
    return <div>Načítám cvičení...</div>;
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    width: '100%',
    maxWidth: '500px',
  };

  const skyStyle: CSSProperties = {
    width: '100%',
    height: '150px',
    background: 'linear-gradient(180deg, #64b5f6 0%, #90caf9 100%)',
    borderRadius: '20px',
    position: 'relative',
    overflow: 'hidden',
  };

  const cloudStyle = (left: number, top: number): CSSProperties => ({
    position: 'absolute',
    left: `${left}%`,
    top: `${top}%`,
    fontSize: '40px',
    opacity: 0.7,
  });

  const birdStyle = (index: number): CSSProperties => ({
    position: 'absolute',
    left: `${birdPositions[index]}%`,
    top: `${20 + index * 25}%`,
    fontSize: '32px',
    transition: 'left 0.1s linear',
    transform: 'scaleX(-1)',
  });

  const wordCardStyle: CSSProperties = {
    background: 'white',
    padding: '24px 48px',
    borderRadius: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    textAlign: 'center',
  };

  const wordStyle: CSSProperties = {
    fontSize: 'clamp(28px, 7vw, 40px)',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  };

  const blankStyle: CSSProperties = {
    color: '#1976d2',
    textDecoration: 'underline',
    minWidth: '30px',
    display: 'inline-block',
  };

  const optionsStyle: CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  };

  const optionStyle = (option: string): CSSProperties => {
    let background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)';
    let borderColor = '#64b5f6';
    let transform = 'scale(1)';

    if (isAnswered && option === exercise.answer) {
      background = 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)';
      borderColor = '#66bb6a';
      transform = 'scale(1.1)';
    } else if (isAnswered && option === selectedAnswer && !isCorrect) {
      background = 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)';
      borderColor = '#e57373';
      transform = 'scale(0.95)';
    }

    return {
      padding: '16px 32px',
      fontSize: 'clamp(18px, 4vw, 24px)',
      fontWeight: 'bold',
      background,
      border: `3px solid ${borderColor}`,
      borderRadius: '16px',
      cursor: isAnswered ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      transform,
    };
  };

  const hintStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  const ruleStyle: CSSProperties = {
    background: isCorrect ? '#c8e6c9' : '#ffcdd2',
    padding: '14px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#333',
    textAlign: 'center',
    maxWidth: '350px',
    animation: 'fadeIn 0.3s ease',
  };

  const renderWord = () => {
    const parts = exercise.word.split('_');
    return (
      <>
        {parts[0]}
        <span style={blankStyle}>{isAnswered ? exercise.answer : '?'}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={skyStyle}>
        <div style={cloudStyle(10, 10)}>☁️</div>
        <div style={cloudStyle(60, 20)}>☁️</div>
        <div style={cloudStyle(80, 5)}>☁️</div>
        {birdPositions.map((_, i) => (
          <div key={i} style={birdStyle(i)}>
            🦆
          </div>
        ))}
      </div>

      <div style={wordCardStyle}>
        <div style={wordStyle}>{renderWord()}</div>
        {exercise.hint && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            {exercise.rule.includes('vyjmenované') ? '📖 Vyjmenovaná slova' : '📖 Pravopis'}
          </div>
        )}
      </div>

      {showHint && !isAnswered && (
        <div style={hintStyle}>💡 {exercise.hint}</div>
      )}

      <div style={optionsStyle}>
        {exercise.options?.map((option) => (
          <button
            key={option}
            style={optionStyle(option)}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {isAnswered && <div style={ruleStyle}>📚 {exercise.rule}</div>}

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
          💡 Potřebuji nápovědu
        </button>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
