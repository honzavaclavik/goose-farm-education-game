interface ScoreBoardProps {
  score: number;
  lives: number;
  level: number;
  onPause: () => void;
  isPaused: boolean;
}

export default function ScoreBoard({
  score,
  lives,
  level,
  onPause,
  isPaused,
}: ScoreBoardProps) {
  return (
    <div className="scoreboard">
      <div className="score">🪿 {score}</div>
      <div className="level">Lv {level}</div>
      <div className="lives">
        {Array.from({ length: lives }).map((_, i) => (
          <span key={i}>🥚</span>
        ))}
      </div>
      <button className="pause-btn" onClick={onPause}>
        {isPaused ? '▶️' : '⏸️'}
      </button>
    </div>
  );
}
