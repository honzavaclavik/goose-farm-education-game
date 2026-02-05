import { CSSProperties } from 'react';
import { Building } from '../../types/farm';

interface FarmBuildingsProps {
  buildings: Building[];
}

function CoopSVG({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 160 140" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="coop-wall-front" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="50%" stopColor="#C9956A" />
          <stop offset="100%" stopColor="#B8845A" />
        </linearGradient>
        <linearGradient id="coop-wall-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8845A" />
          <stop offset="100%" stopColor="#A07040" />
        </linearGradient>
        <linearGradient id="coop-roof-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C62828" />
          <stop offset="100%" stopColor="#8B1A1A" />
        </linearGradient>
        <linearGradient id="coop-roof-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A02020" />
          <stop offset="100%" stopColor="#701515" />
        </linearGradient>
      </defs>

      {/* Front wall */}
      <polygon points="25,75 95,75 95,115 25,115" fill="url(#coop-wall-front)" />
      {[82, 89, 96, 103, 110].map((y, i) => (
        <line key={i} x1="25" y1={y} x2="95" y2={y} stroke="#A07040" strokeWidth="0.5" opacity="0.4" />
      ))}

      {/* Side wall */}
      <polygon points="95,75 135,55 135,95 95,115" fill="url(#coop-wall-side)" />
      {[62, 69, 76, 83, 90].map((y, i) => (
        <line key={i} x1="95" y1={y + 13} x2="135" y2={y} stroke="#8B6030" strokeWidth="0.5" opacity="0.4" />
      ))}

      {/* Roof front */}
      <polygon points="15,75 60,40 100,75" fill="url(#coop-roof-front)" />
      {[0, 1, 2, 3].map((i) => {
        const y = 48 + i * 8;
        const leftX = 15 + (75 - y) * 0.56 + i * 2;
        const rightX = 100 - (75 - y) * 0.56 - i * 2;
        return <line key={i} x1={leftX} y1={y} x2={rightX} y2={y} stroke="#7B1010" strokeWidth="0.8" opacity="0.5" />;
      })}

      {/* Roof side */}
      <polygon points="100,75 60,40 100,20 140,55" fill="url(#coop-roof-side)" />
      <line x1="60" y1="40" x2="100" y2="20" stroke="#901818" strokeWidth="2" />

      {/* Main door */}
      <rect x="42" y="92" width="22" height="23" fill="#5D3A1A" rx="2" />
      <rect x="44" y="94" width="18" height="19" fill="#4A2E14" rx="1" />
      <line x1="53" y1="94" x2="53" y2="113" stroke="#5D3A1A" strokeWidth="1" />
      <line x1="44" y1="103" x2="62" y2="103" stroke="#5D3A1A" strokeWidth="1" />
      <circle cx="58" cy="104" r="1.5" fill="#FFD54F" />

      {/* Window left */}
      <rect x="30" y="82" width="10" height="8" fill="#87CEEB" rx="1" stroke="#5D3A1A" strokeWidth="1.5" />
      <line x1="35" y1="82" x2="35" y2="90" stroke="#5D3A1A" strokeWidth="1" />
      <line x1="30" y1="86" x2="40" y2="86" stroke="#5D3A1A" strokeWidth="1" />
      <rect x="29" y="90" width="12" height="3" fill="#8B6030" rx="0.5" />
      <circle cx="32" cy="89" r="2" fill="#FF6B9D" />
      <circle cx="38" cy="89" r="2" fill="#FFD93D" />

      {/* Window right */}
      <rect x="68" y="82" width="10" height="8" fill="#87CEEB" rx="1" stroke="#5D3A1A" strokeWidth="1.5" />
      <line x1="73" y1="82" x2="73" y2="90" stroke="#5D3A1A" strokeWidth="1" />
      <line x1="68" y1="86" x2="78" y2="86" stroke="#5D3A1A" strokeWidth="1" />
      <rect x="67" y="90" width="12" height="3" fill="#8B6030" rx="0.5" />
      <circle cx="70" cy="89" r="2" fill="#C77DFF" />
      <circle cx="76" cy="89" r="2" fill="#FF6B9D" />

      {/* Chicken door on side */}
      <rect x="100" y="88" width="12" height="10" fill="#3E2723" rx="2" />
      <rect x="101" y="89" width="10" height="8" fill="#2E1B0E" rx="1" />
      <polygon points="100,98 112,98 118,102 106,102" fill="#A07040" />

      {/* Hay bale */}
      <ellipse cx="140" cy="100" rx="10" ry="7" fill="#E8C56D" />
      <ellipse cx="140" cy="98" rx="10" ry="5" fill="#F0D078" />
      {[133, 137, 143, 147].map((x, i) => (
        <line key={i} x1={x} y1={i % 2 === 0 ? 98 : 97} x2={x} y2={i % 2 === 0 ? 102 : 103} stroke="#C8A040" strokeWidth="0.5" />
      ))}

      {/* Level stars */}
      {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
        <text key={i} x={38 + i * 14} y="36" fontSize="12" fill="#FFD700"
          style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}>&#9733;</text>
      ))}

      {/* Chimney smoke */}
      <g opacity="0.3">
        <circle cx="90" cy="25" r="4" fill="#ccc">
          <animate attributeName="cy" values="25;15;5" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.2;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;6;8" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="92" cy="30" r="3" fill="#ccc">
          <animate attributeName="cy" values="30;20;10" dur="4s" begin="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.2;0" dur="4s" begin="1.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="3;5;7" dur="4s" begin="1.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

