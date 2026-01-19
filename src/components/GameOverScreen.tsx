interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export default function GameOverScreen({
  score,
  highScore,
  onRestart,
}: GameOverScreenProps) {
  const isNewRecord = score >= highScore && score > 0;

  return (
    <div className="game-over-screen">
      <h1>🪿 Konec! 🪿</h1>
      <div className="sad-geese">🦢😢🪿</div>
      {isNewRecord && <p className="new-record">🏆 Novy rekord! 🏆</p>}
      <p className="final-score">Chyceno hus: {score}</p>
      <p className="high-score">Rekord: {highScore}</p>
      <button className="restart-button" onClick={onRestart}>
        🪿 Hrat znovu 🪿
      </button>
    </div>
  );
}
