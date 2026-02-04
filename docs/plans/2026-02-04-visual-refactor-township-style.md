# Township-Style Visual Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Vizuálně zrefaktorovat celou hru pomocí moderního Flat Design s depth, inspirovaného Township - bright & cheerful styl s glossy UI prvky, shadows, a polish efekty.

**Architecture:** Pure CSS redesign s Township-inspired design systemem. Vytvoříme centrální CSS variables pro barevnou paletu, spacing, shadows a typography. Všechny komponenty budou upgradovány na glossy, polished look s konzistentním vizuálním jazykem. Fokus na depth (shadows, gradients), rounded corners, micro-interactions a smooth animations.

**Tech Stack:**
- Pure CSS/CSS-in-JS (inline styles v React)
- CSS Variables pro design tokens
- CSS Animations a transitions
- No external libraries needed

---

## Task 1: Vytvořit Design System Foundation

**Files:**
- Create: `src/styles/designSystem.css`
- Modify: `src/index.css`

**Step 1: Vytvořit design system CSS soubor s variables**

V `src/styles/designSystem.css`:

```css
/* Design System - Township-inspired */
:root {
  /* Primary Colors - Sky & Nature */
  --color-sky-start: #5dade2;
  --color-sky-end: #87ceeb;
  --color-grass-start: #7cb342;
  --color-grass-end: #98fb98;
  --color-ground: #8b7355;

  /* UI Colors */
  --color-primary: #4caf50;
  --color-primary-hover: #45a049;
  --color-primary-dark: #388e3c;
  --color-secondary: #ff9800;
  --color-secondary-hover: #fb8c00;
  --color-accent: #ffd54f;
  --color-danger: #f44336;
  --color-danger-hover: #e53935;
  --color-success: #66bb6a;
  --color-warning: #ffa726;

  /* Neutrals */
  --color-white: #ffffff;
  --color-bg-card: rgba(255, 255, 255, 0.95);
  --color-bg-glass: rgba(255, 255, 255, 0.1);
  --color-text-primary: #2c3e50;
  --color-text-secondary: #7f8c8d;
  --color-overlay: rgba(0, 0, 0, 0.5);

  /* Shadows - Township style layered shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  /* Glossy Effects */
  --gloss-highlight: linear-gradient(180deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.1) 100%);
  --gloss-inset: inset 0 1px 0 rgba(255, 255, 255, 0.5);

  /* Border Radius - Township má výrazné rounded corners */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  /* Spacing Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Typography */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 2rem;      /* 32px */
  --text-4xl: 2.5rem;    /* 40px */
  --text-5xl: 3rem;      /* 48px */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-bounce: 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Utility Classes */
.glossy {
  position: relative;
}

.glossy::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gloss-highlight);
  border-radius: inherit;
  pointer-events: none;
}

.glass-morphism {
  background: var(--color-bg-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-6);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-fadeIn {
  animation: fadeIn var(--transition-base) ease;
}

.animate-slideInUp {
  animation: slideInUp var(--transition-slow) ease;
}

/* Button Base Styles */
.btn-glossy {
  position: relative;
  border: none;
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  overflow: hidden;
}

.btn-glossy:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-glossy:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-glossy::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent);
  transition: left 0.5s;
}

.btn-glossy:hover::after {
  left: 100%;
}
```

**Step 2: Import design system do main CSS**

Modify `src/index.css`:

```css
@import './styles/designSystem.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}

html,
body {
  height: 100%;
}

body {
  overflow-y: auto;
  overflow-x: hidden;
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(180deg, var(--color-sky-start) 0%, var(--color-grass-end) 100%);
  touch-action: pan-y;
  color: var(--color-text-primary);
}

#root {
  height: 100%;
}
```

**Step 3: Vytvořit directory pro styles**

Run: `mkdir -p src/styles`

**Step 4: Commit design system foundation**

```bash
git add src/styles/designSystem.css src/index.css
git commit -m "feat: add Township-inspired design system foundation with CSS variables"
```

---

## Task 2: Upgrade Button Component

**Files:**
- Modify: `src/components/common/Button.tsx`

**Step 1: Refaktorovat Button s glossy Township-style designem**

Replace content of `src/components/common/Button.tsx`:

