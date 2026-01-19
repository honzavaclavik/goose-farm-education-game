import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PlayerProgress,
  ExerciseCategory,
  CategoryStats,
  MinigameResult,
} from '../types/farm';

interface ProgressState extends PlayerProgress {
  // Actions
  addXp: (amount: number) => void;
  recordGameResult: (result: MinigameResult, category: ExerciseCategory) => void;
  updateStreak: (correct: boolean) => void;
  checkDailyLogin: () => boolean;
  unlockAchievement: (achievementId: string) => void;
  getCategoryDifficulty: (category: ExerciseCategory) => number;
  reset: () => void;
}

const defaultCategoryStats: CategoryStats = {
  totalAttempts: 0,
  correctAnswers: 0,
  currentDifficulty: 1,
};

const initialProgress: PlayerProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  totalGamesPlayed: 0,
  totalCorrectAnswers: 0,
  totalWrongAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  dailyStreak: 0,
  lastPlayDate: null,
  achievements: [],
  categoryStats: {
    prefixes: { ...defaultCategoryStats },
    softHardIY: { ...defaultCategoryStats },
    declaredWords: { ...defaultCategoryStats },
    vowelLength: { ...defaultCategoryStats },
    sentences: { ...defaultCategoryStats },
    fractions: { ...defaultCategoryStats },
  },
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialProgress,

      addXp: (amount) =>
        set((state) => {
          let newXp = state.xp + amount;
          let newLevel = state.level;
          let newXpToNext = state.xpToNextLevel;

          // Level up kontrola
          while (newXp >= newXpToNext) {
            newXp -= newXpToNext;
            newLevel++;
            newXpToNext = Math.floor(newXpToNext * 1.2); // 20% více XP pro další level
          }

          return {
            xp: newXp,
            level: newLevel,
            xpToNextLevel: newXpToNext,
          };
        }),

      recordGameResult: (result, category) =>
        set((state) => {
          const catStats = state.categoryStats[category];
          const newCorrect = catStats.correctAnswers + result.correctAnswers;
          const newTotal = catStats.totalAttempts + result.correctAnswers + result.wrongAnswers;

          // Adaptivní obtížnost
          const successRate = newTotal > 0 ? newCorrect / newTotal : 0;
          let newDifficulty = catStats.currentDifficulty;

          if (successRate > 0.8 && newTotal >= 10) {
            newDifficulty = Math.min(5, newDifficulty + 1);
          } else if (successRate < 0.5 && newTotal >= 5) {
            newDifficulty = Math.max(1, newDifficulty - 1);
          }

          return {
            totalGamesPlayed: state.totalGamesPlayed + 1,
            totalCorrectAnswers: state.totalCorrectAnswers + result.correctAnswers,
            totalWrongAnswers: state.totalWrongAnswers + result.wrongAnswers,
            bestStreak: Math.max(state.bestStreak, result.streak),
            categoryStats: {
              ...state.categoryStats,
              [category]: {
                totalAttempts: newTotal,
                correctAnswers: newCorrect,
                currentDifficulty: newDifficulty,
              },
            },
          };
        }),

      updateStreak: (correct) =>
        set((state) => {
          if (correct) {
            const newStreak = state.currentStreak + 1;
            return {
              currentStreak: newStreak,
              bestStreak: Math.max(state.bestStreak, newStreak),
            };
          }
          return { currentStreak: 0 };
        }),

      checkDailyLogin: () => {
        const state = get();
        const today = new Date().toDateString();

        if (state.lastPlayDate === today) {
          return false; // Už dnes hrál
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let newDailyStreak = 1;
        if (state.lastPlayDate === yesterday.toDateString()) {
          newDailyStreak = state.dailyStreak + 1;
        }

        set({
          lastPlayDate: today,
          dailyStreak: newDailyStreak,
        });

        return true; // První hra dne
      },

      unlockAchievement: (achievementId) =>
        set((state) => {
          if (state.achievements.includes(achievementId)) {
            return state;
          }
          return {
            achievements: [...state.achievements, achievementId],
          };
        }),

      getCategoryDifficulty: (category) => {
        return get().categoryStats[category].currentDifficulty;
      },

      reset: () => set(initialProgress),
    }),
    {
      name: 'goose-farm-progress',
    }
  )
);
