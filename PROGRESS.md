# Husí farma - Progress implementace

> Původní plán viz [PLAN.md](PLAN.md)

## Fáze 1: Základ ✅ HOTOVO

- [x] Nastavit Zustand stores s persist middleware
  - `gameStore.ts` - navigace, nastavení
  - `currencyStore.ts` - vejce, peří, zrní
  - `farmStore.ts` - husy, budovy, kapacita
  - `progressStore.ts` - XP, level, statistiky, achievements
  - `exerciseStore.ts` - načítání cvičení z JSON
- [x] Vytvořit typový systém (`types/farm.ts`)
- [x] Implementovat MainMenu a navigaci
- [x] Vytvořit FarmView (základní)
- [x] Implementovat MinigameWrapper

## Fáze 2: První mini-hra ✅ HOTOVO

- [x] Implementovat **Vejce v hnízdě** (EggNest)
- [x] Vytvořit JSON strukturu pro cvičení
- [x] Přidat 30 cvičení pro I/Y (`softHardIY.json`)
- [x] Streak systém a odměny

**Bonus:** Implementovány všechny mini-hry předčasně:
- [x] Husí pochod (GooseMarch) - předpony vz/z/s
- [x] Přelet hejna (FlockFlight) - vyjmenovaná slova
- [x] Stavba plotu (FenceBuilder) - délka samohlásek
- [x] Husí detektiv (GooseDetective) - najdi chybu

## Fáze 3: Herní smyčka ✅ HOTOVO

- [x] Implementovat obchod (Shop)
- [x] Nákup hus a budov
- [x] **Pasivní produkce zrní z polí** - `useFarmProduction` hook
- [x] **Krmení hus (spotřeba zrní)** - tlačítko na farmě
- [x] **Animace sběru vajec** - kliknutí na husu

## Fáze 4: Další mini-hry ✅ HOTOVO

- [x] Husí pochod (předpony)
- [x] Přelet hejna (vyjmenovaná)
- [x] Stavba plotu (délka)
- [x] Husí detektiv (chyby)

## Fáze 5: Polish ✅ HOTOVO

- [x] Zvukové efekty - `useSound` hook s Web Audio API
- [x] Denní výzvy - `DailyChallenges` komponenta
- [x] Achievements systém (UI) - `Achievements` komponenta
- [x] Animace (sběr vajec, waddle, fadeIn)

---

## Cvičení v databázi

| Soubor | Kategorie | Počet cvičení |
|--------|-----------|---------------|
| `prefixes.json` | Předpony vz/z/s | 20 |
| `softHardIY.json` | I/Y měkké/tvrdé | 30 |
| `declaredWords.json` | Vyjmenovaná slova | 30 |
| `vowelLength.json` | Délka samohlásek | 30 |
| `sentences.json` | Najdi chybu | 30 |

**Celkem: 140 cvičení**

---

## Co funguje

1. Navigace mezi obrazovkami (menu → farma → obchod → mini-hry → úspěchy → výzvy)
2. Všech 5 mini-her s různými mechanikami
3. Streak systém (3/5/10 správně = bonusy, Husí horečka)
4. Adaptivní obtížnost per kategorie
5. Nápovědy po 2 chybách
6. XP a leveling systém
7. Nákup hus a budov v obchodě
8. Persistence všeho v localStorage
9. **Pasivní produkce zrní z polí** (+ offline produkce)
10. **Krmení hus** (spotřeba zrní, varování při hladu)
11. **Animace sběru vajec** (kliknutí na husu)
12. **Zvukové efekty** (správná/špatná odpověď, streak, nákup, krmení)
13. **UI pro achievements** (21 úspěchů, automatické odemykání)
14. **Denní výzvy** (3 nové výzvy každý den, odměny)

---

## Nově přidané soubory

| Soubor | Popis |
|--------|-------|
| `src/hooks/useFarmProduction.ts` | Hook pro pasivní produkci zrní a krmení |
| `src/hooks/useSound.ts` | Hook pro zvukové efekty (Web Audio API) |
| `src/data/achievements.ts` | Definice 21 achievementů |
| `src/components/farm/Achievements.tsx` | UI pro zobrazení úspěchů |
| `src/components/farm/DailyChallenges.tsx` | UI pro denní výzvy |

---

## Herní smyčka - finální verze

```
1. HRÁT MINI-HRU → 2. ZÍSKAT VEJCE/PEŘÍ/XP → 3. NAKOUPIT V OBCHODĚ → 4. POLE PRODUKUJÍ ZRNÍ → 5. NAKRMIT HUSY → zpět
```

### Měny a jejich zdroje:

| Měna | Získání | Použití |
|------|---------|---------|
| 🥚 Vejce | Správné odpovědi, streak bonusy, denní výzvy | Nákup hus, budov |
| 🪶 Peří | Streak 10+, denní výzvy | Vzácné předměty (páv) |
| 🌾 Zrní | Pasivně z polí (10/min), startovní zásoby | Krmení hus |

### Achievements (21 úspěchů):
- Herní milníky (1/10/50/100 her)
- Správné odpovědi (10/100/500/1000)
- Streak (5/10/20)
- Level (5/10/25)
- Počet hus (3/5/10)
- Denní streak (3/7/30 dní)