function FieldSVG({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 160 140" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="field-soil" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>
        <linearGradient id="field-soil-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5D3C31" />
          <stop offset="100%" stopColor="#3E2420" />
        </linearGradient>
      </defs>

      {/* Isometric field top */}
      <polygon points="80,50 140,80 80,110 20,80" fill="url(#field-soil)" />
      <polygon points="20,80 80,110 80,118 20,88" fill="url(#field-soil-side)" />
      <polygon points="140,80 80,110 80,118 140,88" fill="#3E2420" />

      {/* Wheat stalks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const x = 45 + col * 22 + row * 5;
        const y = 58 + row * 14;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y - 22} stroke="#7CB342" strokeWidth="1.5">
              <animate attributeName="x2" values={`${x};${x + 2};${x};${x - 2};${x}`} dur="3s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </line>
            <ellipse cx={x} cy={y - 24} rx="3" ry="6" fill="#FFD54F">
              <animate attributeName="cx" values={`${x};${x + 2};${x};${x - 2};${x}`} dur="3s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={x} cy={y - 28} rx="2.5" ry="4" fill="#FFEB3B">
              <animate attributeName="cx" values={`${x};${x + 2};${x};${x - 2};${x}`} dur="3s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </ellipse>
            {[-2, 0, 2].map((offset, j) => (
              <ellipse key={j} cx={x + offset} cy={y - 22 + j * 2} rx="1.5" ry="2.5" fill="#FFC107"
                transform={`rotate(${offset * 8} ${x + offset} ${y - 22 + j * 2})`}>
                <animate attributeName="cx" values={`${x + offset};${x + offset + 2};${x + offset};${x + offset - 2};${x + offset}`} dur="3s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
              </ellipse>
            ))}
          </g>
        );
      })}

      {/* Fence left */}
      {[0, 1, 2].map((i) => (
        <g key={`fl-${i}`}>
          <rect x={25 + i * 20} y={63 - i * 3} width="3" height="18" fill="#8D6E63" />
          <rect x={24 + i * 20} y={62 - i * 3} width="5" height="3" fill="#A1887F" rx="1" />
        </g>
      ))}
      <line x1="25" y1="68" x2="65" y2="59" stroke="#A1887F" strokeWidth="2.5" />
      <line x1="25" y1="75" x2="65" y2="66" stroke="#A1887F" strokeWidth="2.5" />

      {/* Fence right */}
      {[0, 1, 2].map((i) => (
        <g key={`fr-${i}`}>
          <rect x={95 + i * 20} y={57 + i * 3} width="3" height="18" fill="#8D6E63" />
          <rect x={94 + i * 20} y={56 + i * 3} width="5" height="3" fill="#A1887F" rx="1" />
        </g>
      ))}
      <line x1="95" y1="62" x2="135" y2="71" stroke="#A1887F" strokeWidth="2.5" />
      <line x1="95" y1="69" x2="135" y2="78" stroke="#A1887F" strokeWidth="2.5" />

      {/* Water trough */}
      <rect x="18" y="88" width="16" height="6" fill="#6D4C41" rx="1" />
      <rect x="19" y="87" width="14" height="5" fill="#42A5F5" rx="1" opacity="0.7" />

      {/* Level stars */}
      {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
        <text key={i} x={48 + i * 14} y="30" fontSize="12" fill="#FFD700"
          style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}>&#9733;</text>
      ))}
    </svg>
  );
}

