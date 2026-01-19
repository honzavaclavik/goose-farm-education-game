import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameScreen, MinigameType, GameSettings } from '../types/farm';

interface GameState {
  // Navigace
  currentScreen: GameScreen;
  currentMinigame: MinigameType | null;

  // Nastavení
  settings: GameSettings;

  // Actions
  setScreen: (screen: GameScreen) => void;
  startMinigame: (type: MinigameType) => void;
  exitMinigame: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentScreen: 'mainMenu',
      currentMinigame: null,

      settings: {
        soundEnabled: true,
        musicEnabled: true,
        hintsEnabled: true,
      },

      setScreen: (screen) => set({ currentScreen: screen }),

      startMinigame: (type) =>
        set({
          currentScreen: 'minigame',
          currentMinigame: type,
        }),

      exitMinigame: () =>
        set({
          currentScreen: 'farm',
          currentMinigame: null,
        }),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'goose-farm-game',
    }
  )
);
