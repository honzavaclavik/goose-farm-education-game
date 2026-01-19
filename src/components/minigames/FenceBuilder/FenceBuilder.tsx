import { CSSProperties, useState, useEffect } from 'react';
import { MinigameWrapper, MinigameChildProps } from '../shared/MinigameWrapper';
import { useExerciseStore } from '../../../store/exerciseStore';
import { useProgressStore } from '../../../store/progressStore';
import type { Exercise } from '../../../types/farm';

export function FenceBuilder() {
  return (
    <MinigameWrapper title="🏗️ Stavba plotu" category="vowelLength" totalQuestions={10}>
      {(props) => <FenceBuilderGame {...props} />}
    </MinigameWrapper>
  );
}

function FenceBuilderGame({
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
  const [fencePieces, setFencePieces] = useState(0);

  useEffect(() => {
    loadNextExercise();
  }, []);

  const loadNextExercise = () => {
    const difficulty = getCategoryDifficulty('vowelLength');
    const ex = getRandomExercise('vowelLength', difficulty);
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

    if (correct) {
      setFencePieces((f) => f + 1);
    }

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

  const fenceAreaStyle: CSSProperties = {
    width: '100%',
    height: '80px',
    background: 'linear-gradient(180deg, #a5d6a7 0%, #81c784 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '10px',
    gap: '4px',
    overflow: 'hidden',
  };

  const fencePieceStyle = (built: boolean): CSSProperties => ({
    width: '30px',
    height: '50px',
    background: built
      ? 'linear-gradient(180deg, #8d6e63 0%, #6d4c41 100%)'
      : 'rgba(141, 110, 99, 0.3)',
    borderRadius: '4px 4px 0 0',
    transition: 'all 0.3s ease',
    transform: built ? 'scaleY(1)' : 'scaleY(0.5)',
    transformOrigin: 'bottom',
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
  };

  const blankStyle: CSSProperties = {
    color: '#8d6e63',
    textDecoration: 'underline',
    minWidth: '30px',
    display: 'inline-block',
  };

  const optionsStyle: CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  };

  const plankStyle = (option: string): CSSProperties => {
    let background = 'linear-gradient(180deg, #d7ccc8 0%, #bcaaa4 100%)';
    let transform = 'rotate(0deg)';

    if (isAnswered && option === exercise.answer) {
      background = 'linear-gradient(180deg, #a5d6a7 0%, #81c784 100%)';
    } else if (isAnswered && option === selectedAnswer && !isCorrect) {
      background = 'linear-gradient(180deg, #ef9a9a 0%, #e57373 100%)';
      transform = 'rotate(-10deg)';
    }

    return {
      width: 'clamp(60px, 15vw, 80px)',
      height: 'clamp(100px, 25vw, 130px)',
      background,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isAnswered ? 'default' : 'pointer',
      transition: 'all 0.3s ease',
      transform,
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      fontSize: 'clamp(20px, 5vw, 28px)',
      fontWeight: 'bold',
      color: '#5d4037',
      border: '3px solid #8d6e63',
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
    maxWidth: '350px',
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
      <div style={fenceAreaStyle}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={fencePieceStyle(i < fencePieces)} />
        ))}
      </div>

      <div style={wordCardStyle}>
        <div style={wordStyle}>{renderWord()}</div>
      </div>

      {showHint && !isAnswered && (
        <div style={hintStyle}>💡 {exercise.hint}</div>
      )}

      <div style={optionsStyle}>
        {exercise.options?.map((option) => (
          <div
            key={option}
            style={plankStyle(option)}
            onClick={() => handleAnswer(option)}
          >
            {option}
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
            color: '#8d6e63',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline',
          }}
        >
          💡 Potřebuji nápovědu
        </button>
      )}
    </div>
  );
}
