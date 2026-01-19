import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currencies } from '../types/farm';

interface CurrencyState extends Currencies {
  // Actions
  addEggs: (amount: number) => void;
  addFeathers: (amount: number) => void;
  addGrain: (amount: number) => void;
  spendEggs: (amount: number) => boolean;
  spendFeathers: (amount: number) => boolean;
  spendGrain: (amount: number) => boolean;
  reset: () => void;
}

const initialState: Currencies = {
  eggs: 10, // startovní vejce
  feathers: 0,
  grain: 50, // startovní zrní
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addEggs: (amount) =>
        set((state) => ({ eggs: state.eggs + amount })),

      addFeathers: (amount) =>
        set((state) => ({ feathers: state.feathers + amount })),

      addGrain: (amount) =>
        set((state) => ({ grain: state.grain + amount })),

      spendEggs: (amount) => {
        const { eggs } = get();
        if (eggs >= amount) {
          set({ eggs: eggs - amount });
          return true;
        }
        return false;
      },

      spendFeathers: (amount) => {
        const { feathers } = get();
        if (feathers >= amount) {
          set({ feathers: feathers - amount });
          return true;
        }
        return false;
      },

      spendGrain: (amount) => {
        const { grain } = get();
        if (grain >= amount) {
          set({ grain: grain - amount });
          return true;
        }
        return false;
      },

      reset: () => set(initialState),
    }),
    {
      name: 'goose-farm-currencies',
    }
  )
);