```typescript
import { CSSProperties, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const baseStyle: CSSProperties = {
    position: 'relative',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    fontWeight: 'var(--font-bold)',
    transition: 'all var(--transition-base)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    overflow: 'hidden',
  };

  const sizeStyles: Record<string, CSSProperties> = {
    small: {
      padding: '10px 20px',
      fontSize: 'var(--text-sm)',
      boxShadow: 'var(--shadow-sm)',
    },
    medium: {
      padding: '14px 28px',
      fontSize: 'var(--text-base)',
      boxShadow: 'var(--shadow-md)',
    },
    large: {
      padding: '18px 36px',
      fontSize: 'var(--text-xl)',
      boxShadow: 'var(--shadow-lg)',
    },
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
      color: 'var(--color-white)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
    },
    secondary: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #dfe6e9 100%)',
      color: 'var(--color-text-primary)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
    },
    success: {
      background: 'linear-gradient(135deg, var(--color-success) 0%, #4caf50 100%)',
      color: 'var(--color-white)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
    },
    danger: {
      background: 'linear-gradient(135deg, var(--color-danger) 0%, var(--color-danger-hover) 100%)',
      color: 'var(--color-white)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
    },
    warning: {
      background: 'linear-gradient(135deg, var(--color-warning) 0%, var(--color-secondary) 100%)',
      color: 'var(--color-white)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
    },
  };

  const glossyOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = sizeStyles[size].boxShadow as string;
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
    >
      <div style={glossyOverlayStyle} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}
```

**Step 2: Test Button komponenty v browseru**

Run: `bun run dev`
Navigate: http://localhost:5173/
Expected: Buttons mají glossy Township look s hover efekty

**Step 3: Commit upgraded Button**

```bash
git add src/components/common/Button.tsx
git commit -m "feat: upgrade Button component with glossy Township-style design"
```

---

## Task 3: Upgrade MainMenu Screen

**Files:**
- Modify: `src/components/screens/MainMenu.tsx`

**Step 1: Redesign MainMenu s Township-inspired polish**

Replace content of `src/components/screens/MainMenu.tsx`:

