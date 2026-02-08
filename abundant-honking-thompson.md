# Visual Upgrade: Township/Hay Day Quality

## Context
The "Chytej Husy!" game has a semi-glossy flat UI style. The goal is to transform it into a rich, warm, hand-painted cartoon aesthetic comparable to Township/Hay Day — with wood/parchment textures, 3D buttons, particle effects, and screen transitions. All textures must be CSS-only (no external images). The existing inline CSSProperties pattern is preserved.

## Current State Summary
- **Stack:** React 18 + Vite + TypeScript + Zustand, PWA
- **Styling:** Inline CSSProperties, CSS variables in `designSystem.css`
- **Font:** Nunito declared but not loaded from Google Fonts
- **SVGs:** Detailed isometric buildings, geese, floating island background already exist
- **Screens:** MainMenu, FarmView, Shop, MinigameSelector, DailyChallenges, Achievements
- **No Framer Motion** installed yet

---

## Phase 1: Typography + Colors + Base Theme

### Files to modify
- **`index.html`** — Add Google Fonts: `Fredoka One`, `Lilita One`, `Nunito` (weights 400,600,700,800)
- **`src/styles/designSystem.css`** — Extend `:root` with:
  - Warmer color palette (wood, parchment, stone, gold colors)
  - Font family variables: `--font-heading`, `--font-display`, `--font-body`
  - Text outline variables for white-on-color readability
  - CSS texture patterns: `--texture-wood`, `--texture-parchment`, `--texture-stone` (repeating-linear-gradient + radial-gradient combos)
  - Gold frame border/shadow variables
  - 3D button shadow variables (`--shadow-button-3d`, `--shadow-button-3d-pressed`)
  - Wood panel shadow (`--shadow-wood-panel`)
- **`src/index.css`** — Update body `font-family` to `var(--font-body)`

### Key new CSS variables
```
--color-wood-light/mid/dark/border, --color-parchment/mid/dark
--color-stone-light/mid/dark, --color-gold/dark/light
--font-heading, --font-display, --font-body
--text-outline-dark, --text-outline-brown
--texture-wood, --texture-parchment, --texture-stone
--shadow-wood-panel, --shadow-button-3d, --border-gold-frame
```

---

## Phase 2: HUD + Navigation Bar + Common Components

### Files to modify
- **`src/components/common/Button.tsx`** — 3D cartoon buttons:
  - Rounded rect (not pill), visible depth border-bottom (4-6px darker)
  - `var(--font-heading)` for text, `textShadow` for white text on color
  - Replace imperative onMouse handlers with cleaner style approach
  - `--shadow-button-3d` normal, `--shadow-button-3d-pressed` on active
  - Warmer variant gradients

- **`src/components/common/CurrencyDisplay.tsx`** — Wooden containers:
  - Background: `var(--texture-wood)`, border: wood-border color
  - Replace emoji icons with small inline SVG icons (wheat sheaf, egg, feather)
  - White text with brown text-outline

- **`src/components/common/ProgressBar.tsx`** — Wood-textured bar:
  - Dark wood background texture, wood border
  - Optional small rivet decorations at ends

- **`src/components/common/Modal.tsx`** — Parchment modal:
  - Background: `var(--texture-parchment)`, border: gold frame
  - Header: wood texture bar, close button styled as wooden circle
  - Title: `var(--font-heading)` with text outline

- **`src/components/farm/FarmView.tsx`** — HUD + bottom nav:
  - **Header:** Wooden plank texture (opaque, no backdrop-filter), wood border-bottom
  - **Level badge:** Golden circular medallion with radial gold gradient, white text with dark outline
  - **Bottom nav:** Stone tablet texture bar, stone border-top, reorganize buttons as icon-first layout

### New file to create
- **`src/components/common/WoodPanel.tsx`** — Reusable wood/parchment panel wrapper with variants (`light`, `dark`, `parchment`), wood grain overlay, corner decorations, shadow

---

## Phase 3: Main Farm View Enhancements

### Files to modify
- **`src/components/farm/FarmBackground.tsx`** — Enrichments:
  - Split clouds into 3 parallax layers (different speeds)
  - Add decorative SVG elements: hay bale, water bucket, feeder, apple tree, small pond
  - Add warm sun ray effect (radial gradient, slow rotation)

- **`src/components/farm/FarmView.tsx`** — Goose enclosure:
  - Replace green glass-morph area with dirt/grass patch + fence on all sides
  - Scattered grain dots, water dish in corner
  - Capacity display as wooden signpost
  - Feed message as parchment scroll popup

- **`src/components/farm/FarmBuildings.tsx`** — Labels:
  - Building names: wooden nameplates with `var(--texture-wood)`
  - Effect badges: golden banner shape

---

## Phase 4: Shop

### Files to modify
- **`src/components/farm/Shop.tsx`**:
  - **Background:** Barn interior (dark wood plank wall via repeating gradient + warm glow overlay)
  - **Header:** Wooden beam with `var(--texture-wood)`, title in `var(--font-display)`
  - **Cards:** Parchment background + gold frame border, shadow
  - **Icons:** Replace 48px emoji with small inline SVG illustrations (mini goose SVGs, mini building SVGs)
  - **Price tags:** Ribbon banner shape with pointed CSS ends
  - **Add category tabs:** "Husy | Budovy" as wooden bookmark tabs at top of grid
  - **Purchase confirm modal:** Uses upgraded Modal component

