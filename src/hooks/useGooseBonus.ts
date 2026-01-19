import { useFarmStore } from '../store/farmStore';
import { useProductionStore, FEEDING_INTERVAL_MS } from '../store/productionStore';

interface GooseBonus {
  /** Multiplikátor pro vejce (např. 1.5 = +50%) */
  totalEggMultiplier: number;
  /** Absolutní bonus peří */
  totalFeatherBonus: number;
  /** Jsou husy hladové? */
  isAnyGooseHungry: boolean;
}

/**
 * Hook pro výpočet bonusu z hus k odměnám z mini-her.
 *
 * Každá husa přidává bonus podle své rarity:
 * - common (eggProduction: 1) = +10%
 * - rare (eggProduction: 2) = +20%
 * - epic (eggProduction: 3) = +30%
 * - legendary (eggProduction: 5) = +50%
 *
 * Hladové husy produkují pouze 50% bonusu.
 */
export function useGooseBonus(): GooseBonus {
  const { geese } = useFarmStore();
  const { lastFeeding } = useProductionStore();

  // Přímý výpočet z Zustand store - reaktivní na změny lastFeeding
  const isHungry = geese.length > 0 && Date.now() - lastFeeding >= FEEDING_INTERVAL_MS;

  // Součet produkce všech hus
  const baseEggProduction = geese.reduce((sum, g) => sum + g.eggProduction, 0);
  const baseFeatherBonus = geese.reduce((sum, g) => sum + g.featherBonus, 0);

  // Hladové husy produkují pouze 50%
  const hungerPenalty = isHungry ? 0.5 : 1.0;

  return {
    // Každý bod eggProduction = +10% k odměnám
    totalEggMultiplier: 1 + baseEggProduction * 0.1 * hungerPenalty,
    totalFeatherBonus: Math.floor(baseFeatherBonus * hungerPenalty),
    isAnyGooseHungry: isHungry,
  };
}
