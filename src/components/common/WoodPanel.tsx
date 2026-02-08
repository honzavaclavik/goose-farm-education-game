import { CSSProperties, ReactNode } from 'react';

interface WoodPanelProps {
  children: ReactNode;
  variant?: 'light' | 'dark' | 'parchment';
  style?: CSSProperties;
}

const variantStyles: Record<string, CSSProperties> = {
  light: {
    background: 'var(--texture-wood)',
    border: '2px solid var(--color-wood-border)',
    color: 'white',
  },
  dark: {
    background: `
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 18px,
        rgba(0, 0, 0, 0.04) 18px,
        rgba(0, 0, 0, 0.04) 19px
      ),
      radial-gradient(ellipse at 30% 50%, rgba(255, 255, 255, 0.06) 0%, transparent 60%),
      linear-gradient(180deg, var(--color-wood-dark) 0%, #4a3520 100%)
    `,
    border: '2px solid #3a2515',
    color: 'var(--color-parchment)',
  },
  parchment: {
    background: 'var(--texture-parchment)',
    border: 'var(--border-gold-frame)',
    color: 'var(--color-wood-dark)',
  },
};

export function WoodPanel({
  children,
  variant = 'light',
  style,
}: WoodPanelProps) {
  const panelStyle: CSSProperties = {
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
    boxShadow: 'var(--shadow-wood-panel)',
    position: 'relative',
    overflow: 'hidden',
    ...variantStyles[variant],
    ...style,
  };

  const grainOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.01) 3px, rgba(0,0,0,0.01) 4px)',
    pointerEvents: 'none',
    borderRadius: 'inherit',
  };

  return (
    <div style={panelStyle}>
      <div style={grainOverlayStyle} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
