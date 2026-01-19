import { useState, useCallback, useEffect } from 'react';
import { useFarmStore } from '../store/farmStore';
import { useFarmProduction } from './useFarmProduction';

// Každá husa snese vejce každé 2 minuty
const EGG_PRODUCTION_INTERVAL_MS = 120000; // 2 minuty

const STORAGE_KEY = 'goose-farm-egg-production';

interface EggProductionState {
  // gooseId -> timestamp kdy naposledy snesla vejce
  lastEggTime: Record<string, number>;
}

function getStoredState(): EggProductionState {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return { lastEggTime: {} };
}

function saveState(state: EggProductionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useEggProduction() {
  const { geese } = useFarmStore();
  const { areGeeseHungry } = useFarmProduction();

  const [eggState, setEggState] = useState<EggProductionState>(getStoredState);
  const [, setTick] = useState(0); // force re-render

  // Periodicky aktualizovat stav (každých 10 sekund)
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Zjistit které husy mají vejce k sebrání
  const getGeseWithEggs = useCallback((): string[] => {
    const now = Date.now();
    const isHungry = areGeeseHungry();

    return geese
      .filter((goose) => {
        const lastTime = eggState.lastEggTime[goose.id] || 0;
        const timeSinceLastEgg = now - lastTime;

        // Hladové husy produkují pomaleji (2x déle)
        const interval = isHungry
          ? EGG_PRODUCTION_INTERVAL_MS * 2
          : EGG_PRODUCTION_INTERVAL_MS;

        return timeSinceLastEgg >= interval;
      })
      .map((g) => g.id);
  }, [geese, eggState, areGeeseHungry]);

  // Sebrat vejce od konkrétní husy
  const collectEgg = useCallback(
    (gooseId: string): number => {
      const goose = geese.find((g) => g.id === gooseId);
      if (!goose) return 0;

      const geeseWithEggs = getGeseWithEggs();
      if (!geeseWithEggs.includes(gooseId)) return 0;

      // Aktualizovat čas snesení
      const newState = {
        ...eggState,
        lastEggTime: {
          ...eggState.lastEggTime,
          [gooseId]: Date.now(),
        },
      };
      setEggState(newState);
      saveState(newState);

      // Vrátit počet vajec podle eggProduction husy
      return goose.eggProduction;
    },
    [geese, eggState, getGeseWithEggs]
  );

  // Kontrola zda má konkrétní husa vejce
  const hasEgg = useCallback(
    (gooseId: string): boolean => {
      return getGeseWithEggs().includes(gooseId);
    },
    [getGeseWithEggs]
  );

  // Čas do dalšího vejce pro konkrétní husu
  const getTimeUntilNextEgg = useCallback(
    (gooseId: string): number => {
      const lastTime = eggState.lastEggTime[gooseId] || 0;
      const elapsed = Date.now() - lastTime;
      const isHungry = areGeeseHungry();
      const interval = isHungry
        ? EGG_PRODUCTION_INTERVAL_MS * 2
        : EGG_PRODUCTION_INTERVAL_MS;
      return Math.max(0, interval - elapsed);
    },
    [eggState, areGeeseHungry]
  );

  return {
    geeseWithEggs: getGeseWithEggs(),
    collectEgg,
    hasEgg,
    getTimeUntilNextEgg,
  };
}
