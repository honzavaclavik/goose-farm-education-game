import { CSSProperties, ReactNode, useState, useEffect } from 'react';
import { Button } from '../../common/Button';
import { ProgressBar } from '../../common/ProgressBar';
import { useGameStore } from '../../../store/gameStore';
import { useCurrencyStore } from '../../../store/currencyStore';
import { useProgressStore } from '../../../store/progressStore';
import { useSound } from '../../../hooks/useSound';
import { useGooseBonus } from '../../../hooks/useGooseBonus';
import type { MinigameResult, ExerciseCategory } from '../../../types/farm';

interface MinigameWrapperProps {
  title: string;
  category: ExerciseCategory;
  totalQuestions?: number;
  children: (props: MinigameChildProps) => ReactNode;
}

export interface AnswerHistoryItem {
  word: string;
  answer: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface MinigameChildProps {
  onCorrect: () => void;
  onWrong: () => void;
  streak: number;
  isGooseFever: boolean;
  showHint: boolean;
  requestHint: () => void;
  /** Delay v ms po správné odpovědi (default 1500) */
  correctDelay: number;
  /** Delay v ms po chybné odpovědi (default 3000 - delší pro čtení vysvětlení) */
  wrongDelay: number;
  /** Přidá odpověď do historie */
  addToHistory: (item: Omit<AnswerHistoryItem, 'isCorrect'> & { isCorrect: boolean }) => void;
}

export function MinigameWrapper({
  title,
  category,
  totalQuestions = 10,
  children,
}: MinigameWrapperProps) {
  const { exitMinigame, settings } = useGameStore();
  const { addEggs, addFeathers } = useCurrencyStore();
  const { addXp, recordGameResult, updateStreak } = useProgressStore();
  const { play } = useSound();
  const { totalEggMultiplier, totalFeatherBonus, isAnyGooseHungry } = useGooseBonus();

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGooseFever, setIsGooseFever] = useState(false);
  const [gooseFeverTimer, setGooseFeverTimer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<MinigameResult | null>(null);
  const [answerHistory, setAnswerHistory] = useState<AnswerHistoryItem[]>([]);

  // Delay konstanty
  const correctDelay = 1500;
  const wrongDelay = 3000; // Delší pro čtení vysvětlení

  const addToHistory = (item: AnswerHistoryItem) => {
    setAnswerHistory((prev) => [...prev, item]);
  };

  // Cleanup goose fever timer
  useEffect(() => {
    return () => {
      if (gooseFeverTimer) clearTimeout(gooseFeverTimer);
    };
  }, [gooseFeverTimer]);

  const calculateRewards = (): MinigameResult => {
    // Základní odměna za správné odpovědi
    let baseEggs = correctAnswers;

    // Streak bonusy
    if (streak >= 3) baseEggs += 1;
    if (streak >= 5) baseEggs += 2;

    // Bonus z hus - násobí základní odměnu
    const eggsEarned = Math.floor(baseEggs * totalEggMultiplier);

    // Peří z hus + streak bonus
    let feathersEarned = totalFeatherBonus;
    if (streak >= 10) feathersEarned += 1;

    // XP
    const xpEarned = correctAnswers * 10 + streak * 5;

    return {
      correctAnswers,
      wrongAnswers,
      streak,
      eggsEarned,
      feathersEarned,
      xpEarned,
      gooseFeverActivated: isGooseFever,
      gooseMultiplier: totalEggMultiplier,
      geeseHungry: isAnyGooseHungry,
    };
  };

  const finishGame = () => {
    const gameResult = calculateRewards();
    setResult(gameResult);
    setIsFinished(true);

    // Aplikovat odměny
    addEggs(gameResult.eggsEarned);
    addFeathers(gameResult.feathersEarned);
    addXp(gameResult.xpEarned);
    recordGameResult(gameResult, category);
  };

  const handleCorrect = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    setCorrectAnswers((c) => c + 1);
    setConsecutiveWrong(0);
    setShowHint(false);
    updateStreak(true);

    // Zvukové efekty
    play('correct');
    if (newStreak === 3 || newStreak === 5) {
      setTimeout(() => play('streak'), 200);
    }

    // Streak milníky
    if (newStreak === 10 && !isGooseFever) {
      setIsGooseFever(true);
      play('gooseFever');
      const timer = window.setTimeout(() => {
        setIsGooseFever(false);
      }, 30000); // 30s goose fever
      setGooseFeverTimer(timer);
    }

    // Další otázka nebo konec
    if (currentQuestion >= totalQuestions) {
      finishGame();
    } else {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const handleWrong = () => {
    setStreak(0);
    setWrongAnswers((w) => w + 1);
    setConsecutiveWrong((c) => c + 1);
    updateStreak(false);
    play('wrong');

    // Nápověda po 2 chybách
    if (consecutiveWrong >= 1 && settings.hintsEnabled) {
      setShowHint(true);
    }

    // Další otázka nebo konec
    if (currentQuestion >= totalQuestions) {
      finishGame();
    } else {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const requestHint = () => {
    if (settings.hintsEnabled) {
      setShowHint(true);
    }
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: isGooseFever
      ? 'linear-gradient(180deg, #ffeb3b 0%, #ffc107 100%)'
      : 'linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)',
    transition: 'background 0.5s ease',
  };

  const headerStyle: CSSProperties = {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const titleRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1976d2',
    margin: 0,
  };

  const statsRowStyle: CSSProperties = {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const statStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  const mainContentStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    padding: '20px',
    overflow: 'hidden',
  };

  const sideColumnStyle: CSSProperties = {
    width: '180px',
    minWidth: '140px',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '12px',
    padding: '12px',
    maxHeight: 'calc(100vh - 200px)',
    overflow: 'hidden',
  };

  // Detekce mobilního zařízení (šířka < 768px)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const columnHeaderStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  };

  const historyListStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    overflowY: 'auto',
    flex: 1,
  };

  const historyItemCorrectStyle: CSSProperties = {
    background: '#c8e6c9',
    padding: '8px 10px',
    borderRadius: '8px',
    fontSize: '13px',
  };

  const historyItemWrongStyle: CSSProperties = {
    background: '#ffcdd2',
    padding: '8px 10px',
    borderRadius: '8px',
    fontSize: '13px',
  };

  const historyWordStyle: CSSProperties = {
    fontWeight: 'bold',
    display: 'block',
  };

  const historyUserAnswerStyle: CSSProperties = {
    fontSize: '11px',
    color: '#666',
    display: 'block',
    marginTop: '2px',
  };

  const contentStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const gooseFeverStyle: CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '64px',
    animation: 'pulse 0.5s infinite',
    zIndex: 100,
    pointerEvents: 'none',
  };

  if (isFinished && result) {
    return (
      <ResultScreen
        result={result}
        onClose={exitMinigame}
        onPlayAgain={() => {
          setCurrentQuestion(1);
          setCorrectAnswers(0);
          setWrongAnswers(0);
          setStreak(0);
          setIsFinished(false);
          setResult(null);
          setAnswerHistory([]);
        }}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleRowStyle}>
          <h1 style={titleStyle}>{title}</h1>
          <Button onClick={exitMinigame} variant="secondary" size="small">
            ✕ Ukončit
          </Button>
        </div>

        <ProgressBar
          current={currentQuestion}
          max={totalQuestions}
          color="#2196f3"
          height={16}
          label={`${currentQuestion}/${totalQuestions}`}
        />

        <div style={statsRowStyle}>
          <div style={{ ...statStyle, color: '#4caf50' }}>✓ {correctAnswers}</div>
          <div style={{ ...statStyle, color: '#f44336' }}>✗ {wrongAnswers}</div>
          <div style={{ ...statStyle, color: '#ff9800' }}>🔥 {streak}</div>
          {isGooseFever && (
            <div style={{ ...statStyle, color: '#9c27b0' }}>
              🪿 HUSÍ HOREČKA!
            </div>
          )}
        </div>
      </div>

      <div style={mainContentStyle}>
        {/* Levý sloupec - správné odpovědi (skrytý na mobilu) */}
        {!isMobile && (
          <div style={sideColumnStyle}>
            <div style={columnHeaderStyle}>✓ Správně</div>
            <div style={historyListStyle}>
              {answerHistory
                .filter((item) => item.isCorrect)
                .slice(-8)
                .map((item, idx) => (
                  <div key={idx} style={historyItemCorrectStyle}>
                    <span style={historyWordStyle}>{item.word.replace('_', item.answer)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Střední část - hra */}
        <div style={contentStyle}>
          {children({
            onCorrect: handleCorrect,
            onWrong: handleWrong,
            streak,
            isGooseFever,
            showHint,
            requestHint,
            correctDelay,
            wrongDelay,
            addToHistory,
          })}
        </div>

        {/* Pravý sloupec - chybné odpovědi (skrytý na mobilu) */}
        {!isMobile && (
          <div style={sideColumnStyle}>
            <div style={columnHeaderStyle}>✗ Chyby</div>
            <div style={historyListStyle}>
              {answerHistory
                .filter((item) => !item.isCorrect)
                .slice(-8)
                .map((item, idx) => (
                  <div key={idx} style={historyItemWrongStyle}>
                    <span style={historyWordStyle}>
                      {item.word.replace('_', item.answer)}
                    </span>
                    <span style={historyUserAnswerStyle}>
                      (tvoje: {item.userAnswer})
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {isGooseFever && <div style={gooseFeverStyle}>🪿</div>}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// Result Screen Component
interface ResultScreenProps {
  result: MinigameResult;
  onClose: () => void;
  onPlayAgain: () => void;
}

function ResultScreen({ result, onClose, onPlayAgain }: ResultScreenProps) {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(180deg, #c8e6c9 0%, #a5d6a7 100%)',
  };

  const cardStyle: CSSProperties = {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '100%',
  };

  const titleStyle: CSSProperties = {
    fontSize: '32px',
    marginBottom: '24px',
  };

  const statsGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  };

  const statBoxStyle: CSSProperties = {
    background: '#f5f5f5',
    borderRadius: '12px',
    padding: '16px',
  };

  const statLabelStyle: CSSProperties = {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
  };

  const statValueStyle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  };

  const rewardsStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginBottom: '24px',
    fontSize: '24px',
  };

  const rewardItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fff8e1',
    padding: '12px 20px',
    borderRadius: '20px',
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const percentage = Math.round(
    (result.correctAnswers / (result.correctAnswers + result.wrongAnswers)) * 100
  );

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>
          {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'} Hotovo!
        </div>

        <div style={statsGridStyle}>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Správně</div>
            <div style={{ ...statValueStyle, color: '#4caf50' }}>
              {result.correctAnswers}
            </div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Špatně</div>
            <div style={{ ...statValueStyle, color: '#f44336' }}>
              {result.wrongAnswers}
            </div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Nejdelší série</div>
            <div style={{ ...statValueStyle, color: '#ff9800' }}>
              🔥 {result.streak}
            </div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Úspěšnost</div>
            <div style={statValueStyle}>{percentage}%</div>
          </div>
        </div>

        {/* Varování při hladových husách */}
        {result.geeseHungry && (
          <div
            style={{
              background: '#fff3e0',
              border: '2px solid #ff9800',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#e65100',
            }}
          >
            ⚠️ Tvoje husy byly hladové! Nakrm je pro plnou odměnu.
          </div>
        )}

        {/* Bonus z hus */}
        {result.gooseMultiplier && result.gooseMultiplier > 1 && (
          <div
            style={{
              background: '#e8f5e9',
              borderRadius: '12px',
              padding: '8px 16px',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#2e7d32',
            }}
          >
            🪿 Bonus z hus: x{result.gooseMultiplier.toFixed(1)}
          </div>
        )}

        <div style={rewardsStyle}>
          <div style={rewardItemStyle}>
            <span>🥚</span>
            <span>+{result.eggsEarned}</span>
          </div>
          {result.feathersEarned > 0 && (
            <div style={rewardItemStyle}>
              <span>🪶</span>
              <span>+{result.feathersEarned}</span>
            </div>
          )}
          <div style={rewardItemStyle}>
            <span>⭐</span>
            <span>+{result.xpEarned} XP</span>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <Button onClick={onPlayAgain} variant="success" size="large">
            🔄 Hrát znovu
          </Button>
          <Button onClick={onClose} variant="secondary">
            ← Zpět
          </Button>
        </div>
      </div>
    </div>
  );
}
