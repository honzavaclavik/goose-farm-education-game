import { CSSProperties } from 'react';
import { Building } from '../../types/farm';

interface FarmBuildingsProps {
  buildings: Building[];
}

function CoopSVG({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 120 100" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#B71C1C" />
        </linearGradient>
        <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="50%" stopColor="#A1887F" />
          <stop offset="100%" stopColor="#8D6E63" />
        </linearGradient>
        <linearGradient id="woodVertical" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A1887F" />
          <stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>
      </defs>

      {/* Main building body */}
      <rect x="15" y="40" width="90" height="55" fill="url(#woodGradient)" />

      {/* Wood planks detail */}
      <line x1="15" y1="55" x2="105" y2="55" stroke="#6D4C41" strokeWidth="1" />
      <line x1="15" y1="70" x2="105" y2="70" stroke="#6D4C41" strokeWidth="1" />
      <line x1="15" y1="85" x2="105" y2="85" stroke="#6D4C41" strokeWidth="1" />

      {/* Roof */}
      <polygon points="60,5 10,45 110,45" fill="url(#roofGradient)" />
      <polygon points="60,5 10,45 110,45" fill="none" stroke="#8B0000" strokeWidth="2" />

      {/* Roof lines */}
      <line x1="35" y1="25" x2="15" y2="43" stroke="#EF5350" strokeWidth="2" />
      <line x1="60" y1="10" x2="60" y2="45" stroke="#EF5350" strokeWidth="2" />
      <line x1="85" y1="25" x2="105" y2="43" stroke="#EF5350" strokeWidth="2" />

      {/* Door */}
      <rect x="45" y="60" width="30" height="35" fill="#5D4037" rx="2" />
      <rect x="47" y="62" width="26" height="31" fill="#4E342E" rx="1" />
      <circle cx="68" cy="78" r="3" fill="#FFD54F" />

      {/* Window */}
      <rect x="22" y="50" width="18" height="18" fill="#BBDEFB" rx="2" stroke="#5D4037" strokeWidth="2" />
      <line x1="31" y1="50" x2="31" y2="68" stroke="#5D4037" strokeWidth="2" />
      <line x1="22" y1="59" x2="40" y2="59" stroke="#5D4037" strokeWidth="2" />

      {/* Window right */}
      <rect x="80" y="50" width="18" height="18" fill="#BBDEFB" rx="2" stroke="#5D4037" strokeWidth="2" />
      <line x1="89" y1="50" x2="89" y2="68" stroke="#5D4037" strokeWidth="2" />
      <line x1="80" y1="59" x2="98" y2="59" stroke="#5D4037" strokeWidth="2" />

      {/* Chicken door */}
      <rect x="85" y="80" width="15" height="15" fill="#3E2723" rx="3" />

      {/* Level stars */}
      {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
        <text
          key={i}
          x={25 + i * 15}
          y="18"
          fontSize="10"
          fill="#FFD700"
          style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' }}
        >
          ★
        </text>
      ))}
    </svg>
  );
}

