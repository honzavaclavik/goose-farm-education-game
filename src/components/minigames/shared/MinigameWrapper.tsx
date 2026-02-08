import { CSSProperties, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../common/Button';
import { ProgressBar } from '../../common/ProgressBar';
import { useGameStore } from '../../../store/gameStore';
import { useCurrencyStore } from '../../../store/currencyStore';
import { useProgressStore } from '../../../store/progressStore';
import { useSound } from '../../../hooks/useSound';
import { useGooseBonus } from '../../../hooks/useGooseBonus';
import { GiphyGif } from '../../common/GiphyGif';
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

const EggRewardSVG = () => (
  <svg viewBox="0 0 28 28" width="28" height="28">
    <ellipse cx="14" cy="15" rx="9" ry="11" fill="#fef3e0" stroke="#d4a463" strokeWidth="1.5" />
    <ellipse cx="11" cy="11" rx="3.5" ry="5" fill="rgba(255,255,255,0.5)" />
  </svg>
);

const FeatherRewardSVG = () => (
  <svg viewBox="0 0 28 28" width="28" height="28">
    <path d="M14 2 C10 6, 8 10, 10 18 C12 16, 14 12, 14 2Z" fill="#b39ddb" stroke="#7e57c2" strokeWidth="0.5" />
    <path d="M14 2 C18 6, 20 10, 18 18 C16 16, 14 12, 14 2Z" fill="#ce93d8" stroke="#7e57c2" strokeWidth="0.5" />
    <line x1="14" y1="2" x2="14" y2="26" stroke="#7e57c2" strokeWidth="1.5" />
  </svg>
);

const XpStarSVG = () => (
  <svg viewBox="0 0 28 28" width="28" height="28">
    <polygon
      points="14,2 17.5,10 26,10.5 19.5,16 21.5,25 14,20 6.5,25 8.5,16 2,10.5 10.5,10"
      fill="#FFD700" stroke="#FFA000" strokeWidth="1"
    />
    <polygon
      points="14,6 16,11 21,11.3 17,15 18.5,21 14,18 9.5,21 11,15 7,11.3 12,11"
      fill="#FFEE58" opacity="0.6"
    />
  </svg>
);

const StreakFireSVG = () => (
  <svg viewBox="0 0 20 24" width="18" height="22">
    <defs>
      <linearGradient id="mgFireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FF6F00" />
        <stop offset="50%" stopColor="#FF9800" />
        <stop offset="100%" stopColor="#FDD835" />
      </linearGradient>
    </defs>
    <path d="M10 1 C7 5, 3 10, 5 17 C6 20, 8 22, 10 22 C12 22, 14 20, 15 17 C17 10, 13 5, 10 1Z" fill="url(#mgFireGrad)" />
    <path d="M10 7 C8.5 10, 7 14, 7.5 18 C8 20, 9 21, 10 21 C11 21, 12 20, 12.5 18 C13 14, 11.5 10, 10 7Z" fill="#FFEE58" />
  </svg>
);

const GooseFeverSVG = () => (
  <svg viewBox="0 0 80 65" width="80" height="65" style={{ opacity: 0.4 }}>
    <ellipse cx="40" cy="40" rx="20" ry="14" fill="#F5F5F5" />
    <path d="M24 36 Q18 28 20 18 Q22 12 25 18 Q28 26 26 36" fill="#F5F5F5" />
    <circle cx="22" cy="14" r="8" fill="#F5F5F5" />
    <path d="M14 14 L7 16.5 L14 17.5" fill="#FFD700" />
    <circle cx="19" cy="12" r="2.5" fill="#333" />
    <circle cx="18.5" cy="11.5" r="1" fill="white" />
  </svg>
);

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
  const [wrongGifTag, setWrongGifTag] = useState<string | null>(null);

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

  const laughingAnimals = [
    'dog laughing', 'cat laughing', 'horse laughing',
    'monkey laughing', 'parrot laughing', 'goat laughing',
  ];

  const handleWrong = () => {
    setStreak(0);
    setWrongAnswers((w) => w + 1);
    setConsecutiveWrong((c) => c + 1);
    updateStreak(false);
    play('wrong');

    // Zobrazit smějící se zvíře
    const tag = laughingAnimals[Math.floor(Math.random() * laughingAnimals.length)];
    setWrongGifTag(tag);
    setTimeout(() => setWrongGifTag(null), wrongDelay);

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
      ? 'linear-gradient(180deg, #FFF8E1 0%, #FFE082 100%)'
      : 'linear-gradient(180deg, var(--color-sky-start) 0%, var(--color-sky-end) 40%, var(--color-parchment) 100%)',
    transition: 'background 0.5s ease',
  };

  const headerStyle: CSSProperties = {
    background: 'var(--texture-wood)',
    padding: 'var(--space-3) var(--space-4)',
    borderBottom: '3px solid var(--color-wood-border)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(90, 62, 34, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
  };

  const titleRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-2)',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'var(--text-xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'white',
    textShadow: 'var(--text-outline-dark)',
    margin: 0,
  };

  const statsRowStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 'var(--space-2)',
  };

  const statBadgeStyle = (color: string): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'white',
    textShadow: 'var(--text-outline-dark)',
    background: color,
    padding: '3px 10px',
    borderRadius: 'var(--radius-sm)',
    borderBottom: `2px solid rgba(0,0,0,0.2)`,
  });

  const mainContentStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    padding: '16px',
    overflow: 'hidden',
  };

  const sideColumnStyle: CSSProperties = {
    width: '180px',
    minWidth: '140px',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--texture-parchment)',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    maxHeight: 'calc(100vh - 200px)',
    overflow: 'hidden',
    border: '2px solid var(--color-parchment-dark)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  // Detekce mobilního zařízení (šířka < 768px)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const columnHeaderStyle: CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    textAlign: 'center',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '2px solid var(--color-parchment-dark)',
    color: 'var(--color-wood-dark)',
  };

  const historyListStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    overflowY: 'auto',
    flex: 1,
  };

  const historyItemCorrectStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    border: '1px solid #81C784',
  };

  const historyItemWrongStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)',
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    border: '1px solid #E57373',
  };

  const historyWordStyle: CSSProperties = {
    fontWeight: 'bold',
    display: 'block',
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-wood-dark)',
  };

  const historyUserAnswerStyle: CSSProperties = {
    fontSize: '11px',
    color: '#8D6E63',
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

  const gooseFeverOverlayStyle: CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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
          color="#FFD700"
          height={16}
          label={`${currentQuestion}/${totalQuestions}`}
        />

        <div style={statsRowStyle}>
          <div style={statBadgeStyle('#4caf50')}>
            <svg viewBox="0 0 14 14" width="14" height="14">
              <circle cx="7" cy="7" r="6" fill="none" stroke="white" strokeWidth="2" />
              <path d="M4 7 L6 9 L10 5" stroke="white" strokeWidth="2" fill="none" />
            </svg>
            {correctAnswers}
          </div>
          <div style={statBadgeStyle('#f44336')}>
            <svg viewBox="0 0 14 14" width="14" height="14">
              <circle cx="7" cy="7" r="6" fill="none" stroke="white" strokeWidth="2" />
              <line x1="4.5" y1="4.5" x2="9.5" y2="9.5" stroke="white" strokeWidth="2" />
              <line x1="9.5" y1="4.5" x2="4.5" y2="9.5" stroke="white" strokeWidth="2" />
            </svg>
            {wrongAnswers}
          </div>
          <div style={statBadgeStyle('#ff9800')}>
            <StreakFireSVG />
            {streak}
          </div>
          {isGooseFever && (
            <motion.div
              style={statBadgeStyle('#9c27b0')}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              HUSÍ HOREČKA!
            </motion.div>
          )}
        </div>
      </div>

      <div style={mainContentStyle}>
        {/* Levý sloupec - správné odpovědi (skrytý na mobilu) */}
        {!isMobile && (
          <div style={sideColumnStyle}>
            <div style={columnHeaderStyle}>
              <svg viewBox="0 0 14 14" width="14" height="14" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
                <circle cx="7" cy="7" r="6" fill="#4caf50" />
                <path d="M4 7 L6 9 L10 5" stroke="white" strokeWidth="2" fill="none" />
              </svg>
              Správně
            </div>
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

          <AnimatePresence>
            {wrongGifTag && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}
              >
                <GiphyGif tag={wrongGifTag} fallbackEmoji="😂" size="large" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pravý sloupec - chybné odpovědi (skrytý na mobilu) */}
        {!isMobile && (
          <div style={sideColumnStyle}>
            <div style={columnHeaderStyle}>
              <svg viewBox="0 0 14 14" width="14" height="14" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
                <circle cx="7" cy="7" r="6" fill="#f44336" />
                <line x1="4.5" y1="4.5" x2="9.5" y2="9.5" stroke="white" strokeWidth="2" />
                <line x1="9.5" y1="4.5" x2="4.5" y2="9.5" stroke="white" strokeWidth="2" />
              </svg>
              Chyby
            </div>
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

      {isGooseFever && (
        <motion.div
          style={gooseFeverOverlayStyle}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <GooseFeverSVG />
        </motion.div>
      )}

    </div>
  );
}

// Result Screen Component
interface ResultScreenProps {
  result: MinigameResult;
  onClose: () => void;
  onPlayAgain: () => void;
}

const TrophySVG = ({ percentage }: { percentage: number }) => {
  const color = percentage >= 80 ? '#FFD700' : percentage >= 50 ? '#C0C0C0' : '#CD7F32';
  const colorDark = percentage >= 80 ? '#FFA000' : percentage >= 50 ? '#9E9E9E' : '#A0522D';
  return (
    <svg viewBox="0 0 60 60" width="64" height="64">
      {/* Trophy cup */}
      <path d="M15 8 L15 28 C15 38 23 44 30 44 C37 44 45 38 45 28 L45 8 Z"
        fill={color} stroke={colorDark} strokeWidth="1.5" />
      {/* Handles */}
      <path d="M15 14 C8 14, 5 20, 8 26 C10 30, 15 28, 15 24" fill="none" stroke={colorDark} strokeWidth="2.5" />
      <path d="M45 14 C52 14, 55 20, 52 26 C50 30, 45 28, 45 24" fill="none" stroke={colorDark} strokeWidth="2.5" />
      {/* Shine */}
      <path d="M20 12 L20 24 C20 32 25 36 28 36" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      {/* Base */}
      <rect x="22" y="44" width="16" height="4" fill={colorDark} rx="1" />
      <rect x="18" y="48" width="24" height="5" fill={color} stroke={colorDark} strokeWidth="1" rx="2" />
      {/* Star */}
      {percentage >= 80 && (
        <polygon points="30,16 33,23 40,23 34.5,27.5 36.5,34.5 30,30 23.5,34.5 25.5,27.5 20,23 27,23"
          fill="#FFEE58" stroke="#FFA000" strokeWidth="0.5" />
      )}
    </svg>
  );
};

function ResultScreen({ result, onClose, onPlayAgain }: ResultScreenProps) {
  const percentage = Math.round(
    (result.correctAnswers / (result.correctAnswers + result.wrongAnswers)) * 100
  );

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: `
      radial-gradient(circle at 50% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 60%),
      linear-gradient(180deg, var(--color-sky-start) 0%, var(--color-grass-start) 100%)
    `,
  };

  const cardStyle: CSSProperties = {
    background: 'var(--texture-parchment)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25)',
    maxWidth: '420px',
    width: '100%',
    border: 'var(--border-gold-frame)',
    position: 'relative',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'var(--text-3xl)',
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-wood-dark)',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '8px',
  };

  const statsGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  };

  const statBoxStyle: CSSProperties = {
    background: 'var(--texture-wood)',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    border: '2px solid var(--color-wood-border)',
    boxShadow: 'var(--shadow-wood-panel)',
  };

  const statLabelStyle: CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-parchment)',
    textShadow: 'var(--text-outline-brown)',
    marginBottom: '2px',
  };

  const statValueStyle: CSSProperties = {
    fontSize: 'var(--text-2xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-extrabold)',
    color: 'white',
    textShadow: 'var(--text-outline-dark)',
  };

  const rewardsStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const rewardItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #FFF8E1 0%, #FFE082 100%)',
    padding: '10px 16px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--color-gold-dark)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    fontSize: 'var(--text-lg)',
    color: 'var(--color-wood-dark)',
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  return (
    <div style={containerStyle}>
      <motion.div
        style={cardStyle}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <TrophySVG percentage={percentage} />
        {percentage >= 80 ? (
          <GiphyGif tag="celebration dance" fallbackEmoji="🎉" size="large" />
        ) : percentage >= 50 ? (
          <GiphyGif tag="good job thumbs up" fallbackEmoji="👍" size="large" />
        ) : (
          <GiphyGif tag="try again funny" fallbackEmoji="💪" size="large" />
        )}
        <div style={titleStyle}>Hotovo!</div>

        <div style={statsGridStyle}>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Správně</div>
            <div style={statValueStyle}>{result.correctAnswers}</div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Špatně</div>
            <div style={statValueStyle}>{result.wrongAnswers}</div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Nejdelší série</div>
            <div style={{ ...statValueStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <StreakFireSVG /> {result.streak}
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
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
              border: '2px solid #FF9800',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              marginBottom: '14px',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)',
              color: '#E65100',
            }}
          >
            Tvoje husy byly hladové! Nakrm je pro plnou odměnu.
          </div>
        )}

        {/* Bonus z hus */}
        {result.gooseMultiplier && result.gooseMultiplier > 1 && (
          <div
            style={{
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              marginBottom: '14px',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)',
              color: '#2E7D32',
              border: '1px solid #81C784',
            }}
          >
            Bonus z hus: x{result.gooseMultiplier.toFixed(1)}
          </div>
        )}

        <div style={rewardsStyle}>
          <AnimatePresence>
            <motion.div
              style={rewardItemStyle}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 12 }}
            >
              <EggRewardSVG />
              <span>+{result.eggsEarned}</span>
            </motion.div>
            {result.feathersEarned > 0 && (
              <motion.div
                style={rewardItemStyle}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.45, type: 'spring', stiffness: 300, damping: 12 }}
              >
                <FeatherRewardSVG />
                <span>+{result.feathersEarned}</span>
              </motion.div>
            )}
            <motion.div
              style={rewardItemStyle}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 12 }}
            >
              <XpStarSVG />
              <span>+{result.xpEarned} XP</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={buttonContainerStyle}>
          <Button onClick={onPlayAgain} variant="success" size="large">
            Hrát znovu
          </Button>
          <Button onClick={onClose} variant="secondary">
            Zpět
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
