export interface Position {
  x: number;
  y: number;
}

export interface FallingItem {
  id: string;
  type: 'goose' | 'goose_white' | 'goose_baby' | 'goose_golden' | 'goose_flying' | 'goose_duck';
  position: Position;
  speed: number;
  points: number;
  size: number;
}

export interface GameState {
  score: number;
  lives: number;
  level: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  highScore: number;
}

export interface BasketState {
  x: number;
  width: number;
}
