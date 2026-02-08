import { CSSProperties } from 'react';

interface FarmGroundProps {
  worldWidth: number;
  worldHeight: number;
}

// Extend ground far beyond the world bounds so it looks infinite
const GROUND_PAD = 3000;

export function FarmGround({ worldWidth, worldHeight }: FarmGroundProps) {
  const totalW = worldWidth + GROUND_PAD * 2;
  const totalH = worldHeight + GROUND_PAD * 2;

  const containerStyle: CSSProperties = {
    position: 'absolute',
    top: -GROUND_PAD,
    left: -GROUND_PAD,
    width: totalW,
    height: totalH,
  };

  return (
    <div style={containerStyle}>
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        width={totalW}
        height={totalH}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="ground-grass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7CB342" />
            <stop offset="50%" stopColor="#6DAE35" />
            <stop offset="100%" stopColor="#5D9E28" />
          </linearGradient>
          <pattern id="grassTexture" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="rotate(15)">
            <rect width="60" height="60" fill="transparent" />
            <rect width="60" height="30" fill="rgba(255,255,255,0.03)" />
          </pattern>
          <linearGradient id="pathStone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C8BEB4" />
            <stop offset="100%" stopColor="#A89888" />
          </linearGradient>
        </defs>

        {/* Main grass - fills entire extended area */}
        <rect x="0" y="0" width={totalW} height={totalH} fill="url(#ground-grass)" />
        <rect x="0" y="0" width={totalW} height={totalH} fill="url(#grassTexture)" />

        {/* Darker grass patches - in original world area (offset by GROUND_PAD) */}
        <ellipse cx={GROUND_PAD + worldWidth * 0.2} cy={GROUND_PAD + worldHeight * 0.3} rx="120" ry="80" fill="rgba(0,80,0,0.06)" />
        <ellipse cx={GROUND_PAD + worldWidth * 0.7} cy={GROUND_PAD + worldHeight * 0.6} rx="150" ry="90" fill="rgba(0,80,0,0.05)" />
        <ellipse cx={GROUND_PAD + worldWidth * 0.5} cy={GROUND_PAD + worldHeight * 0.8} rx="100" ry="60" fill="rgba(0,80,0,0.04)" />

        {/* Extra grass patches in extended area */}
        <ellipse cx={GROUND_PAD * 0.3} cy={GROUND_PAD * 0.5} rx="200" ry="120" fill="rgba(0,80,0,0.04)" />
        <ellipse cx={totalW * 0.8} cy={GROUND_PAD * 0.4} rx="180" ry="100" fill="rgba(0,80,0,0.03)" />
        <ellipse cx={GROUND_PAD * 0.5} cy={totalH * 0.8} rx="160" ry="90" fill="rgba(0,80,0,0.05)" />
        <ellipse cx={totalW * 0.7} cy={totalH * 0.85} rx="140" ry="80" fill="rgba(0,80,0,0.04)" />

        {/* Lighter grass patches */}
        <ellipse cx={GROUND_PAD + worldWidth * 0.4} cy={GROUND_PAD + worldHeight * 0.2} rx="100" ry="70" fill="rgba(255,255,200,0.04)" />
        <ellipse cx={GROUND_PAD + worldWidth * 0.8} cy={GROUND_PAD + worldHeight * 0.4} rx="80" ry="50" fill="rgba(255,255,200,0.03)" />

        {/* Stone paths - main horizontal */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <ellipse
            key={`path-h-${i}`}
            cx={GROUND_PAD + 250 + i * 80 + (i % 2) * 10}
            cy={GROUND_PAD + worldHeight * 0.45 + (i % 3) * 6 - 4}
            rx={16 + (i % 3) * 3}
            ry={8 + (i % 2) * 2}
            fill="url(#pathStone)"
            stroke="#B8A898"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}

        {/* Stone path - vertical connector */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={`path-v-${i}`}
            cx={GROUND_PAD + worldWidth * 0.35 + (i % 2) * 6 - 3}
            cy={GROUND_PAD + 300 + i * 70 + (i % 3) * 8}
            rx={10 + (i % 3) * 2}
            ry={14 + (i % 2) * 3}
            fill="url(#pathStone)"
            stroke="#B8A898"
            strokeWidth="0.5"
            opacity="0.45"
          />
        ))}

        {/* Flowers scattered around */}
        {[
          { x: 150, y: 200, color: '#FF6B9D' },
          { x: 350, y: 150, color: '#FFD93D' },
          { x: 800, y: 250, color: '#C77DFF' },
          { x: 1050, y: 350, color: '#FF6B9D' },
          { x: 200, y: 600, color: '#FFD93D' },
          { x: 600, y: 700, color: '#C77DFF' },
          { x: 900, y: 550, color: '#FF6B9D' },
          { x: 1100, y: 650, color: '#FFD93D' },
          { x: 450, y: 850, color: '#FF6B9D' },
          { x: 750, y: 900, color: '#C77DFF' },
          { x: 300, y: 450, color: '#FFD93D' },
          { x: 1000, y: 800, color: '#FF6B9D' },
        ].map((f, i) => (
          <g key={`flower-${i}`}>
            <circle cx={GROUND_PAD + f.x} cy={GROUND_PAD + f.y} r="3.5" fill={f.color} opacity="0.75">
              <animate attributeName="r" values="3.5;4;3.5" dur="3s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
            </circle>
            <line x1={GROUND_PAD + f.x} y1={GROUND_PAD + f.y + 3.5} x2={GROUND_PAD + f.x} y2={GROUND_PAD + f.y + 12} stroke="#4CAF50" strokeWidth="1.5" />
          </g>
        ))}

        {/* Bushes */}
        {[
          { x: 100, y: 350 },
          { x: 1150, y: 300 },
          { x: 250, y: 750 },
          { x: 950, y: 800 },
          { x: 500, y: 250 },
          { x: 1050, y: 550 },
        ].map((bush, i) => (
          <g key={`bush-${i}`}>
            <ellipse cx={GROUND_PAD + bush.x} cy={GROUND_PAD + bush.y} rx="18" ry="12" fill="#3D8B37" />
            <ellipse cx={GROUND_PAD + bush.x - 6} cy={GROUND_PAD + bush.y - 4} rx="14" ry="10" fill="#4CAF50" />
            <ellipse cx={GROUND_PAD + bush.x + 6} cy={GROUND_PAD + bush.y - 6} rx="12" ry="9" fill="#66BB6A" />
          </g>
        ))}

        {/* Small pond */}
        <g>
          <ellipse cx={GROUND_PAD + worldWidth * 0.75} cy={GROUND_PAD + worldHeight * 0.35} rx="45" ry="25" fill="#388FC7" opacity="0.5" />
          <ellipse cx={GROUND_PAD + worldWidth * 0.75 - 3} cy={GROUND_PAD + worldHeight * 0.35 - 2} rx="35" ry="18" fill="#42A5F5" opacity="0.6" />
          <ellipse cx={GROUND_PAD + worldWidth * 0.75 - 8} cy={GROUND_PAD + worldHeight * 0.35 - 5} rx="15" ry="8" fill="rgba(255,255,255,0.25)" />
          {/* Reeds */}
          {[0, 1, 2].map((i) => (
            <g key={`reed-${i}`}>
              <line
                x1={GROUND_PAD + worldWidth * 0.75 + 35 + i * 8}
                y1={GROUND_PAD + worldHeight * 0.35 - 5}
                x2={GROUND_PAD + worldWidth * 0.75 + 35 + i * 8 + (i % 2 ? 3 : -3)}
                y2={GROUND_PAD + worldHeight * 0.35 - 30}
                stroke="#6D8B3A"
                strokeWidth="2"
              >
                <animate
                  attributeName="x2"
                  values={`${GROUND_PAD + worldWidth * 0.75 + 35 + i * 8 + (i % 2 ? 3 : -3)};${GROUND_PAD + worldWidth * 0.75 + 35 + i * 8 + (i % 2 ? -1 : 1)};${GROUND_PAD + worldWidth * 0.75 + 35 + i * 8 + (i % 2 ? 3 : -3)}`}
                  dur="3s"
                  begin={`${i * 0.5}s`}
                  repeatCount="indefinite"
                />
              </line>
              <ellipse
                cx={GROUND_PAD + worldWidth * 0.75 + 35 + i * 8 + (i % 2 ? 3 : -3)}
                cy={GROUND_PAD + worldHeight * 0.35 - 30}
                rx="3"
                ry="5"
                fill="#5D7A2E"
              />
            </g>
          ))}
        </g>

        {/* Hay bales */}
        {[
          { x: GROUND_PAD + worldWidth * 0.15, y: GROUND_PAD + worldHeight * 0.55 },
          { x: GROUND_PAD + worldWidth * 0.85, y: GROUND_PAD + worldHeight * 0.7 },
        ].map((pos, i) => (
          <g key={`hay-${i}`}>
            <ellipse cx={pos.x} cy={pos.y + 8} rx="16" ry="9" fill="#C49A3E" />
            <rect x={pos.x - 16} y={pos.y - 4} width="32" height="12" fill="#E8C56D" rx="3" />
            <ellipse cx={pos.x} cy={pos.y - 4} rx="16" ry="8" fill="#F0D078" />
            {[-8, 0, 8].map((offset, j) => (
              <line key={j} x1={pos.x + offset} y1={pos.y - 4} x2={pos.x + offset} y2={pos.y + 8} stroke="#C49A3E" strokeWidth="0.5" opacity="0.5" />
            ))}
          </g>
        ))}

        {/* Tree */}
        <g>
          <rect x={GROUND_PAD + worldWidth * 0.12 - 4} y={GROUND_PAD + worldHeight * 0.2} width="8" height="30" fill="#6D4C41" />
          <ellipse cx={GROUND_PAD + worldWidth * 0.12} cy={GROUND_PAD + worldHeight * 0.2 - 5} rx="22" ry="18" fill="#2E7D32" />
          <ellipse cx={GROUND_PAD + worldWidth * 0.12 - 8} cy={GROUND_PAD + worldHeight * 0.2 - 10} rx="16" ry="14" fill="#388E3C" />
          <ellipse cx={GROUND_PAD + worldWidth * 0.12 + 8} cy={GROUND_PAD + worldHeight * 0.2 - 8} rx="14" ry="12" fill="#43A047" />
          {/* Apples */}
          <circle cx={GROUND_PAD + worldWidth * 0.12 - 10} cy={GROUND_PAD + worldHeight * 0.2 - 2} r="3" fill="#E53935" />
          <circle cx={GROUND_PAD + worldWidth * 0.12 + 12} cy={GROUND_PAD + worldHeight * 0.2 - 5} r="2.5" fill="#E53935" />
        </g>

        {/* Grass tufts */}
        {[
          { x: 180, y: 400 }, { x: 700, y: 300 }, { x: 400, y: 650 },
          { x: 1000, y: 450 }, { x: 550, y: 150 }, { x: 850, y: 750 },
        ].map((tuft, i) => {
          const tx = GROUND_PAD + tuft.x;
          const ty = GROUND_PAD + tuft.y;
          return (
            <g key={`tuft-${i}`} opacity="0.5">
              <path d={`M${tx} ${ty} Q${tx - 3} ${ty - 10} ${tx - 5} ${ty - 16}`}
                stroke="#4CAF50" strokeWidth="2" fill="none">
                <animate attributeName="d"
                  values={`M${tx} ${ty} Q${tx - 3} ${ty - 10} ${tx - 5} ${ty - 16};M${tx} ${ty} Q${tx + 1} ${ty - 10} ${tx - 1} ${ty - 16};M${tx} ${ty} Q${tx - 3} ${ty - 10} ${tx - 5} ${ty - 16}`}
                  dur="4s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
              </path>
              <path d={`M${tx} ${ty} Q${tx + 4} ${ty - 8} ${tx + 6} ${ty - 14}`}
                stroke="#66BB6A" strokeWidth="1.5" fill="none">
                <animate attributeName="d"
                  values={`M${tx} ${ty} Q${tx + 4} ${ty - 8} ${tx + 6} ${ty - 14};M${tx} ${ty} Q${tx} ${ty - 8} ${tx + 2} ${ty - 14};M${tx} ${ty} Q${tx + 4} ${ty - 8} ${tx + 6} ${ty - 14}`}
                  dur="3.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              </path>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
