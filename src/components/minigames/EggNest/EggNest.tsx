import { CSSProperties, useState, useEffect } from 'react';
import { MinigameWrapper, MinigameChildProps } from '../shared/MinigameWrapper';
import { useExerciseStore } from '../../../store/exerciseStore';
import { useProgressStore } from '../../../store/progressStore';
import type { Exercise } from '../../../types/farm';

export function EggNest() {
  return (
    <MinigameWrapper title="🥚 Vejce v hnízdě" category="softHardIY" totalQuestions={10}>
      {(props) => <EggNestGame {...props} />}
    </MinigameWrapper>
  );
}

function EggNestGame({
  onCorrect,
  onWrong,
  streak: _streak,
  isGooseFever,
  showHint,
  requestHint,
  correctDelay,
  wrongDelay,
  addToHistory,
}: MinigameChildProps) {
  void _streak; // Used for display only
  const { getRandomExercise, markExerciseUsed } = useExerciseStore();
  const { getCategoryDifficulty } = useProgressStore();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadNextExercise();
  }, []);

  const loadNextExercise = () => {
    const difficulty = getCategoryDifficulty('softHardIY');
    const ex = getRandomExercise('softHardIY', difficulty);
    if (ex) {
      setExercise(ex);
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

  const nestStyle: CSSProperties = {
    background: 'linear-gradient(180deg, #8d6e63 0%, #6d4c41 100%)',
    borderRadius: '50%',
    width: 'min(80vw, 300px)',
    height: 'min(40vw, 150px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 -10px 20px rgba(0,0,0,0.2)',
    position: 'relative',
  };

  const wordStyle: CSSProperties = {
    fontSize: 'clamp(24px, 6vw, 36px)',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    letterSpacing: '2px',
  };

  const blankStyle: CSSProperties = {
    color: '#ffeb3b',
    fontSize: 'clamp(28px, 7vw, 42px)',
    fontWeight: 'bold',
    textDecoration: 'underline',
    minWidth: '30px',
    display: 'inline-block',
    textAlign: 'center',
  };

  const eggsContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const eggStyle = (option: string): CSSProperties => {
    let background = 'linear-gradient(180deg, #fff8e1 0%, #ffecb3 100%)';
    let transform = 'scale(1)';
    let boxShadow = '0 6px 12px rgba(0,0,0,0.2)';

    if (isAnswered && option === exercise.answer) {
      background = 'linear-gradient(180deg, #c8e6c9 0%, #a5d6a7 100%)';
      transform = 'scale(1.1)';
    } else if (isAnswered && option === selectedAnswer && !isCorrect) {
      background = 'linear-gradient(180deg, #ffcdd2 0%, #ef9a9a 100%)';
      transform = 'scale(0.95)';
    }

    return {
      width: 'clamp(70px, 15vw, 90px)',
      height: 'clamp(90px, 20vw, 120px)',
      background,
      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isAnswered ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      transform,
      boxShadow,
      fontSize: 'clamp(20px, 5vw, 28px)',
      fontWeight: 'bold',
      color: '#5d4037',
    };
  };

  const hintStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#666',
    maxWidth: '300px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const ruleStyle: CSSProperties = {
    background: isCorrect ? '#c8e6c9' : '#ffcdd2',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#333',
    maxWidth: '300px',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease',
  };

  const feedbackStyle: CSSProperties = {
    fontSize: '48px',
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    animation: 'pop 0.3s ease',
  };

  // Render word with blank
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
      <div style={nestStyle}>
        <div style={wordStyle}>{renderWord()}</div>
        {isAnswered && (
          <div style={feedbackStyle}>{isCorrect ? '✓' : '✗'}</div>
        )}
      </div>

      {showHint && !isAnswered && (
        <div style={hintStyle}>💡 {exercise.hint}</div>
      )}

      {isAnswered && <div style={ruleStyle}>📚 {exercise.rule}</div>}

      <div style={eggsContainerStyle}>
        {exercise.options?.map((option) => (
          <div
            key={option}
            style={eggStyle(option)}
            onClick={() => handleAnswer(option)}
          >
            {option}
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
          💡 Potřebuji nápovědu
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