function MillSVG({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 160 140" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="mill-stone" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D7CCC8" />
          <stop offset="50%" stopColor="#EFEBE9" />
          <stop offset="100%" stopColor="#BCAAA4" />
        </linearGradient>
        <linearGradient id="mill-stone-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#BCAAA4" />
          <stop offset="100%" stopColor="#A1887F" />
        </linearGradient>
        <linearGradient id="mill-blade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>
        <linearGradient id="mill-canvas" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5F0E8" />
          <stop offset="100%" stopColor="#E8DDD0" />
        </linearGradient>
      </defs>

      {/* Tower front */}
      <path d="M48,45 L42,120 L98,120 L92,45 Z" fill="url(#mill-stone)" />
      <path d="M92,45 L110,35 L106,110 L98,120 Z" fill="url(#mill-stone-side)" />

      {/* Stonework front */}
      {[55, 65, 75, 85, 95, 105].map((y, i) => (
        <g key={i} opacity="0.3">
          <ellipse cx={55 + (i % 2) * 10} cy={y} rx="10" ry="4" fill="none" stroke="#9E9E9E" strokeWidth="0.7" />
          <ellipse cx={75 + (i % 2) * 5} cy={y} rx="10" ry="4" fill="none" stroke="#9E9E9E" strokeWidth="0.7" />
        </g>
      ))}

      {/* Stonework side */}
      {[50, 60, 70, 80, 90, 100].map((y, i) => (
        <ellipse key={i} cx={100 + (i % 2) * 3} cy={y} rx="6" ry="3" fill="none" stroke="#9E9E9E" strokeWidth="0.5" opacity="0.3" />
      ))}

      {/* Roof */}
      <polygon points="70,20 45,48 70,42 95,48" fill="#C62828" />
      <polygon points="70,20 95,48 112,38 85,12" fill="#A02020" />
      <line x1="70" y1="20" x2="85" y2="12" stroke="#D32F2F" strokeWidth="1.5" />

      {/* Blades */}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 80 40" to="360 80 40" dur="6s" repeatCount="indefinite" />
        <rect x="77" y="5" width="6" height="30" fill="url(#mill-blade)" rx="1" />
        <polygon points="83,8 95,12 95,30 83,32" fill="url(#mill-canvas)" opacity="0.8" />
        <rect x="85" y="37" width="30" height="6" fill="url(#mill-blade)" rx="1" />
        <polygon points="88,37 92,25 110,25 112,37" fill="url(#mill-canvas)" opacity="0.8" transform="rotate(90 97 37)" />
        <rect x="77" y="45" width="6" height="30" fill="url(#mill-blade)" rx="1" />
        <polygon points="77,48 65,52 65,70 77,72" fill="url(#mill-canvas)" opacity="0.8" />
        <rect x="45" y="37" width="30" height="6" fill="url(#mill-blade)" rx="1" />
        <polygon points="48,43 52,55 70,55 72,43" fill="url(#mill-canvas)" opacity="0.8" transform="rotate(90 60 43)" />
        <circle cx="80" cy="40" r="5" fill="#5D4037" />
        <circle cx="80" cy="40" r="3" fill="#4E342E" />
        <circle cx="80" cy="40" r="1.5" fill="#8D6E63" />
      </g>

      {/* Door */}
      <path d="M60,120 L60,98 Q70,88 80,98 L80,120 Z" fill="#4E342E" />
      <path d="M62,120 L62,100 Q70,91 78,100 L78,120 Z" fill="#3E2723" />
      <circle cx="74" cy="108" r="1.5" fill="#FFD54F" />

      {/* Window */}
      <circle cx="70" cy="72" r="7" fill="#87CEEB" stroke="#5D4037" strokeWidth="2" />
      <line x1="70" y1="65" x2="70" y2="79" stroke="#5D4037" strokeWidth="1" />
      <line x1="63" y1="72" x2="77" y2="72" stroke="#5D4037" strokeWidth="1" />

      {/* Ground */}
      <ellipse cx="75" cy="122" rx="40" ry="6" fill="#8D6E63" opacity="0.3" />

      {/* Grain sacks */}
      <ellipse cx="38" cy="118" rx="6" ry="8" fill="#D7A86E" />
      <ellipse cx="38" cy="114" rx="4" ry="3" fill="#C49A5E" />
      <ellipse cx="30" cy="120" rx="5" ry="7" fill="#C49A5E" />

      {/* Level stars */}
      {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
        <text key={i} x={48 + i * 14} y="10" fontSize="12" fill="#FFD700"
          style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}>&#9733;</text>
      ))}
    </svg>
  );
}

