import { CSSProperties } from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  current,
  max,
  color = '#4CAF50',
  height = 20,
  showLabel = true,
  label,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  const containerStyle: CSSProperties = {
    width: '100%',
    background: '#e0e0e0',
    borderRadius: height / 2,
    overflow: 'hidden',
    position: 'relative',
    height,
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
  };

  const fillStyle: CSSProperties = {
    width: `${percentage}%`,
    height: '100%',
    background: `linear-gradient(90deg, ${color} 0%, ${lightenColor(color, 20)} 100%)`,
    transition: 'width 0.3s ease',
    borderRadius: height / 2,
  };

  const labelStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: height * 0.6,
    fontWeight: 'bold',
    color: percentage > 50 ? 'white' : '#333',
    textShadow: percentage > 50 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
  };

  return (
    <div style={containerStyle}>
      <div style={fillStyle} />
      {showLabel && (
        <div style={labelStyle}>
          {label || `${current}/${max}`}
        </div>
      )}
    </div>
  );
}

function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
