interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export default function StartScreen({ onStart, highScore }: StartScreenProps) {
  return (
    <div className="start-screen">
      <h1>🪿 Chytej Husy! 🦢</h1>
      <div className="goose-parade">🪿🦆🐣🦢🐤🪿</div>
      <p className="instructions">
        Chytej padajici husy do hnizda!
        <br />
        Tahni hnizdo doleva a doprava.
      </p>
      <div className="goose-info">
        <span>🪿 10</span>
        <span>🦢 15</span>
        <span>🐣 20</span>
        <span>🥚 50</span>
      </div>
      {highScore > 0 && <p className="high-score">Rekord: {highScore} 🏆</p>}
      <button className="start-button" onClick={onStart}>
        🪿 Hrat! 🪿
      </button>
    </div>
  );
}