function MarketSVG({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 160 140" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="market-awning-red" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EF5350" />
          <stop offset="100%" stopColor="#C62828" />
        </linearGradient>
        <linearGradient id="market-awning-white" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
      </defs>

      {/* Back wall */}
      <polygon points="25,50 120,50 120,110 25,110" fill="#A1887F" />
      <polygon points="120,50 145,38 145,98 120,110" fill="#8D6E63" />
      {[60, 70, 80, 90, 100].map((y, i) => (
        <line key={i} x1="25" y1={y} x2="120" y2={y} stroke="#795548" strokeWidth="0.5" opacity="0.4" />
      ))}

      {/* Counter */}
      <polygon points="20,85 125,85 125,98 20,98" fill="#6D4C41" />
      <polygon points="125,85 148,73 148,86 125,98" fill="#5D3A1A" />
      <polygon points="20,85 125,85 148,73 43,73" fill="#8D6E63" />

      {/* Awning supports */}
      <rect x="23" y="38" width="4" height="60" fill="#5D4037" />
      <rect x="118" y="38" width="4" height="60" fill="#5D4037" />

      {/* Striped awning */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 18 + i * 18;
        return (
          <polygon key={i}
            points={`${x},38 ${x + 18},38 ${x + 18},52 ${x},52`}
            fill={i % 2 === 0 ? 'url(#market-awning-red)' : 'url(#market-awning-white)'}
          />
        );
      })}
      <polygon points="125,38 148,26 148,40 125,52" fill="#C62828" opacity="0.8" />

      {/* Scalloped edge */}
      <path d="M18 52 Q25 58 32 52 Q39 58 46 52 Q53 58 60 52 Q67 58 74 52 Q81 58 88 52 Q95 58 102 52 Q109 58 116 52 Q123 58 126 52"
        fill="none" stroke="#C62828" strokeWidth="2.5" />

      {/* Products - eggs */}
      <ellipse cx="45" cy="80" rx="10" ry="5" fill="#D7A86E" />
      <ellipse cx="42" cy="78" rx="3" ry="4" fill="#FFF8E1" />
      <ellipse cx="48" cy="78" rx="3" ry="4" fill="#FFF8E1" />
      <ellipse cx="45" cy="76" rx="3" ry="3" fill="#FFF8E1" />

      {/* Products - bread */}
      <ellipse cx="75" cy="79" rx="8" ry="4" fill="#D7A86E" />
      <ellipse cx="75" cy="77" rx="7" ry="3" fill="#E8B960" />
      <ellipse cx="85" cy="80" rx="6" ry="3" fill="#C49A5E" />

      {/* Products - feathers */}
      <path d="M105 72 Q110 68 108 78 Q106 74 105 72" fill="#90CAF9" />
      <path d="M110 73 Q115 69 113 79 Q111 75 110 73" fill="#81D4FA" />
      <path d="M115 71 Q120 67 118 77 Q116 73 115 71" fill="#64B5F6" />

      {/* Shelf */}
      <line x1="30" y1="65" x2="115" y2="65" stroke="#5D4037" strokeWidth="3" />
      <rect x="35" y="55" width="10" height="10" fill="#FFC107" rx="1" />
      <rect x="50" y="57" width="8" height="8" fill="#4CAF50" rx="1" />
      <circle cx="70" cy="61" r="4" fill="#E91E63" />
      <rect x="80" y="56" width="8" height="9" fill="#2196F3" rx="1" />
      <circle cx="100" cy="61" r="3.5" fill="#FF9800" />

      {/* Barrel */}
      <ellipse cx="10" cy="105" rx="8" ry="5" fill="#8D6E63" />
      <rect x="2" y="95" width="16" height="10" fill="#6D4C41" />
      <ellipse cx="10" cy="95" rx="8" ry="4" fill="#8D6E63" />
      <line x1="2" y1="98" x2="18" y2="98" stroke="#5D4037" strokeWidth="1.5" />
      <line x1="2" y1="102" x2="18" y2="102" stroke="#5D4037" strokeWidth="1.5" />

      {/* Crate */}
      <rect x="135" y="95" width="15" height="12" fill="#A1887F" />
      <rect x="135" y="93" width="15" height="3" fill="#8D6E63" />
      <line x1="140" y1="95" x2="140" y2="107" stroke="#6D4C41" strokeWidth="0.5" />
      <line x1="145" y1="95" x2="145" y2="107" stroke="#6D4C41" strokeWidth="0.5" />

      {/* Sign */}
      <rect x="55" y="54" width="30" height="14" fill="#FFF8E1" rx="2" stroke="#8D6E63" strokeWidth="1" />
      <text x="70" y="64" fontSize="7" fill="#5D4037" textAnchor="middle" fontWeight="bold">TRH</text>

      {/* Level stars */}
      {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
        <text key={i} x={48 + i * 14} y="22" fontSize="12" fill="#FFD700"
          style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}>&#9733;</text>
      ))}
    </svg>
  );
}

