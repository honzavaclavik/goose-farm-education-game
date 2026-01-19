import { useEffect, useRef, useCallback } from 'react';
import { useFarmStore } from '../store/farmStore';
import { useCurrencyStore } from '../store/currencyStore';
import { useProductionStore, FEEDING_INTERVAL_MS } from '../store/productionStore';

const PRODUCTION_INTERVAL_MS = 60000; // 1 minuta

// Re-export pro zpětnou kompatibilitu
export { FEEDING_INTERVAL_MS };

export function useFarmProduction() {
  const { buildings, geese } = useFarmStore();
  const { addGrain, grain, spendGrain } = useCurrencyStore();
  const {
    lastFeeding: lastFeedingTime,
    lastGrainProduction,
    setLastFeeding,
    setLastGrainProduction,
  } = useProductionStore();

  const intervalRef = useRef<number | null>(null);

  // Výpočet produkce zrní z polí
  const calculateGrainProduction = useCallback(() => {
    return buildings
      .filter((b) => b.type === 'field')
      .reduce((sum, b) => sum + b.effect, 0);
  }, [buildings]);

  // Výpočet spotřeby zrní při krmení (1 zrní na husu)
  const calculateFeedingCost = useCallback(() => {
    return geese.length;
  }, [geese]);

  // Zpracování offline produkce při načtení
  const processOfflineProduction = useCallback(() => {
    const now = Date.now();

    // Offline produkce zrní
    const grainPerMinute = calculateGrainProduction();
    if (grainPerMinute > 0) {
      const minutesPassed = Math.floor(
        (now - lastGrainProduction) / PRODUCTION_INTERVAL_MS
      );
      if (minutesPassed > 0) {
        const offlineGrain = grainPerMinute * minutesPassed;
        addGrain(offlineGrain);
        setLastGrainProduction(now);
      }
    }
  }, [addGrain, calculateGrainProduction, lastGrainProduction, setLastGrainProduction]);

  // Hlavní produkční tick
  const tick = useCallback(() => {
    const now = Date.now();

    // Produkce zrní z polí (každou minutu)
    const grainPerMinute = calculateGrainProduction();
    if (grainPerMinute > 0 && now - lastGrainProduction >= PRODUCTION_INTERVAL_MS) {
      addGrain(grainPerMinute);
      setLastGrainProduction(now);
    }
  }, [addGrain, calculateGrainProduction, lastGrainProduction, setLastGrainProduction]);

  // Krmení hus - voláno externě
  const feedGeese = useCallback((): { success: boolean; cost: number; fedGeese: number } => {
    const cost = calculateFeedingCost();
    if (cost === 0) {
      return { success: true, cost: 0, fedGeese: 0 };
    }

    if (grain >= cost) {
      spendGrain(cost);
      setLastFeeding(Date.now());
      return { success: true, cost, fedGeese: geese.length };
    }

    return { success: false, cost, fedGeese: 0 };
  }, [calculateFeedingCost, grain, spendGrain, geese.length, setLastFeeding]);

  // Kontrola zda jsou husy hladové
  const areGeeseHungry = useCallback((): boolean => {
    if (geese.length === 0) return false;
    return Date.now() - lastFeedingTime >= FEEDING_INTERVAL_MS;
  }, [geese.length, lastFeedingTime]);

  // Čas do dalšího krmení
  const getTimeUntilHungry = useCallback((): number => {
    const elapsed = Date.now() - lastFeedingTime;
    return Math.max(0, FEEDING_INTERVAL_MS - elapsed);
  }, [lastFeedingTime]);

  // Spuštění produkčního cyklu
  useEffect(() => {
    // Zpracovat offline produkci
    processOfflineProduction();

    // Spustit periodický tick (každých 10 sekund kontrola)
    intervalRef.current = window.setInterval(tick, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tick, processOfflineProduction]);

  return {
    grainPerMinute: calculateGrainProduction(),
    feedingCost: calculateFeedingCost(),
    feedGeese,
    areGeeseHungry,
    getTimeUntilHungry,
    lastFeedingTime,
  };
}