```typescript
import { CSSProperties } from 'react';
import { Button } from '../common/Button';
import { useGameStore } from '../../store/gameStore';
import { useProgressStore } from '../../store/progressStore';
import { useCurrencyStore } from '../../store/currencyStore';

export function MainMenu() {
  const { setScreen } = useGameStore();
  const { level, dailyStreak, checkDailyLogin } = useProgressStore();
  const { addFeathers } = useCurrencyStore();

  const handleStart = () => {
    const isFirstToday = checkDailyLogin();
    if (isFirstToday) {
      addFeathers(dailyStreak);
    }
    setScreen('farm');
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 'var(--space-6)',
    background: 'linear-gradient(180deg, var(--color-sky-start) 0%, var(--color-grass-end) 100%)',
    position: 'relative',
    overflow: 'hidden',
  };

  // Decorative clouds
  const cloudStyle: CSSProperties = {
    position: 'absolute',
    fontSize: '48px',
    opacity: 0.6,
    animation: 'float 4s ease-in-out infinite',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'clamp(32px, 8vw, 64px)',
    fontWeight: 'var(--font-extrabold)',
    color: 'var(--color-white)',
    textShadow: `
      3px 3px 0 #5a8f5a,
      6px 6px 10px rgba(0,0,0,0.3),
      0 0 30px rgba(255,255,255,0.3)
    `,
    marginBottom: 'var(--space-2)',
    textAlign: 'center',
    animation: 'bounce 2s ease-in-out infinite',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 'clamp(16px, 4vw, 24px)',
    color: '#2e7d32',
    marginBottom: 'var(--space-10)',
    textAlign: 'center',
    fontWeight: 'var(--font-semibold)',
    textShadow: '0 2px 4px rgba(255,255,255,0.8)',
  };

  const gooseContainerStyle: CSSProperties = {
    position: 'relative',
    marginBottom: 'var(--space-6)',
  };

  const gooseStyle: CSSProperties = {
    fontSize: 'clamp(80px, 20vw, 150px)',
    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
    animation: 'float 3s ease-in-out infinite',
  };

  const statsStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-5)',
    marginBottom: 'var(--space-8)',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const statItemStyle: CSSProperties = {
    background: 'var(--color-bg-card)',
    padding: 'var(--space-4) var(--space-6)',
    borderRadius: 'var(--radius-xl)',
    textAlign: 'center',
    boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.8)',
    minWidth: '120px',
    position: 'relative',
    overflow: 'hidden',
  };

  const statLabelStyle: CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    fontWeight: 'var(--font-medium)',
    marginBottom: 'var(--space-1)',
  };

  const statValueStyle: CSSProperties = {
    fontSize: 'var(--text-3xl)',
    fontWeight: 'var(--font-extrabold)',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-1)',
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
    width: '100%',
    maxWidth: '320px',
    zIndex: 1,
  };

  const versionStyle: CSSProperties = {
    position: 'absolute',
    bottom: 'var(--space-3)',
    right: 'var(--space-3)',
    fontSize: 'var(--text-xs)',
    color: 'rgba(0, 0, 0, 0.3)',
    background: 'rgba(255, 255, 255, 0.6)',
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-md)',
  };

  // Glossy overlay for stat cards
  const glossyOverlay: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle}>
      {/* Decorative clouds */}
      <div style={{ ...cloudStyle, top: '10%', left: '10%', animationDelay: '0s' }}>☁️</div>
      <div style={{ ...cloudStyle, top: '20%', right: '15%', animationDelay: '1s' }}>☁️</div>
      <div style={{ ...cloudStyle, bottom: '30%', left: '5%', animationDelay: '2s' }}>☁️</div>

      <div style={gooseContainerStyle}>
        <div style={gooseStyle}>🪿</div>
      </div>

      <h1 style={titleStyle}>Husí Farma</h1>
      <p style={subtitleStyle}>Uč se pravopis a pěstuj husy!</p>

      <div style={statsStyle}>
        <div style={statItemStyle}>
          <div style={glossyOverlay} />
          <div style={statLabelStyle}>Level</div>
          <div style={statValueStyle}>{level}</div>
        </div>
        <div style={statItemStyle}>
          <div style={glossyOverlay} />
          <div style={statLabelStyle}>Denní streak</div>
          <div style={statValueStyle}>
            {dailyStreak}
            <span style={{ fontSize: 'var(--text-xl)' }}>🔥</span>
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <Button onClick={handleStart} variant="success" size="large" fullWidth>
          🎮 Hrát
        </Button>
        <Button
          onClick={() => setScreen('minigameSelector')}
          variant="primary"
          size="medium"
          fullWidth
        >
          📚 Procvičování
        </Button>
      </div>

      <div style={versionStyle}>
        v{__APP_VERSION__} • {new Date(__BUILD_TIME__).toLocaleString('cs-CZ')}
      </div>
    </div>
  );
}
```

**Step 2: Test MainMenu v browseru**

Run: Check http://localhost:5173/
Expected: Township-style polished MainMenu s floating clouds, glossy cards, animated goose

**Step 3: Commit upgraded MainMenu**

```bash
git add src/components/screens/MainMenu.tsx
git commit -m "feat: upgrade MainMenu with Township-style polished design"
```

---

## Task 4: Upgrade CurrencyDisplay Component

**Files:**
- Modify: `src/components/common/CurrencyDisplay.tsx`

**Step 1: Upgrade CurrencyDisplay s Township glossy badges**

Replace content of `src/components/common/CurrencyDisplay.tsx`:

```typescript
import { CSSProperties } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';

export function CurrencyDisplay() {
  const { grain, eggs, feathers } = useCurrencyStore();

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-3)',
    flexWrap: 'wrap',
  };

  const badgeStyle: CSSProperties = {
    background: 'var(--color-bg-card)',
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    fontWeight: 'var(--font-bold)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-primary)',
    boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.8)',
    position: 'relative',
    overflow: 'hidden',
    minWidth: '80px',
  };

  const iconStyle: CSSProperties = {
    fontSize: 'var(--text-lg)',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  };

  const valueStyle: CSSProperties = {
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-extrabold)',
  };

  const glossyOverlay: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
    pointerEvents: 'none',
  };

  const Badge = ({ icon, value, color }: { icon: string; value: number; color?: string }) => (
    <div style={badgeStyle}>
      <div style={glossyOverlay} />
      <span style={iconStyle}>{icon}</span>
      <span style={{ ...valueStyle, color: color || 'inherit' }}>{value}</span>
    </div>
  );

  return (
    <div style={containerStyle}>
      <Badge icon="🌾" value={grain} color="#8bc34a" />
      <Badge icon="🥚" value={eggs} color="#ffa726" />
      <Badge icon="🪶" value={feathers} color="#9c27b0" />
    </div>
  );
}
```