export function FarmBuildings({ buildings }: FarmBuildingsProps) {
  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-5)',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 'var(--space-4)',
  };

  const buildingContainerStyle: CSSProperties = {
    width: '140px',
    height: '130px',
    position: 'relative',
    transition: 'all var(--transition-base)',
    cursor: 'pointer',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
  };

  const labelStyle: CSSProperties = {
    position: 'absolute',
    bottom: '-28px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--color-bg-card)',
    color: 'var(--color-text-primary)',
    padding: 'var(--space-1) var(--space-3)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)',
    whiteSpace: 'nowrap',
    fontWeight: 'var(--font-bold)',
    boxShadow: 'var(--shadow-md)',
    border: '2px solid rgba(255, 255, 255, 0.8)',
  };

  const effectStyle: CSSProperties = {
    position: 'absolute',
    bottom: '-48px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(76, 175, 80, 0.95)',
    color: 'white',
    fontSize: 'var(--text-xs)',
    whiteSpace: 'nowrap',
    fontWeight: 'var(--font-bold)',
    padding: 'var(--space-1) var(--space-3)',
    borderRadius: 'var(--radius-full)',
    boxShadow: 'var(--shadow-md), 0 0 10px rgba(76,175,80,0.4)',
    border: '2px solid rgba(255, 255, 255, 0.6)',
  };

  const getBuildingComponent = (building: Building) => {
    switch (building.type) {
      case 'coop': return <CoopSVG level={building.level} />;
      case 'field': return <FieldSVG level={building.level} />;
      case 'mill': return <MillSVG level={building.level} />;
      case 'market': return <MarketSVG level={building.level} />;
      default: return <CoopSVG level={building.level} />;
    }
  };

  const getBuildingEffect = (building: Building): string | null => {
    switch (building.type) {
      case 'field': return `+${building.effect} 🌾/min`;
      case 'coop': return `+${building.effect} 🪿 kapacita`;
      default: return null;
    }
  };

  return (
    <div style={containerStyle}>
      {buildings.map((building) => (
        <div
          key={building.id}
          style={buildingContainerStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px) scale(1.05)';
            (e.currentTarget as HTMLDivElement).style.filter = 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLDivElement).style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))';
          }}
        >
          {getBuildingComponent(building)}
          {building.level >= 3 && (
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              fontSize: '20px',
              animation: 'pulse 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))',
            }}>
              &#10024;
            </div>
          )}
          <div style={labelStyle}>{building.name}</div>
          {getBuildingEffect(building) && (
            <div style={effectStyle}>{getBuildingEffect(building)}</div>
          )}
        </div>
      ))}
    </div>
  );
}
