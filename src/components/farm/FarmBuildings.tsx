import { CSSProperties } from 'react';
import { Building } from '../../types/farm';

interface FarmBuildingsProps {
  buildings: Building[];
}

function CoopSVG({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 160 140" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="coop-wood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9956A" />
          <stop offset="50%" stopColor="#D4A574" />
          <stop offset="100%" stopColor="#B8845A" />
        </linearGradient>
        <linearGradient id="coop-wood-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A07040" />
          <stop offset="100%" stopColor="#8B6030" />
        </linearGradient>
        <linearGradient id="coop-roof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>
        <linearGradient id="coop-roof-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7B5B3A" />
          <stop offset="100%" stopColor="#5D4037" />
        </linearGradient>
        <linearGradient id="coop-straw" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0D078" />
          <stop offset="100%" stopColor="#D4A840" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="75" cy="125" rx="55" ry="8" fill="rgba(0,0,0,0.1)" />

      {/* Raised platform / legs - coop is elevated off ground */}
      <rect x="22" y="105" width="5" height="18" fill="#6D4C41" />
      <rect x="87" y="105" width="5" height="18" fill="#6D4C41" />
      <rect x="100" y="92" width="4" height="18" fill="#5D4037" />
      <rect x="130" y="82" width="4" height="18" fill="#5D4037" />

      {/* Main body - low, wide, rectangular (front face) */}
      <polygon points="15,80 95,80 95,108 15,108" fill="url(#coop-wood)" />
      {/* Horizontal plank lines */}
      {[86, 92, 98, 104].map((y, i) => (
        <line key={i} x1="15" y1={y} x2="95" y2={y} stroke="#A07040" strokeWidth="0.7" opacity="0.5" />
      ))}
      {/* Vertical plank joints */}
      {[35, 55, 75].map((x, i) => (
        <line key={`v${i}`} x1={x} y1="80" x2={x} y2="108" stroke="#A07040" strokeWidth="0.3" opacity="0.3" />
      ))}

      {/* Side face (isometric right) */}
      <polygon points="95,80 140,62 140,90 95,108" fill="url(#coop-wood-side)" />
      {[68, 74, 80, 86].map((y, i) => (
        <line key={i} x1="95" y1={y + 12} x2="140" y2={y} stroke="#7B5B3A" strokeWidth="0.5" opacity="0.4" />
      ))}

      {/* Sloped roof - single slope (lean-to style, tilting back) */}
      {/* Front overhang */}
      <polygon points="10,80 100,80 100,72 10,72" fill="url(#coop-roof)" />
      {/* Main roof surface (sloped back) */}
      <polygon points="10,72 100,72 145,54 55,54" fill="url(#coop-roof)" />
      {/* Roof side face */}
      <polygon points="100,72 145,54 145,62 100,80" fill="url(#coop-roof-side)" />
      {/* Roof edge highlight */}
      <line x1="10" y1="72" x2="55" y2="54" stroke="#A1887F" strokeWidth="1" opacity="0.5" />
      <line x1="10" y1="72" x2="100" y2="72" stroke="#A1887F" strokeWidth="1" opacity="0.4" />

      {/* Wire mesh / ventilation on front (chicken wire pattern) */}
      <rect x="20" y="82" width="24" height="14" fill="#4A3520" rx="1" />
      <rect x="21" y="83" width="22" height="12" fill="#2E1B0E" rx="1" opacity="0.6" />
      {/* Wire mesh lines */}
      {[0, 1, 2, 3].map((i) => (
        <line key={`wh${i}`} x1="21" y1={84 + i * 3} x2="43" y2={84 + i * 3} stroke="#9E9E9E" strokeWidth="0.4" opacity="0.5" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`wv${i}`} x1={23 + i * 5} y1="83" x2={23 + i * 5} y2="95" stroke="#9E9E9E" strokeWidth="0.4" opacity="0.5" />
      ))}

      {/* Small poultry door (pop hole) */}
      <rect x="55" y="96" width="14" height="12" fill="#4A2E14" rx="1" />
      <rect x="56" y="97" width="12" height="10" fill="#3E2420" rx="1" />

      {/* Ramp from pop hole */}
      <polygon points="55,108 69,108 78,122 45,122" fill="#A07040" />
      <line x1="50" y1="117" x2="74" y2="117" stroke="#8B6030" strokeWidth="0.5" opacity="0.4" />
      <line x1="52" y1="112" x2="72" y2="112" stroke="#8B6030" strokeWidth="0.5" opacity="0.4" />
      {/* Ramp cleats (grip strips) */}
      {[0, 1, 2, 3].map((i) => (
        <line key={`rc${i}`} x1={50 + i * 6} y1={110 + i * 3} x2={54 + i * 6} y2={110 + i * 3} stroke="#6D4C41" strokeWidth="1" />
      ))}

      {/* Nesting boxes visible on side (3 compartments) */}
      <rect x="102" y="72" width="28" height="18" fill="#8B6030" stroke="#6D4C41" strokeWidth="1" />
      {/* Nest dividers */}
      <line x1="111" y1="72" x2="111" y2="90" stroke="#6D4C41" strokeWidth="1" />
      <line x1="121" y1="72" x2="121" y2="90" stroke="#6D4C41" strokeWidth="1" />
      {/* Straw in nests */}
      <ellipse cx="106" cy="86" rx="4" ry="3" fill="#E8C56D" />
      <ellipse cx="116" cy="85" rx="4" ry="3" fill="#F0D078" />
      <ellipse cx="126" cy="86" rx="4" ry="3" fill="#E8C56D" />
      {/* Egg in middle nest */}
      <ellipse cx="116" cy="83" rx="2.5" ry="3" fill="#FFF8E1" stroke="#FFE082" strokeWidth="0.5" />

      {/* Perch/roost bar visible through mesh */}
      <line x1="22" y1="93" x2="42" y2="93" stroke="#6D4C41" strokeWidth="1.5" />

      {/* Hay/straw scattered at base */}
      <ellipse cx="38" cy="122" rx="12" ry="3" fill="#E8C56D" opacity="0.6" />
      <ellipse cx="80" cy="123" rx="8" ry="2" fill="#F0D078" opacity="0.5" />

      {/* Small feathers scattered */}
      <path d="M25 120 Q27 118 26 122" fill="white" opacity="0.5" />
      <path d="M90 119 Q92 117 91 121" fill="white" opacity="0.4" />

      {/* Level stars */}
      {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
        <text key={i} x={30 + i * 14} y="50" fontSize="12" fill="#FFD700"
          style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}>★</text>
      ))}
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