**Step 2: Test CurrencyDisplay v browseru**

Navigate: http://localhost:5173/ → Farm screen
Expected: Glossy currency badges v headeru

**Step 3: Commit upgraded CurrencyDisplay**

```bash
git add src/components/common/CurrencyDisplay.tsx
git commit -m "feat: upgrade CurrencyDisplay with glossy Township-style badges"
```

---

## Task 5: Upgrade ProgressBar Component

**Files:**
- Modify: `src/components/common/ProgressBar.tsx`

**Step 1: Upgrade ProgressBar s glossy fill a shadows**

Replace content of `src/components/common/ProgressBar.tsx`:

```typescript
import { CSSProperties } from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  current,
  max,
  color = 'var(--color-accent)',
  backgroundColor = 'rgba(255, 255, 255, 0.3)',
  height = 16,
  showLabel = true,
  label,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  const containerStyle: CSSProperties = {
    width: '100%',
  };

  const barBackgroundStyle: CSSProperties = {
    width: '100%',
    height: `${height}px`,
    backgroundColor,
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: 'var(--shadow-inner), 0 2px 4px rgba(0,0,0,0.1)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
  };

  const barFillStyle: CSSProperties = {
    height: '100%',
    width: `${percentage}%`,
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    transition: 'width var(--transition-slow) ease',
    position: 'relative',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
  };

  const glossyOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
    pointerEvents: 'none',
  };

  const labelStyle: CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    marginTop: 'var(--space-1)',
    textAlign: 'center',
    fontWeight: 'var(--font-semibold)',
    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
  };

  return (
    <div style={containerStyle}>
      <div style={barBackgroundStyle}>
        <div style={barFillStyle}>
          <div style={glossyOverlayStyle} />
        </div>
      </div>
      {showLabel && (
        <div style={labelStyle}>
          {label || `${current} / ${max}`}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Test ProgressBar v browseru**

Navigate: Farm screen (XP bar)
Expected: Glossy progress bar s smooth fill animation

**Step 3: Commit upgraded ProgressBar**

```bash
git add src/components/common/ProgressBar.tsx
git commit -m "feat: upgrade ProgressBar with glossy Township-style design"
```

---

## Task 6: Upgrade Modal Component

**Files:**
- Modify: `src/components/common/Modal.tsx`

**Step 1: Upgrade Modal s polished overlay a card design**

Replace content of `src/components/common/Modal.tsx`:

```typescript
import { CSSProperties, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 'var(--space-4)',
    animation: 'fadeIn var(--transition-base) ease',
  };

  const modalStyle: CSSProperties = {
    background: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-2xl)',
    boxShadow: 'var(--shadow-xl)',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    animation: 'slideInUp var(--transition-slow) ease',
  };

  const headerStyle: CSSProperties = {
    padding: 'var(--space-6)',
    borderBottom: '2px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,240,240,1) 100%)',
    borderTopLeftRadius: 'var(--radius-2xl)',
    borderTopRightRadius: 'var(--radius-2xl)',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'var(--text-2xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-text-primary)',
    margin: 0,
  };

  const closeButtonStyle: CSSProperties = {
    background: 'rgba(0, 0, 0, 0.1)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 'var(--text-xl)',
    color: 'var(--color-text-secondary)',
    transition: 'all var(--transition-base)',
    boxShadow: 'var(--shadow-sm)',
  };

  const contentStyle: CSSProperties = {
    padding: 'var(--space-6)',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div style={headerStyle}>
            <h2 style={titleStyle}>{title}</h2>
            <button
              style={closeButtonStyle}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
}
```

**Step 2: Test Modal component**

Navigate: Anywhere modals are used (Shop, Achievements)
Expected: Smooth animated modal s glossy design

**Step 3: Commit upgraded Modal**

```bash
git add src/components/common/Modal.tsx
git commit -m "feat: upgrade Modal with polished Township-style design and animations"
```

---

## Task 7: Upgrade FarmView Screen

**Files:**
- Modify: `src/components/farm/FarmView.tsx`

**Step 1: Refactor FarmView s Township-style polish**

V `src/components/farm/FarmView.tsx`, změnit hlavní styling (keep logic intact):

Replace inline styles v FarmView:

```typescript
// Header style - glossy glass morphism
const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: 'var(--space-4)',
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  flexWrap: 'wrap',
  gap: 'var(--space-3)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
};

