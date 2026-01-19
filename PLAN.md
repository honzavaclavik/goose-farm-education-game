# Plán refaktoru: Husí farma - Edukační hra

## Přehled projektu

Kompletní refaktor stávající hry "Chytej Husy" na novou edukační hru "Husí farma" zaměřenou na český pravopis pro děti.

### Současný stav
- React/TypeScript PWA (Vite)
- Jednoduchá arcade hra - chytání padajících objektů
- Pouze React useState, localStorage jen pro highScore
- 6 komponent, 3 custom hooks

### Cílový stav
- Komplexní edukační hra s herní smyčkou: Krmení → Vejce → Farma → Nákup
- 5 didaktických mini-her pro různé pravopisné jevy
- Budování a rozšiřování farmy
- **Veškerý stav persistovaný v localStorage** (farma, měny, progress)
- **Snadno rozšiřitelná databáze cvičení** (JSON soubory)

---

## Herní smyčka

```
1. KRMENÍ HUS (mini-hra) → 2. HUSY SNÁŠEJÍ VEJCE → 3. VYLEPŠENÍ FARMY → 4. NOVÉ HUSY/BUDOVY → zpět
```

---

## Architektura

### Struktura složek

```
src/
├── components/
│   ├── common/           # Button, Modal, ProgressBar, CurrencyDisplay
│   ├── farm/             # FarmView, Building, GooseCard, Shop
│   ├── minigames/
│   │   ├── shared/       # MinigameWrapper, Header, Result, HintDisplay
│   │   ├── GooseMarch/   # Předpony vz/z/s
│   │   ├── EggNest/      # I/Y po měkkých/tvrdých
│   │   ├── FlockFlight/  # Vyjmenovaná slova
│   │   ├── FenceBuilder/ # Délka samohlásek
│   │   └── GooseDetective/ # Najdi chybu
│   └── screens/          # MainMenu, FarmScreen, MinigameSelector
│
├── store/                # Zustand stores (vše s persist middleware)
│   ├── gameStore.ts
│   ├── farmStore.ts
│   ├── currencyStore.ts
│   ├── progressStore.ts
│   └── exerciseStore.ts
│
├── data/
│   └── exercises/        # JSON soubory - SNADNO ROZŠIŘITELNÉ
│       ├── prefixes.json
│       ├── softHardIY.json
│       ├── declaredWords.json
│       ├── vowelLength.json
│       └── sentences.json
│
├── types/
├── hooks/
├── constants/
└── utils/
```

### State Management: Zustand s persistencí

Všechny stores používají `persist` middleware → **kompletní stav v localStorage**:

```typescript
// Příklad - farmStore
export const useFarmStore = create<FarmState>()(
  persist(
    (set, get) => ({
      geese: [{ id: '1', type: 'common', ... }],
      buildings: [],
      // ... actions
    }),
    { name: 'goose-farm-state' }  // klíč v localStorage
  )
);
```

**localStorage klíče:**
- `goose-farm-state` - husy, budovy, kapacita
- `goose-farm-currencies` - vejce, peří, zrní
- `goose-farm-progress` - level, XP, statistiky, achievements
- `goose-farm-settings` - zvuk, jazyk

---

## Rozšiřitelná databáze cvičení

### Formát JSON (snadno editovatelný)

```json
// data/exercises/prefixes.json
{
  "category": "prefixes",
  "exercises": [
    {
      "id": "pref-001",
      "word": "_trávit",
      "answer": "z",
      "options": ["vz", "z", "s"],
      "difficulty": 1,
      "hint": "Jídlo zmizí v žaludku",
      "rule": "Předpona Z- značí změnu stavu"
    }
  ]
}
```

### Jak přidat nová cvičení

1. Otevřít příslušný JSON soubor v `src/data/exercises/`
2. Přidat nový objekt do pole `exercises`
3. Hotovo - hra automaticky načte nová cvičení

### Validační schéma (TypeScript)

```typescript
interface Exercise {
  id: string;
  word: string;
  answer: string;
  options?: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  hint: string;
  rule: string;
}
```

---

## 5 Mini-her

| Mini-hra | Kategorie | Mechanika |
|----------|-----------|-----------|
| **Husí pochod** | Předpony vz/z/s | Husy pochodují k bránám, výběr správné brány |
| **Vejce v hnízdě** | I/Y měkké/tvrdé | Drag & drop vejce s I/Y do slova |
| **Přelet hejna** | Vyjmenovaná slova | Chytání správných slov z letícího hejna |
| **Stavba plotu** | Délka samohlásek | Označování dlouhých/krátkých |
| **Husí detektiv** | Najdi chybu | Oprava chyb ve větách |

---

## Měny a motivace

| Měna | Získání | Použití |
|------|---------|---------|
| 🥚 Vejce | Správné odpovědi | Nákup hus, budov |
| 🪶 Peří | Série, denní login | Vzácné předměty |
| 🌾 Zrní | Pasivně z polí | Krmení hus |

### Streak systém
- 3 správně → +1 vejce
- 5 správně → +3 vejce
- 10 správně → **HUSÍ HOREČKA** (2x body 30s)

### Ochrana před frustrací
- Chyba = žádná ztráta, jen nedostaneš vejce
- Nápověda po 2 chybách
- Adaptivní obtížnost per kategorie

---

## Fáze implementace

### Fáze 1: Základ (první sprint)
- [ ] Nastavit Zustand stores s persist middleware
- [ ] Vytvořit typový systém
- [ ] Implementovat MainMenu a navigaci
- [ ] Vytvořit FarmView (základní)
- [ ] Implementovat MinigameWrapper

### Fáze 2: První mini-hra
- [ ] Implementovat **Vejce v hnízdě** (drag & drop)
- [ ] Vytvořit JSON strukturu pro cvičení
- [ ] Přidat 30+ cvičení pro I/Y
- [ ] Streak systém a odměny

### Fáze 3: Herní smyčka
- [ ] Implementovat obchod (Shop)
- [ ] Nákup hus a budov
- [ ] Pasivní produkce zrní
- [ ] Animace sběru vajec

### Fáze 4: Další mini-hry
- [ ] Husí pochod (předpony)
- [ ] Přelet hejna (vyjmenovaná)
- [ ] Stavba plotu (délka)
- [ ] Husí detektiv (chyby)

### Fáze 5: Polish
- [ ] Animace a zvuky
- [ ] Denní výzvy
- [ ] Achievements
- [ ] Testování a bugfix

---

## Klíčové soubory k vytvoření/úpravě

1. **`src/store/farmStore.ts`** - stav farmy s persistencí
2. **`src/store/currencyStore.ts`** - měny s persistencí
3. **`src/store/progressStore.ts`** - progress s persistencí
4. **`src/data/exercises/*.json`** - rozšiřitelná cvičení
5. **`src/components/minigames/shared/MinigameWrapper.tsx`** - sdílený wrapper
6. **`src/components/farm/FarmView.tsx`** - hlavní pohled farmy

---

## Verifikace

Po implementaci otestovat:
1. Spustit `npm run dev`
2. Zahrát mini-hru, ověřit že se vejce přičtou
3. Koupit husu/budovu v obchodě
4. **Refreshnout stránku** → farma musí být stejná
5. Přidat nové cvičení do JSON → ověřit že se načte