---

## Phase 5: Minigame Selection

### Files to modify
- **`src/components/screens/MinigameSelector.tsx`**:
  - **Title:** Wooden signpost SVG component
  - **Cards:** Colorful border matching `game.color` with 3D depth, parchment bottom section
  - **Icons:** Replace 64px emoji with themed mini SVG scenes per game
  - **Star rating:** 3 SVG stars (gold filled / gray outline) per card based on `categoryStats`
  - **Locked overlay:** Dark overlay + padlock SVG + "Level X" text (for future use)
  - **"Hrat" button:** 3D style matching card's theme color

---

## Phase 6: Daily Challenges + Achievements

### Files to modify
- **`src/components/farm/DailyChallenges.tsx`**:
  - **Background:** Warm sunset gradient with faint farm silhouette SVG at bottom
  - **Cards:** Parchment scroll texture + wood border
  - **Progress bar:** Custom goose-on-path indicator (dotted trail, goose icon at progress point, star at end)
  - **Claim button:** Golden shimmer animation (moving highlight gradient), pulsing glow
  - **Claimed state:** Green parchment tint + golden checkmark stamp SVG

- **`src/components/farm/Achievements.tsx`**:
  - **Background:** Dark wood wall texture + torch glow radial gradients at top corners
  - **Unlocked cards:** Medal/badge shape (clip-path octagon or shield), gold gradient, hanging ribbon SVG, shimmer
  - **Locked cards:** Stone texture, padlock SVG icon, gray text
  - **New unlocked:** Enhanced golden glow + sparkle + bounce-in
  - **Trophy showcase:** Top section with 3 best achievements in larger format on wooden shelf

---

## Phase 7: Animations + Particle Effects

### Dependency
- `bun add framer-motion`

### Files to modify
- **`src/App.tsx`** — Wrap screen render in `<AnimatePresence>` + `<motion.div>` with fade+scale enter/exit transitions keyed by `currentScreen`

- **`src/components/common/Button.tsx`** — Replace imperative mouse handlers with `<motion.button>` using `whileHover`, `whileTap` with spring physics

- **`src/components/common/CurrencyDisplay.tsx`** — `<motion.span>` on values with bounce on change, floating "+N"/"-N" text animation

- **`src/components/farm/FarmView.tsx`** — Feed message: `<motion.div>` pop-in/fade-out. Building hover: `<motion.div>` whileHover

### New files to create
- **`src/components/common/ParticleEffect.tsx`** — Reusable particle system (types: `confetti`, `sparkle`, `coins`, `feathers`, `stars`). Each particle = `<motion.div>` with random trajectory, rotation, fade. Use in:
  - FarmView egg collection (sparkle)
  - Shop purchase (coins)
  - DailyChallenges claim (confetti)
  - Achievements unlock (stars)

- **`src/components/common/ScreenTransition.tsx`** — Wrapper with `AnimatePresence` for consistent screen enter/exit animations

---

## Phase 8: Polish + Final Details

### Files to modify
- **`src/components/screens/MainMenu.tsx`** — Full redesign:
  - Replace goose emoji with full GooseSVG (large, animated waddle)
  - Title: `var(--font-display)`, large, white with heavy 3D outline
  - Stats: WoodPanel boxes
  - Animated sunset farm background with parallax clouds
  - Version on wooden plank

- **`src/components/minigames/shared/MinigameWrapper.tsx`** — Header: wooden plank, stats: wooden badges, result screen: parchment+gold

- **`src/hooks/useSound.ts`** — Add synthesized sound effect placeholders: `screenTransition`, `buttonHover`, `panelOpen`, `panelClose`, `claimReward`, `achievementUnlock`, `coinDrop`

- **All files** — Consistency pass:
  - All headings use `var(--font-heading)`
  - White-on-color text has `textShadow` outline
  - All card backgrounds use parchment/wood, never plain white
  - All borders warm brown/gold, never gray
  - Remove raw emoji for large UI elements (replace with SVG)

### Responsive tweaks
- Mobile (<480px): stack HUD vertically, single-column cards, smaller fonts
- Tablet (480-768px): 2-column cards, compact HUD
- Desktop (>768px): full layout, hover effects active

---

## New Files Summary

| File | Purpose |
|------|---------|
| `src/components/common/WoodPanel.tsx` | Reusable wood/parchment container |
| `src/components/common/ParticleEffect.tsx` | Confetti/sparkle/coin particles |
| `src/components/common/ScreenTransition.tsx` | Framer Motion screen wrapper |

## Dependencies to Add
| Package | Purpose |
|---------|---------|
| `framer-motion` | Screen transitions, micro-interactions, particles |

## Phase Dependencies
```
Phase 1 → Phase 2 → Phase 3 ─┐
                     Phase 4 ─┤ (3-6 parallelizable after 2)
                     Phase 5 ─┤
                     Phase 6 ─┘→ Phase 7 → Phase 8
```

## Verification
After each phase:
1. Run `bun run build` — ensure no TypeScript errors
2. Run `bun run dev` — visual inspection on mobile viewport (375x667) and desktop (1024x768)
3. Check that all screens render correctly and no regressions in interactivity
4. After Phase 7: verify screen transitions are smooth (no flicker)
5. After Phase 8: full walkthrough of all screens on mobile and desktop