// Level badge - glossy
const levelBadgeStyle: CSSProperties = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: 'var(--space-3) var(--space-5)',
  borderRadius: 'var(--radius-full)',
  fontWeight: 'var(--font-bold)',
  fontSize: 'var(--text-base)',
  boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.3)',
  position: 'relative',
  overflow: 'hidden',
};

// Info panel - polished card
const infoPanelStyle: CSSProperties = {
  background: 'var(--color-bg-card)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-xl)',
  marginBottom: 'var(--space-4)',
  fontSize: 'var(--text-sm)',
  maxWidth: '400px',
  boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.8)',
  border: '2px solid rgba(255, 255, 255, 0.5)',
};

// Production info - glossy badge
const productionInfoStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--color-warning) 0%, var(--color-secondary) 100%)',
  padding: 'var(--space-3) var(--space-5)',
  borderRadius: 'var(--radius-full)',
  marginBottom: 'var(--space-4)',
  fontSize: 'var(--text-base)',
  fontWeight: 'var(--font-bold)',
  color: 'white',
  boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.4)',
  animation: 'pulse 2s ease-in-out infinite',
};

// Goose area - polished enclosure
const gooseAreaStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--space-3)',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: 'var(--space-6)',
  background: 'linear-gradient(135deg, rgba(124, 179, 66, 0.3) 0%, rgba(124, 179, 66, 0.5) 100%)',
  borderRadius: 'var(--radius-2xl)',
  minHeight: '150px',
  maxWidth: '550px',
  backdropFilter: 'blur(10px)',
  border: '4px solid rgba(139, 195, 74, 0.6)',
  boxShadow: 'var(--shadow-lg), inset 0 2px 8px rgba(0,0,0,0.1)',
};

// Capacity badge
const capacityStyle: CSSProperties = {
  background: 'var(--color-bg-card)',
  padding: 'var(--space-3) var(--space-5)',
  borderRadius: 'var(--radius-full)',
  marginTop: 'var(--space-3)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-semibold)',
  color: 'var(--color-text-primary)',
  boxShadow: 'var(--shadow-md)',
};

// Actions bar - glossy bottom bar
const actionsStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--space-3)',
  padding: 'var(--space-5)',
  justifyContent: 'center',
  flexWrap: 'wrap',
  background: 'rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  zIndex: 1,
  boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
};

// Feed message - Township-style floating notification
const feedMessageStyle: CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'var(--color-bg-card)',
  color: 'var(--color-text-primary)',
  padding: 'var(--space-5) var(--space-8)',
  borderRadius: 'var(--radius-xl)',
  fontSize: 'var(--text-xl)',
  fontWeight: 'var(--font-bold)',
  zIndex: 1000,
  animation: 'fadeIn 0.3s ease',
  boxShadow: 'var(--shadow-xl)',
  border: '3px solid white',
};
```

**Step 2: Add glossy overlay helper function**

Add před return v FarmView:

```typescript
const GlossyOverlay = () => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
    pointerEvents: 'none',
    borderRadius: 'inherit',
  }} />
);
```

**Step 3: Update JSX pro level badge a info panel**

Replace level badge div:

```typescript
<div style={{ position: 'relative' }}>
  <div style={levelBadgeStyle}>
    <GlossyOverlay />
    <span style={{ position: 'relative', zIndex: 1 }}>Level {level}</span>
  </div>
  <div style={xpContainerStyle}>
    <ProgressBar
      current={xp}
      max={xpToNextLevel}
      color="#9c27b0"
      height={14}
      showLabel={false}
    />
  </div>
