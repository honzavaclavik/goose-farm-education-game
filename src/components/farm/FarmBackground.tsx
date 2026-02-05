import { CSSProperties } from 'react';

export function FarmBackground() {
  const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  };

  return (
    <div style={containerStyle}>
      <svg
        viewBox="0 0 1024 768"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="iso-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7EC8E3" />
            <stop offset="60%" stopColor="#C5E8F7" />
            <stop offset="100%" stopColor="#E8F4F8" />
          </linearGradient>

          <linearGradient id="iso-grass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6DBE45" />
            <stop offset="50%" stopColor="#5DAE35" />
            <stop offset="100%" stopColor="#4D9E28" />
          </linearGradient>

          <linearGradient id="iso-earth-left" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B6914" />
            <stop offset="100%" stopColor="#6B4E0A" />
          </linearGradient>
          <linearGradient id="iso-earth-right" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7A5C10" />
            <stop offset="100%" stopColor="#5A3E06" />
          </linearGradient>

          <linearGradient id="iso-stone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C8BEB4" />
            <stop offset="100%" stopColor="#A89888" />
          </linearGradient>

          <filter id="cloudBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          <filter id="islandShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" />
          </filter>

          <pattern id="grassStripes" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(30)">
            <rect width="40" height="40" fill="transparent" />
            <rect width="40" height="20" fill="rgba(255,255,255,0.04)" />
          </pattern>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="1024" height="768" fill="url(#iso-sky)" />

        {/* Sun */}
        <circle cx="900" cy="100" r="60" fill="#FFF9C4" opacity="0.6" />
        <circle cx="900" cy="100" r="45" fill="#FFF176" opacity="0.4" />
        <circle cx="900" cy="100" r="30" fill="#FFEE58" opacity="0.5" />

        {/* Clouds */}
        <g opacity="0.7">
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;60,0;0,0" dur="80s" repeatCount="indefinite" />
            <ellipse cx="180" cy="120" rx="70" ry="30" fill="white" />
            <ellipse cx="230" cy="110" rx="55" ry="25" fill="white" />
            <ellipse cx="140" cy="125" rx="45" ry="20" fill="white" />
            <ellipse cx="185" cy="135" rx="50" ry="15" fill="#f0f0f0" opacity="0.5" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;-50,0;0,0" dur="60s" repeatCount="indefinite" />
            <ellipse cx="550" cy="80" rx="60" ry="28" fill="white" />
            <ellipse cx="600" cy="72" rx="50" ry="22" fill="white" />
            <ellipse cx="510" cy="85" rx="40" ry="18" fill="white" />
            <ellipse cx="555" cy="95" rx="45" ry="14" fill="#f0f0f0" opacity="0.5" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;40,0;0,0" dur="90s" repeatCount="indefinite" />
            <ellipse cx="800" cy="150" rx="50" ry="22" fill="white" />
            <ellipse cx="840" cy="142" rx="40" ry="18" fill="white" />
            <ellipse cx="770" cy="155" rx="35" ry="15" fill="white" />
          </g>
        </g>

        {/* Island shadow */}
        <ellipse cx="512" cy="620" rx="320" ry="50" fill="rgba(0,0,0,0.15)" filter="url(#islandShadow)" />

        {/* Floating island top face (grass) */}
        <polygon points="512,200 832,360 512,520 192,360" fill="url(#iso-grass)" />
        <polygon points="512,200 832,360 512,520 192,360" fill="url(#grassStripes)" />

        {/* Island left side (earth) */}
        <polygon points="192,360 512,520 512,580 192,420" fill="url(#iso-earth-left)" />

        {/* Island right side (earth darker) */}
        <polygon points="832,360 512,520 512,580 832,420" fill="url(#iso-earth-right)" />

        {/* Grass edge highlight */}
        <polyline points="512,200 832,360 512,520 192,360 512,200" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

        {/* Stone path on island */}
        <g opacity="0.6">
          {[
            { cx: 420, cy: 340 },
            { cx: 450, cy: 355 },
            { cx: 480, cy: 365 },
            { cx: 510, cy: 370 },
            { cx: 540, cy: 365 },
            { cx: 570, cy: 355 },
            { cx: 600, cy: 340 },
          ].map((stone, i) => (
            <ellipse key={i} cx={stone.cx} cy={stone.cy} rx={12 + (i % 3) * 2} ry={6 + (i % 2) * 2} fill="url(#iso-stone)" stroke="#B8A898" strokeWidth="0.5" />
          ))}
        </g>

        {/* Flowers */}
        {[
          { x: 350, y: 320, color: '#FF6B9D' },
          { x: 680, y: 330, color: '#FFD93D' },
          { x: 300, y: 370, color: '#FF6B9D' },
          { x: 720, y: 370, color: '#C77DFF' },
          { x: 400, y: 440, color: '#FFD93D' },
          { x: 620, y: 450, color: '#FF6B9D' },
          { x: 280, y: 400, color: '#C77DFF' },
          { x: 740, y: 400, color: '#FFD93D' },
        ].map((f, i) => (
          <g key={i}>
            <circle cx={f.x} cy={f.y} r="3" fill={f.color} opacity="0.8">
              <animate attributeName="r" values="3;3.5;3" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <line x1={f.x} y1={f.y + 3} x2={f.x} y2={f.y + 10} stroke="#4CAF50" strokeWidth="1.5" />
          </g>
        ))}

        {/* Bushes */}
        {[
          { x: 260, y: 345 },
          { x: 760, y: 350 },
          { x: 320, y: 430 },
          { x: 700, y: 435 },
        ].map((bush, i) => (
          <g key={i}>
            <ellipse cx={bush.x} cy={bush.y} rx="15" ry="10" fill="#3D8B37" />
            <ellipse cx={bush.x - 5} cy={bush.y - 3} rx="12" ry="9" fill="#4CAF50" />
            <ellipse cx={bush.x + 5} cy={bush.y - 5} rx="10" ry="8" fill="#66BB6A" />
          </g>
        ))}

        {/* Grass tufts on edge */}
        {[
          { x: 220, y: 365 },
          { x: 350, y: 470 },
          { x: 680, y: 475 },
          { x: 800, y: 365 },
        ].map((tuft, i) => (
          <g key={i} opacity="0.7">
            <path d={`M${tuft.x} ${tuft.y} Q${tuft.x - 3} ${tuft.y - 12} ${tuft.x - 6} ${tuft.y - 18}`}
              stroke="#4CAF50" strokeWidth="2" fill="none">
              <animate attributeName="d"
                values={`M${tuft.x} ${tuft.y} Q${tuft.x - 3} ${tuft.y - 12} ${tuft.x - 6} ${tuft.y - 18};M${tuft.x} ${tuft.y} Q${tuft.x + 1} ${tuft.y - 12} ${tuft.x - 2} ${tuft.y - 18};M${tuft.x} ${tuft.y} Q${tuft.x - 3} ${tuft.y - 12} ${tuft.x - 6} ${tuft.y - 18}`}
                dur="4s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
            </path>
            <path d={`M${tuft.x} ${tuft.y} Q${tuft.x + 4} ${tuft.y - 10} ${tuft.x + 7} ${tuft.y - 16}`}
              stroke="#66BB6A" strokeWidth="1.5" fill="none">
              <animate attributeName="d"
                values={`M${tuft.x} ${tuft.y} Q${tuft.x + 4} ${tuft.y - 10} ${tuft.x + 7} ${tuft.y - 16};M${tuft.x} ${tuft.y} Q${tuft.x} ${tuft.y - 10} ${tuft.x + 3} ${tuft.y - 16};M${tuft.x} ${tuft.y} Q${tuft.x + 4} ${tuft.y - 10} ${tuft.x + 7} ${tuft.y - 16}`}
                dur="3.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </path>
          </g>
        ))}
      </svg>
    </div>
  );
}
