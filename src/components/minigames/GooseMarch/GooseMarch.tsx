import { CSSProperties, useState, useEffect } from 'react';
import { MinigameWrapper, MinigameChildProps } from '../shared/MinigameWrapper';
import { useExerciseStore } from '../../../store/exerciseStore';
import { useProgressStore } from '../../../store/progressStore';
import type { Exercise } from '../../../types/farm';

export function GooseMarch() {
  return (
    <MinigameWrapper title="🪿 Husí pochod" category="prefixes" totalQuestions={10}>
      {(props) => <GooseMarchGame {...props} />}
    </MinigameWrapper>
  );
}

function GooseMarchGame({
  onCorrect,
  onWrong,
  showHint,
  requestHint,
  isGooseFever: _isGooseFever,
  correctDelay,
  wrongDelay,
  addToHistory,
}: MinigameChildProps) {
  void _isGooseFever; // Handled by wrapper
  const { getRandomExercise, markExerciseUsed } = useExerciseStore();
  const { getCategoryDifficulty } = useProgressStore();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [goosePosition, setGoosePosition] = useState(0);

  useEffect(() => {
    loadNextExercise();
  }, []);

  // Animace husy
  useEffect(() => {
    if (!isAnswered) {
      const interval = setInterval(() => {
        setGoosePosition((p) => (p + 1) % 20);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isAnswered]);

  const loadNextExercise = () => {
    const difficulty = getCategoryDifficulty('prefixes');
    const ex = getRandomExercise('prefixes', difficulty);
    if (ex) {
      setExercise(ex);
      markExerciseUsed(ex.id);
    }
    setSelectedGate(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleGateSelect = (gate: string) => {
    if (isAnswered || !exercise) return;

    setSelectedGate(gate);
    setIsAnswered(true);

    const correct = gate === exercise.answer;
    setIsCorrect(correct);

    // Přidat do historie
    addToHistory({
      word: exercise.word,
      answer: exercise.answer,
      userAnswer: gate,
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
    gap: '20px',
    width: '100%',
    maxWidth: '600px',
  };

  const roadStyle: CSSProperties = {
    width: '100%',
    height: '100px',
    background: 'linear-gradient(180deg, #8d6e63 0%, #6d4c41 100%)',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const gooseStyle: CSSProperties = {
    fontSize: '48px',
    position: 'absolute',
    left: `${10 + goosePosition}%`,
    transition: 'left 0.2s ease',
    animation: 'waddle 0.4s infinite',
  };

  const gatesContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const gateStyle = (option: string): CSSProperties => {
    let background = 'linear-gradient(180deg, #a1887f 0%, #8d6e63 100%)';
    let borderColor = '#5d4037';

    if (isAnswered && option === exercise.answer) {
      background = 'linear-gradient(180deg, #81c784 0%, #66bb6a 100%)';
      borderColor = '#43a047';
    } else if (isAnswered && option === selectedGate && !isCorrect) {
      background = 'linear-gradient(180deg, #e57373 0%, #ef5350 100%)';
      borderColor = '#d32f2f';
    }

    return {
      width: 'clamp(80px, 20vw, 100px)',
      height: 'clamp(120px, 30vw, 150px)',
      background,
      border: `4px solid ${borderColor}`,
      borderRadius: '10px 10px 0 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      cursor: isAnswered ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      paddingTop: '10px',
    };
  };

  const gateTopStyle: CSSProperties = {
    width: '100%',
    height: '30px',
    background: '#5d4037',
    borderRadius: '5px 5px 0 0',
    position: 'absolute',
    top: '-15px',
  };

  const gateLabelStyle: CSSProperties = {
    fontSize: 'clamp(20px, 5vw, 28px)',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    marginTop: '20px',
  };

  const wordDisplayStyle: CSSProperties = {
    background: 'white',
    padding: '20px 40px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  const wordStyle: CSSProperties = {
    fontSize: 'clamp(24px, 6vw, 36px)',
    fontWeight: 'bold',
    color: '#333',
  };

  const blankStyle: CSSProperties = {
    color: '#1976d2',
    textDecoration: 'underline',
    minWidth: '40px',
    display: 'inline-block',
  };

  const hintStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
  };

  const ruleStyle: CSSProperties = {
    background: isCorrect ? '#c8e6c9' : '#ffcdd2',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#333',
    textAlign: 'center',
    maxWidth: '300px',
  };

  const renderWord = () => {
    const parts = exercise.word.split('_');
    return (
      <>
        <span style={blankStyle}>{isAnswered ? exercise.answer : '?'}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={wordDisplayStyle}>
        <div style={wordStyle}>{renderWord()}</div>
      </div>

      {showHint && !isAnswered && (
        <div style={hintStyle}>💡 {exercise.hint}</div>
      )}

      <div style={roadStyle}>
        <div style={gooseStyle}>🪿</div>
        {/* Čáry na cestě */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * 10 + 5}%`,
              width: '20px',
              height: '4px',
              background: '#ffeb3b',
              borderRadius: '2px',
            }}
          />
        ))}
      </div>

      <div style={gatesContainerStyle}>
        {exercise.options?.map((option) => (
          <div
            key={option}
            style={gateStyle(option)}
            onClick={() => handleGateSelect(option)}
          >
            <div style={gateTopStyle} />
            <div style={gateLabelStyle}>{option}</div>
            {isAnswered && option === exercise.answer && (
              <div style={{ fontSize: '32px', marginTop: '10px' }}>✓</div>
            )}
          </div>
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
        @keyframes waddle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
