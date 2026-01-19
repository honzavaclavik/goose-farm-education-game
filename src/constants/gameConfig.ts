export const GAME_CONFIG = {
  // Canvas/Game area
  GAME_WIDTH: 400,
  GAME_HEIGHT: 600,

  // Basket (hnizdo)
  BASKET_WIDTH: 90,
  BASKET_HEIGHT: 60,
  BASKET_Y_OFFSET: 50,

  // Falling objects (husy!)
  ITEM_SIZE: 55,
  INITIAL_FALL_SPEED: 3,
  SPEED_INCREMENT_PER_LEVEL: 0.5,
  SPAWN_INTERVAL_MS: 900,
  SPAWN_INTERVAL_DECREASE_PER_LEVEL: 70,
  MIN_SPAWN_INTERVAL: 300,

  // Scoring - vice hus = vice bodu!
  POINTS: {
    goose: 10,
    goose_white: 15,
    goose_baby: 20,
    goose_golden: 50,
    goose_flying: 25,
    goose_duck: 5,
  } as const,

  // Lives & Levels
  INITIAL_LIVES: 3,
  POINTS_PER_LEVEL: 100,
  MAX_LEVEL: 10,
};

// Spousta hus!
export const ITEM_EMOJIS: Record<string, string> = {
  goose: '🪿',
  goose_white: '🦢',
  goose_baby: '🐣',
  goose_golden: '🥚',
  goose_flying: '🦆',
  goose_duck: '🐤',
};