function FieldSVG({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 120 100" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="dirtFieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="100%" stopColor="#5D4037" />
        </linearGradient>
      </defs>

      {/* Field base */}
      <rect x="10" y="50" width="100" height="45" fill="url(#dirtFieldGradient)" rx="5" />

      {/* Soil rows */}
      {[55, 65, 75, 85].map((y, i) => (
        <ellipse key={i} cx="60" cy={y} rx="45" ry="3" fill="#4E342E" />
      ))}

      {/* Wheat stalks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 20 + i * 12;
        return (
          <g key={i}>
            {/* Stalk */}
            <line x1={x} y1="50" x2={x} y2="20" stroke="#8BC34A" strokeWidth="2">
              <animate
                attributeName="x2"
                values={`${x};${x + 2};${x};${x - 2};${x}`}
                dur="3s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            </line>
            {/* Wheat head */}
            <ellipse cx={x} cy="18" rx="4" ry="8" fill="#FFD54F">
              <animate
                attributeName="cx"
                values={`${x};${x + 2};${x};${x - 2};${x}`}
                dur="3s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx={x} cy="14" rx="3" ry="6" fill="#FFEB3B">
              <animate
                attributeName="cx"
                values={`${x};${x + 2};${x};${x - 2};${x}`}
                dur="3s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            </ellipse>
            {/* Wheat grains */}
            {[-3, 0, 3].map((offset, j) => (
              <ellipse
                key={j}
                cx={x + offset}
                cy={16 + j * 3}
                rx="2"
                ry="3"
                fill="#FFC107"
                transform={`rotate(${offset * 10} ${x + offset} ${16 + j * 3})`}
              >
                <animate
                  attributeName="cx"
                  values={`${x + offset};${x + offset + 2};${x + offset};${x + offset - 2};${x + offset}`}
                  dur="3s"
                  begin={`${i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </ellipse>
            ))}
          </g>
        );
      })}

      {/* Fence around field */}
      <rect x="5" y="48" width="3" height="50" fill="#8D6E63" />
      <rect x="112" y="48" width="3" height="50" fill="#8D6E63" />
      <rect x="5" y="55" width="110" height="3" fill="#A1887F" />
      <rect x="5" y="70" width="110" height="3" fill="#A1887F" />

      {/* Level indicator */}
      {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
        <text
          key={i}
          x={35 + i * 12}
          y="8"
          fontSize="10"
          fill="#FFD700"
          style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' }}
        >
          ★
        </text>
      ))}
    </svg>
  );
}

function MillSVG({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 120 100" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="millBodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#BCAAA4" />
          <stop offset="50%" stopColor="#D7CCC8" />
          <stop offset="100%" stopColor="#BCAAA4" />
        </linearGradient>
      </defs>

      {/* Mill body - tower */}
      <path
        d="M40 95 L45 35 L75 35 L80 95 Z"
        fill="url(#millBodyGradient)"
        stroke="#8D6E63"
        strokeWidth="2"
      />

      {/* Stone texture */}
      {[45, 55, 65, 75, 85].map((y, i) => (
        <g key={i}>
          <ellipse cx={52 + (i % 2) * 8} cy={y} rx="8" ry="4" fill="none" stroke="#9E9E9E" strokeWidth="1" />
          <ellipse cx={68 - (i % 2) * 8} cy={y} rx="8" ry="4" fill="none" stroke="#9E9E9E" strokeWidth="1" />
        </g>
      ))}

      {/* Roof */}
      <polygon points="60,10 35,38 85,38" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2" />

      {/* Windmill blades */}
      <g style={{ transformOrigin: '60px 38px' }}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 60 38"
          to="360 60 38"
          dur="4s"
          repeatCount="indefinite"
        />
        {/* Blade 1 */}
        <path d="M60 38 L60 8 L70 15 L60 38" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
        {/* Blade 2 */}
        <path d="M60 38 L90 38 L83 48 L60 38" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
        {/* Blade 3 */}
        <path d="M60 38 L60 68 L50 61 L60 38" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
        {/* Blade 4 */}
        <path d="M60 38 L30 38 L37 28 L60 38" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
        {/* Center */}
        <circle cx="60" cy="38" r="5" fill="#5D4037" />
      </g>

      {/* Door */}
      <rect x="52" y="75" width="16" height="20" fill="#5D4037" rx="8" />
      <rect x="54" y="77" width="12" height="16" fill="#3E2723" rx="6" />

      {/* Window */}
      <circle cx="60" cy="55" r="6" fill="#BBDEFB" stroke="#5D4037" strokeWidth="2" />
      <line x1="60" y1="49" x2="60" y2="61" stroke="#5D4037" strokeWidth="1" />
      <line x1="54" y1="55" x2="66" y2="55" stroke="#5D4037" strokeWidth="1" />

      {/* Level stars */}
      {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
        <text
          key={i}
          x={35 + i * 12}
          y="8"
          fontSize="10"
          fill="#FFD700"
          style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' }}
        >
          ★
        </text>
      ))}
    </svg>
  );
}

function MarketSVG({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 120 100" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="awningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E53935" />
          <stop offset="100%" stopColor="#C62828" />
        </linearGradient>
        <linearGradient id="awningStripe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EEEEEE" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
      </defs>

      {/* Market stall base */}
      <rect x="10" y="50" width="100" height="45" fill="#8D6E63" />
      <rect x="12" y="52" width="96" height="41" fill="#A1887F" />

      {/* Counter */}
      <rect x="10" y="50" width="100" height="10" fill="#6D4C41" />

      {/* Awning supports */}
      <rect x="15" y="25" width="4" height="70" fill="#5D4037" />
      <rect x="101" y="25" width="4" height="70" fill="#5D4037" />

      {/* Awning */}
      <path d="M10 25 L60 15 L110 25 L110 35 L10 35 Z" fill="url(#awningGradient)" />

      {/* Awning stripes */}
      {[20, 40, 60, 80, 100].map((x, i) => (
        <path
          key={i}
          d={`M${x - 5} 25 L${x} ${i % 2 === 0 ? 18 : 22} L${x + 5} 25 L${x + 5} 35 L${x - 5} 35 Z`}
          fill={i % 2 === 0 ? 'url(#awningStripe)' : 'url(#awningGradient)'}
        />
      ))}

      {/* Scalloped edge */}
      <path
        d="M10 35 Q17 42 24 35 Q31 42 38 35 Q45 42 52 35 Q59 42 66 35 Q73 42 80 35 Q87 42 94 35 Q101 42 110 35"
        fill="none"
        stroke="#C62828"
        strokeWidth="3"
      />

      {/* Products on display */}
      {/* Eggs */}
      <ellipse cx="30" cy="58" rx="8" ry="6" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1" />
      <ellipse cx="40" cy="56" rx="7" ry="5" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1" />
      <ellipse cx="35" cy="54" rx="6" ry="4" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1" />

      {/* Bread */}
      <ellipse cx="65" cy="56" rx="10" ry="6" fill="#D7A86E" />
      <ellipse cx="75" cy="58" rx="8" ry="5" fill="#C49A6C" />

      {/* Feathers */}
      <path d="M90 48 Q95 52 90 60 Q93 56 95 52 Q92 50 90 48" fill="#90CAF9" />
      <path d="M95 50 Q100 54 95 62 Q98 58 100 54 Q97 52 95 50" fill="#81D4FA" />

      {/* Shelves behind */}
      <line x1="15" y1="70" x2="105" y2="70" stroke="#5D4037" strokeWidth="3" />
      <line x1="15" y1="85" x2="105" y2="85" stroke="#5D4037" strokeWidth="3" />

      {/* Items on shelves */}
      <rect x="20" y="73" width="15" height="12" fill="#FFC107" rx="2" />
      <rect x="40" y="75" width="12" height="10" fill="#4CAF50" rx="2" />
      <circle cx="70" cy="80" r="5" fill="#E91E63" />
      <rect x="85" y="74" width="10" height="11" fill="#2196F3" rx="1" />

      {/* Level stars */}
      {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
        <text
          key={i}
          x={35 + i * 12}
          y="10"
          fontSize="10"
          fill="#FFD700"
          style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))' }}
        >
          ★
        </text>
      ))}
    </svg>
  );
}

export function FarmBuildings({ buildings }: FarmBuildingsProps) {
  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '10px',
  };

  const buildingContainerStyle: CSSProperties = {
    width: '120px',
    height: '120px',
    position: 'relative',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))',
  };

  const labelStyle: CSSProperties = {
    position: 'absolute',
    bottom: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '10px',
    fontSize: '11px',
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
  };

  const effectStyle: CSSProperties = {
    position: 'absolute',
    bottom: '-42px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#90EE90',
    fontSize: '10px',
    whiteSpace: 'nowrap',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  };

  const getBuildingComponent = (building: Building) => {
    switch (building.type) {
      case 'coop':
        return <CoopSVG level={building.level} />;
      case 'field':
        return <FieldSVG level={building.level} />;
      case 'mill':
        return <MillSVG level={building.level} />;
      case 'market':
        return <MarketSVG level={building.level} />;
      default:
        return <CoopSVG level={building.level} />;
    }
  };

  const getBuildingEffect = (building: Building): string | null => {
    switch (building.type) {
      case 'field':
        return `+${building.effect} 🌾/min`;
      case 'coop':
        return `+${building.effect} 🪿 kapacita`;
      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      {buildings.map((building) => (
        <div
          key={building.id}
          style={buildingContainerStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
          }}
        >
          {getBuildingComponent(building)}
          <div style={labelStyle}>{building.name}</div>
          {getBuildingEffect(building) && (
            <div style={effectStyle}>{getBuildingEffect(building)}</div>
          )}
        </div>
      ))}
    </div>
  );
}
