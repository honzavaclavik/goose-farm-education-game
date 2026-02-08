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
    background: 'var(--texture-wood)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.15)',
    border: '2px solid var(--color-wood-border)',
  };

  const barFillStyle: CSSProperties = {
    height: '100%',
    width: `${percentage}%`,
    background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
    transition: 'width var(--transition-slow) ease',
    position: 'relative',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
    borderRadius: 'inherit',
  };

  const glossyOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)',
    pointerEvents: 'none',
  };

  const labelStyle: CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-parchment)',
    marginTop: 'var(--space-1)',
    textAlign: 'center',
    fontWeight: 'var(--font-bold)',
    textShadow: 'var(--text-outline-brown)',
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
