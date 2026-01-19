import { CSSProperties } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';

interface CurrencyDisplayProps {
  compact?: boolean;
  showAll?: boolean;
}

export function CurrencyDisplay({ compact = false, showAll = true }: CurrencyDisplayProps) {
  const { eggs, feathers, grain } = useCurrencyStore();

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: compact ? '8px' : '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: compact ? '4px 8px' : '8px 12px',
    borderRadius: '20px',
    fontSize: compact ? '14px' : '16px',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const emojiStyle: CSSProperties = {
    fontSize: compact ? '16px' : '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={itemStyle}>
        <span style={emojiStyle}>🥚</span>
        <span>{eggs}</span>
      </div>
      {showAll && (
        <>
          <div style={itemStyle}>
            <span style={emojiStyle}>🪶</span>
            <span>{feathers}</span>
          </div>
          <div style={itemStyle}>
            <span style={emojiStyle}>🌾</span>
            <span>{grain}</span>
          </div>
        </>
      )}
    </div>
  );
}
