import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useTouchControls } from '../hooks/useTouchControls';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GAME_CONFIG, ITEM_EMOJIS } from '../constants/gameConfig';
import { FallingItem, GameState, BasketState } from '../types/game';
import Basket from './Basket';
import FallingObject from './FallingObject';
import ScoreBoard from './ScoreBoard';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createFallingItem = (level: number): FallingItem => {
  const types = ['goose', 'goose_white', 'goose_baby', 'goose_golden', 'goose_flying', 'goose_duck'] as const;
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    id: generateId(),
    type,
    position: {
      x: Math.random() * (GAME_CONFIG.GAME_WIDTH - GAME_CONFIG.ITEM_SIZE),
      y: -GAME_CONFIG.ITEM_SIZE,
    },
    speed:
      GAME_CONFIG.INITIAL_FALL_SPEED +
      (level - 1) * GAME_CONFIG.SPEED_INCREMENT_PER_LEVEL,
    points: GAME_CONFIG.POINTS[type],
    size: GAME_CONFIG.ITEM_SIZE,
  };
};

export default function Game() {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [highScore, setHighScore] = useLocalStorage('gooseCatcher_highScore', 0);

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: GAME_CONFIG.INITIAL_LIVES,
    level: 1,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    highScore,
  });

  const [basket, setBasket] = useState<BasketState>({
    x: (GAME_CONFIG.GAME_WIDTH - GAME_CONFIG.BASKET_WIDTH) / 2,
    width: GAME_CONFIG.BASKET_WIDTH,
  });

  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchControls(
    gameAreaRef,
    (newX) => {
      setBasket((prev) => ({
        ...prev,
        x: Math.max(
          0,
          Math.min(newX - prev.width / 2, GAME_CONFIG.GAME_WIDTH - prev.width)
        ),
      }));
    }
  );

  // Spawn new items
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const spawnInterval = Math.max(
      GAME_CONFIG.MIN_SPAWN_INTERVAL,
      GAME_CONFIG.SPAWN_INTERVAL_MS -
        (gameState.level - 1) * GAME_CONFIG.SPAWN_INTERVAL_DECREASE_PER_LEVEL
    );

    const interval = setInterval(() => {
      setFallingItems((prev) => [...prev, createFallingItem(gameState.level)]);
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.isPaused, gameState.level]);

  // Game loop
  const updateGame = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    setFallingItems((prevItems) => {
      const newItems: FallingItem[] = [];
      let scoreIncrease = 0;
      let livesLost = 0;

      for (const item of prevItems) {
        const newY = item.position.y + item.speed;

        // Check if caught by basket
        const basketTop =
          GAME_CONFIG.GAME_HEIGHT -
          GAME_CONFIG.BASKET_Y_OFFSET -
          GAME_CONFIG.BASKET_HEIGHT;
        const basketLeft = basket.x;
        const basketRight = basket.x + basket.width;
        const itemCenterX = item.position.x + item.size / 2;

        if (
          newY + item.size >= basketTop &&
          newY <= basketTop + GAME_CONFIG.BASKET_HEIGHT &&
          itemCenterX >= basketLeft &&
          itemCenterX <= basketRight
        ) {
          scoreIncrease += item.points;
          continue;
        }

        // Check if missed
        if (newY > GAME_CONFIG.GAME_HEIGHT) {
          livesLost++;
          continue;
        }

        newItems.push({
          ...item,
          position: { ...item.position, y: newY },
        });
      }

      if (scoreIncrease > 0 || livesLost > 0) {
        setGameState((prev) => {
          const newScore = prev.score + scoreIncrease;
          const newLives = prev.lives - livesLost;
          const newLevel = Math.min(
            Math.floor(newScore / GAME_CONFIG.POINTS_PER_LEVEL) + 1,
            GAME_CONFIG.MAX_LEVEL
          );

          if (newLives <= 0) {
            const finalHighScore = Math.max(newScore, prev.highScore);
            setHighScore(finalHighScore);
            return {
              ...prev,
              score: newScore,
              lives: 0,
              isPlaying: false,
              isGameOver: true,
              highScore: finalHighScore,
            };
          }

          return {
            ...prev,
            score: newScore,
            lives: newLives,
            level: newLevel,
          };
        });
      }

      return newItems;
    });
  }, [gameState.isPlaying, gameState.isPaused, basket.x, basket.width, setHighScore]);

  useGameLoop(updateGame, gameState.isPlaying && !gameState.isPaused);

  const startGame = () => {
    setFallingItems([]);
    setBasket({
      x: (GAME_CONFIG.GAME_WIDTH - GAME_CONFIG.BASKET_WIDTH) / 2,
      width: GAME_CONFIG.BASKET_WIDTH,
    });
    setGameState({
      score: 0,
      lives: GAME_CONFIG.INITIAL_LIVES,
      level: 1,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      highScore,
    });
  };

  const togglePause = () => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  return (
    <div className="game-container">
      {!gameState.isPlaying && !gameState.isGameOver && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}

      {gameState.isGameOver && (
        <GameOverScreen
          score={gameState.score}
          highScore={gameState.highScore}
          onRestart={startGame}
        />
      )}

      {gameState.isPlaying && (
        <>
          <ScoreBoard
            score={gameState.score}
            lives={gameState.lives}
            level={gameState.level}
            onPause={togglePause}
            isPaused={gameState.isPaused}
          />

          <div
            ref={gameAreaRef}
            className="game-area"
            style={{
              width: GAME_CONFIG.GAME_WIDTH,
              height: GAME_CONFIG.GAME_HEIGHT,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
          >
            {gameState.isPaused && (
              <div className="pause-overlay">
                <span>PAUSA</span>
                <button onClick={togglePause}>Pokracovat</button>
              </div>
            )}

            {fallingItems.map((item) => (
              <FallingObject
                key={item.id}
                emoji={ITEM_EMOJIS[item.type]}
                x={item.position.x}
                y={item.position.y}
                size={item.size}
              />
            ))}

            <Basket
              x={basket.x}
              y={
                GAME_CONFIG.GAME_HEIGHT -
                GAME_CONFIG.BASKET_Y_OFFSET -
                GAME_CONFIG.BASKET_HEIGHT
              }
              width={basket.width}
              height={GAME_CONFIG.BASKET_HEIGHT}
            />
          </div>
        </>
      )}
    </div>
  );
}