</div>
```

**Step 4: Test FarmView v browseru**

Navigate: http://localhost:5173/ → Farm
Expected: Polished farm view s glossy UI elements, smooth shadows

**Step 5: Commit upgraded FarmView**

```bash
git add src/components/farm/FarmView.tsx
git commit -m "feat: upgrade FarmView with Township-style polished UI design"
```

---

## Task 8: Add Visual Polish to Minigame Components

**Files:**
- Modify: `src/components/screens/MinigameSelector.tsx`
- Modify: `src/components/minigames/shared/MinigameWrapper.tsx`

**Step 1: Upgrade MinigameSelector s card grid layout**

Replace MinigameSelector styling s Township-inspired cards:

```typescript
// Container
const containerStyle: CSSProperties = {
  minHeight: '100vh',
  padding: 'var(--space-6)',
  background: 'linear-gradient(180deg, var(--color-sky-start) 0%, var(--color-grass-end) 100%)',
};

// Header
const headerStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: 'var(--space-8)',
};

const titleStyle: CSSProperties = {
  fontSize: 'var(--text-4xl)',
  fontWeight: 'var(--font-extrabold)',
  color: 'white',
  textShadow: '3px 3px 0 rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.3)',
  marginBottom: 'var(--space-4)',
};

// Game cards grid
const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 'var(--space-5)',
  maxWidth: '1200px',
  margin: '0 auto var(--space-8)',
};

// Individual game card - Township style
const cardStyle: CSSProperties = {
  background: 'var(--color-bg-card)',
  borderRadius: 'var(--radius-2xl)',
  padding: 'var(--space-6)',
  boxShadow: 'var(--shadow-xl)',
  cursor: 'pointer',
  transition: 'all var(--transition-base)',
  position: 'relative',
  overflow: 'hidden',
  border: '3px solid white',
};

const cardIconStyle: CSSProperties = {
  fontSize: '64px',
  marginBottom: 'var(--space-3)',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
  animation: 'float 3s ease-in-out infinite',
};

const cardTitleStyle: CSSProperties = {
  fontSize: 'var(--text-xl)',
  fontWeight: 'var(--font-bold)',
  color: 'var(--color-text-primary)',
  marginBottom: 'var(--space-2)',
};

