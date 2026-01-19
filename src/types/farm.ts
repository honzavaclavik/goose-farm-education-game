// Typy hus
export type GooseRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Goose {
  id: string;
  name: string;
  rarity: GooseRarity;
  eggProduction: number; // vejce za hru
  featherBonus: number; // bonus peří
  purchasePrice: number; // cena v vejcích
  unlocked: boolean;
}

// Typy budov
export type BuildingType = 'coop' | 'field' | 'mill' | 'market';

export interface Building {
  id: string;
  type: BuildingType;
  name: string;
  level: number;
  maxLevel: number;
  effect: number; // efekt dle typu
  upgradeCost: number;
  purchasePrice: number;
}

// Měny
export interface Currencies {
  eggs: number; // vejce
  feathers: number; // peří
  grain: number; // zrní
}

// Progress hráče
export interface PlayerProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalGamesPlayed: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  currentStreak: number;
  bestStreak: number;
  dailyStreak: number;
  lastPlayDate: string | null;
  achievements: string[];
  categoryStats: Record<ExerciseCategory, CategoryStats>;
}

export interface CategoryStats {
  totalAttempts: number;
  correctAnswers: number;
  currentDifficulty: number; // 1-5, adaptivní
}

// Cvičení
export type ExerciseCategory =
  | 'prefixes'      // předpony vz/z/s
  | 'softHardIY'    // i/y po měkkých/tvrdých
  | 'declaredWords' // vyjmenovaná slova
  | 'vowelLength'   // délka samohlásek
  | 'sentences'     // najdi chybu ve větě
  | 'fractions';    // zlomky (5. třída)

export interface Exercise {
  id: string;
  word: string;
  answer: string;
  options?: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  hint: string;
  rule: string;
}

export interface ExerciseFile {
  category: ExerciseCategory;
  exercises: Exercise[];
}

// Herní stav
export type GameScreen =
  | 'mainMenu'
  | 'farm'
  | 'minigameSelector'
  | 'minigame'
  | 'shop'
  | 'achievements'
  | 'dailyChallenges';

export type MinigameType =
  | 'eggNest'       // Vejce v hnízdě
  | 'gooseMarch'    // Husí pochod
  | 'flockFlight'   // Přelet hejna
  | 'fenceBuilder'  // Stavba plotu
  | 'gooseDetective' // Husí detektiv
  | 'fractionFarm';  // Zlomková farma

// Výsledek mini-hry
export interface MinigameResult {
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  eggsEarned: number;
  feathersEarned: number;
  xpEarned: number;
  gooseFeverActivated: boolean;
  gooseMultiplier?: number; // multiplikátor z hus (např. 1.3 = +30%)
  geeseHungry?: boolean; // byly husy hladové?
}

// Nastavení
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hintsEnabled: boolean;
}
