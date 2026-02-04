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