const cardDescStyle: CSSProperties = {
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-secondary)',
  lineHeight: 1.5,
};
```

**Step 2: Add hover interaction pro cards**

```typescript
const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, isEnter: boolean) => {
  if (isEnter) {
    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
    e.currentTarget.style.boxShadow = 'var(--shadow-xl), 0 0 30px rgba(76, 175, 80, 0.3)';
  } else {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
  }
};
```

**Step 3: Upgrade MinigameWrapper s polished scoreboard**

V MinigameWrapper, update scoreboard style:

```typescript
const scoreboardStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
  padding: 'var(--space-4) var(--space-5)',
  borderRadius: 'var(--radius-xl)',
  boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.3)',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'var(--space-4)',
  fontWeight: 'var(--font-bold)',
};
```

**Step 4: Test minigame screens**

Navigate: Minigame selector → Select any game
Expected: Polished card layout, glossy scoreboard

**Step 5: Commit minigame visual upgrades**

```bash
git add src/components/screens/MinigameSelector.tsx src/components/minigames/shared/MinigameWrapper.tsx
git commit -m "feat: upgrade minigame screens with Township-style card layout and polish"
```

---

## Task 9: Add Micro-interactions and Animations

**Files:**
- Create: `src/styles/animations.css`
- Modify: `src/styles/designSystem.css`

**Step 1: Create dedicated animations file**

Create `src/styles/animations.css`:

```css
/* Hover Effects */
.hover-lift {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.hover-scale {
  transition: transform var(--transition-bounce);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow {
  transition: box-shadow var(--transition-base);
}

.hover-glow:hover {
  box-shadow: 0 0 20px currentColor;
}

/* Click Effects */
.click-bounce {
  transition: transform var(--transition-fast);
}

.click-bounce:active {
  transform: scale(0.95);
}

/* Loading Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Entrance Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.4s ease;
}

.fade-in-scale {
  animation: fadeInScale 0.3s ease;
}

.slide-in-right {
  animation: slideInFromRight 0.3s ease;
}

/* Stagger children animation */
.stagger-children > * {
  animation: fadeInUp 0.4s ease backwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0.05s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.15s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(5) { animation-delay: 0.25s; }
.stagger-children > *:nth-child(6) { animation-delay: 0.3s; }

/* Attention Seekers */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.shake {
  animation: shake 0.5s ease;
}

.wiggle {
  animation: wiggle 0.5s ease;
}

/* Coin/Reward Collection Animation */
@keyframes collectCoin {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-30px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(0.5);
  }
}

.collect-animation {
  animation: collectCoin 0.6s ease;
}
```

**Step 2: Import animations do design system**

V `src/styles/designSystem.css`, add na konec:

```css
@import './animations.css';
```

**Step 3: Test animations**

Manual test: Hover over buttons, cards, interact s UI
Expected: Smooth micro-interactions, entrance animations

**Step 4: Commit animations system**

```bash
git add src/styles/animations.css src/styles/designSystem.css
git commit -m "feat: add comprehensive animation system for micro-interactions"
```

---

## Task 10: Final Polish and Performance Check

**Files:**
- Modify: `src/App.css` (cleanup old styles)
- Test: All screens

**Step 1: Clean up old CSS z App.css**

V `src/App.css`, replace with minimal styles (most jsou v components):

```css
/* Global overrides only - components handle their own styles */
.game-container {
  min-height: 100vh;
}

/* Legacy support - can be removed if not used */
.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 100;
  animation: fadeIn var(--transition-base);
}
```

**Step 2: Full application test**

Test flow:
1. Main Menu → check animations, glossy cards
2. Farm View → check header, badges, buttons
3. Minigame Selector → check card grid, hover states
4. Play minigame → check scoreboard, buttons
5. Shop/Achievements → check modals, lists

Expected: Konzistentní Township-style look, smooth interactions

**Step 3: Performance check v DevTools**

```bash
# Run dev server
bun run dev

# Open browser DevTools
# Check:
# - FPS stays 60fps during animations
# - No layout thrashing
# - CSS animations use GPU (transform/opacity)
```

Expected: Smooth 60fps, no jank

**Step 4: Create visual documentation**

Create `docs/DESIGN_SYSTEM.md`:

```markdown
# Design System - Township-Inspired

## Overview
Tento design system implementuje Township-inspired bright & cheerful vizuální styl s moderním Flat Design a depth efekty.

## Key Features
- 🎨 Glossy UI prvky s inset highlights
- 🌈 Bohatá barevná paleta s gradients
- ✨ Smooth micro-interactions
- 📦 Layered shadows pro depth
- 🔄 Physics-based animations

## Usage

### CSS Variables
```css
var(--color-primary)
var(--shadow-lg)
var(--radius-xl)
var(--space-4)
```

### Component Examples
See individual components for implementation patterns.

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Variables required
- Backdrop-filter support recommended
```

**Step 5: Final commit**

```bash
git add src/App.css docs/DESIGN_SYSTEM.md
git commit -m "feat: complete Township-style visual refactor with design documentation"
```

**Step 6: Build and preview**

```bash
bun run build
bun run preview
```

Expected: Production build works, all animations smooth

---

## Summary

**Co jsme implementovali:**

1. ✅ Design System s CSS Variables (colors, shadows, spacing, typography)
2. ✅ Glossy Township-style Button component
3. ✅ Polished MainMenu s floating animations
4. ✅ Upgraded CurrencyDisplay badges
5. ✅ Smooth ProgressBar s glossy fill
6. ✅ Animated Modal component
7. ✅ Polished FarmView screen
8. ✅ Card-based MinigameSelector
9. ✅ Comprehensive animation system
10. ✅ Performance optimization a documentation

**Výsledek:**
Kompletní vizuální refaktor na Township-inspired bright & cheerful styl s:
- Glossy UI prvky
- Layered shadows pro depth
- Smooth micro-interactions
- Konzistentní vizuální jazyk
- 60fps performance

**Tech Stack:**
- Pure CSS/CSS-in-JS
- CSS Variables
- No external dependencies
- Optimized animations
