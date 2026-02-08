import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goose, Building, BuildingType } from '../types/farm';

interface FarmState {
  geese: Goose[];
  buildings: Building[];
  maxGooseCapacity: number;
  positions: Record<string, { x: number; y: number }>;

  // Actions
  addGoose: (goose: Goose) => void;
  removeGoose: (id: string) => void;
  addBuilding: (building: Building) => void;
  upgradeBuilding: (id: string) => boolean;
  getGooseCapacity: () => number;
  updatePosition: (id: string, x: number, y: number) => void;
  reset: () => void;
}

// Startovní husa
const starterGoose: Goose = {
  id: 'starter-goose',
  name: 'Bělka',
  rarity: 'common',
  eggProduction: 1,
  featherBonus: 0,
  purchasePrice: 0,
  unlocked: true,
};

// Výchozí kurník
const starterCoop: Building = {
  id: 'starter-coop',
  type: 'coop',
  name: 'Kurník',
  level: 1,
  maxLevel: 5,
  effect: 3, // kapacita hus
  upgradeCost: 50,
  purchasePrice: 0,
};

export const useFarmStore = create<FarmState>()(
  persist(
    (set, get) => ({
      geese: [starterGoose],
      buildings: [starterCoop],
      maxGooseCapacity: 3,
      positions: {},

      addGoose: (goose) =>
        set((state) => {
          const capacity = get().getGooseCapacity();
          if (state.geese.length >= capacity) {
            console.log('Kapacita kurníku je plná!');
            return state;
          }
          return { geese: [...state.geese, goose] };
        }),

      removeGoose: (id) =>
        set((state) => ({
          geese: state.geese.filter((g) => g.id !== id),
        })),

      addBuilding: (building) =>
        set((state) => ({
          buildings: [...state.buildings, building],
        })),

      upgradeBuilding: (id) => {
        const state = get();
        const building = state.buildings.find((b) => b.id === id);
        if (!building || building.level >= building.maxLevel) {
          return false;
        }

        set({
          buildings: state.buildings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  level: b.level + 1,
                  effect: b.effect + getUpgradeEffect(b.type),
                  upgradeCost: Math.floor(b.upgradeCost * 1.5),
                }
              : b
          ),
        });

        // Přepočítat kapacitu po upgrade kurníku
        if (building.type === 'coop') {
          const newCapacity = get().getGooseCapacity();
          set({ maxGooseCapacity: newCapacity });
        }

        return true;
      },

      updatePosition: (id, x, y) =>
        set((state) => ({
          positions: { ...state.positions, [id]: { x, y } },
        })),

      getGooseCapacity: () => {
        const state = get();
        return state.buildings
          .filter((b) => b.type === 'coop')
          .reduce((sum, b) => sum + b.effect, 0);
      },

      reset: () =>
        set({
          geese: [starterGoose],
          buildings: [starterCoop],
          maxGooseCapacity: 3,
          positions: {},
        }),
    }),
    {
      name: 'goose-farm-state',
    }
  )
);

// Pomocná funkce pro efekt upgradu
function getUpgradeEffect(type: BuildingType): number {
  switch (type) {
    case 'coop':
      return 2; // +2 kapacita
    case 'field':
      return 5; // +5 zrní/min
    case 'mill':
      return 10; // +10% efektivita
    case 'market':
      return 5; // +5% cena prodeje
    default:
      return 1;
  }
}
