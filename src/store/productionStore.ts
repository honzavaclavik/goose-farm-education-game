import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const FEEDING_INTERVAL_MS = 300000; // 5 minut

interface ProductionState {
  lastGrainProduction: number;
  lastFeeding: number;

  // Actions
  setLastFeeding: (time: number) => void;
  setLastGrainProduction: (time: number) => void;
  isHungry: () => boolean;
  reset: () => void;
}

export const useProductionStore = create<ProductionState>()(
  persist(
    (set, get) => ({
      lastGrainProduction: Date.now(),
      lastFeeding: Date.now(),

      setLastFeeding: (time) => set({ lastFeeding: time }),

      setLastGrainProduction: (time) => set({ lastGrainProduction: time }),

      isHungry: () => {
        const { lastFeeding } = get();
        return Date.now() - lastFeeding >= FEEDING_INTERVAL_MS;
      },

      reset: () => set({
        lastGrainProduction: Date.now(),
        lastFeeding: Date.now(),
      }),
    }),
    {
      name: 'goose-farm-production',
    }
  )
);
