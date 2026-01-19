import { CSSProperties, useState, useEffect } from 'react';
import { MinigameWrapper, MinigameChildProps } from '../shared/MinigameWrapper';
import { useExerciseStore } from '../../../store/exerciseStore';
import { useProgressStore } from '../../../store/progressStore';
import type { Exercise } from '../../../types/farm';

export function GooseDetective() {
  return (
    <MinigameWrapper title="🔍 Husí detektiv" category="sentences" totalQuestions={10}>
      {(props) => <GooseDetectiveGame {...props} />}
    </MinigameWrapper>
  );
}

function GooseDetectiveGame({
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

  useEffect(() => {
    loadNextExercise();
  }, []);

  const loadNextExercise = () => {
    const difficulty = getCategoryDifficulty('sentences');
    const ex = getRandomExercise('sentences', difficulty);
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
    maxWidth: '600px',
  };

  const detectiveStyle: CSSProperties = {
    fontSize: '64px',
    animation: 'look 2s infinite',
  };

  const sentenceCardStyle: CSSProperties = {
    background: 'white',
    padding: '24px 32px',
    borderRadius: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    textAlign: 'center',
    maxWidth: '100%',
    position: 'relative',
  };

  const sentenceStyle: CSSProperties = {
    fontSize: 'clamp(18px, 4vw, 24px)',
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 1.6,
  };

  const magnifyingGlassStyle: CSSProperties = {
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    fontSize: '40px',
    transform: 'rotate(-30deg)',
  };

  const questionStyle: CSSProperties = {
    fontSize: '16px',
    color: '#666',
    fontStyle: 'italic',
  };

  const optionsStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const optionStyle = (option: string): CSSProperties => {
    let background = 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)';
    let borderColor = '#ffb74d';
    let transform = 'scale(1)';

    if (isAnswered && option === exercise.answer) {
      background = 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)';
      borderColor = '#66bb6a';
      transform = 'scale(1.05)';
    } else if (isAnswered && option === selectedAnswer && !isCorrect) {
      background = 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)';
      borderColor = '#e57373';
      transform = 'scale(0.95)';
    }

    return {
      padding: '14px 24px',
      fontSize: 'clamp(14px, 3vw, 18px)',
      fontWeight: 'bold',
      background,
      border: `3px solid ${borderColor}`,
      borderRadius: '12px',
      cursor: isAnswered ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      transform,
      minWidth: '120px',
    };
  };

  const hintStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
  };

  const ruleStyle: CSSProperties = {
    background: isCorrect ? '#c8e6c9' : '#ffcdd2',
    padding: '14px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#333',
    textAlign: 'center',
    maxWidth: '400px',
  };

  // Pro tento typ mini-hry zobrazíme větu a možnosti opravy
  const isCorrectSentence = exercise.answer === 'správně';

  return (
    <div style={containerStyle}>
      <div style={detectiveStyle}>🪿🔍</div>

      <div style={sentenceCardStyle}>
        <div style={magnifyingGlassStyle}>🔍</div>
        <div style={sentenceStyle}>„{exercise.word}"</div>
      </div>

      <div style={questionStyle}>
        {isCorrectSentence
          ? 'Je tato věta správně?'
          : 'Jaký je správný tvar?'}
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
            {option === 'správně' ? '✓ Správně' : option === 'chyba' ? '✗ Je tam chyba' : option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div style={ruleStyle}>
          {isCorrect ? '🎉 ' : '💡 '}
          {exercise.rule}
        </div>
      )}

      {!showHint && !isAnswered && (
        <button
          onClick={requestHint}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff9800',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline',
          }}
        >
          💡 Potřebuji nápovědu
        </button>
      )}

      <style>{`
        @keyframes look {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
