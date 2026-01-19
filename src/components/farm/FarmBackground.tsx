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
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          {/* Sky gradient */}
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="50%" stopColor="#B0E0E6" />
            <stop offset="100%" stopColor="#E0F4FF" />
          </linearGradient>

          {/* Ground gradient */}
          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7CB342" />
            <stop offset="50%" stopColor="#689F38" />
            <stop offset="100%" stopColor="#558B2F" />
          </linearGradient>

          {/* Dirt path gradient */}
          <linearGradient id="dirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#6D4C41" />
          </linearGradient>

          {/* Sun glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="50%" stopColor="#FFEB3B" />
            <stop offset="100%" stopColor="#FFC107" />
          </radialGradient>

          {/* Cloud filter */}
          <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.1" />
          </filter>

          {/* Grass texture pattern */}
          <pattern id="grassPattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#7CB342" />
            <path d="M5 20 Q5 15 3 10" stroke="#8BC34A" strokeWidth="1" fill="none" />
            <path d="M10 20 Q10 12 8 5" stroke="#9CCC65" strokeWidth="1" fill="none" />
            <path d="M15 20 Q15 14 17 8" stroke="#8BC34A" strokeWidth="1" fill="none" />
          </pattern>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="800" height="350" fill="url(#skyGradient)" />

        {/* Sun */}
        <circle cx="650" cy="80" r="50" fill="url(#sunGlow)">
          <animate
            attributeName="r"
            values="50;55;50"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Sun rays */}
        <g opacity="0.3">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="650"
              y1="80"
              x2={650 + Math.cos((angle * Math.PI) / 180) * 80}
              y2={80 + Math.sin((angle * Math.PI) / 180) * 80}
              stroke="#FFF59D"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.6;0.3"
                dur="3s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </line>
          ))}
        </g>

        {/* Clouds */}
        <g filter="url(#cloudShadow)">
          {/* Cloud 1 */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;100,0;0,0"
              dur="60s"
              repeatCount="indefinite"
            />
            <ellipse cx="120" cy="80" rx="50" ry="30" fill="white" opacity="0.9" />
            <ellipse cx="160" cy="70" rx="40" ry="25" fill="white" opacity="0.9" />
            <ellipse cx="90" cy="85" rx="35" ry="20" fill="white" opacity="0.9" />
          </g>

          {/* Cloud 2 */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;-80,0;0,0"
              dur="45s"
              repeatCount="indefinite"
            />
            <ellipse cx="350" cy="60" rx="45" ry="28" fill="white" opacity="0.85" />
            <ellipse cx="390" cy="55" rx="35" ry="22" fill="white" opacity="0.85" />
            <ellipse cx="320" cy="65" rx="30" ry="18" fill="white" opacity="0.85" />
          </g>

          {/* Cloud 3 */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;120,0;0,0"
              dur="70s"
              repeatCount="indefinite"
            />
            <ellipse cx="550" cy="100" rx="55" ry="32" fill="white" opacity="0.8" />
            <ellipse cx="600" cy="90" rx="45" ry="28" fill="white" opacity="0.8" />
            <ellipse cx="510" cy="105" rx="40" ry="24" fill="white" opacity="0.8" />
          </g>
        </g>

        {/* Distant hills */}
        <ellipse cx="200" cy="350" rx="250" ry="80" fill="#81C784" />
        <ellipse cx="550" cy="360" rx="300" ry="90" fill="#66BB6A" />
        <ellipse cx="750" cy="355" rx="200" ry="70" fill="#81C784" />

        {/* Main ground */}
        <rect x="0" y="320" width="800" height="280" fill="url(#groundGradient)" />

        {/* Grass texture overlay */}
        <rect x="0" y="320" width="800" height="280" fill="url(#grassPattern)" opacity="0.3" />

        {/* Dirt path */}
        <path
          d="M400 600 Q380 500 350 450 Q320 400 380 350"
          fill="none"
          stroke="url(#dirtGradient)"
          strokeWidth="40"
          strokeLinecap="round"
        />
        <path
          d="M400 600 Q420 550 480 500 Q550 450 500 380"
          fill="none"
          stroke="url(#dirtGradient)"
          strokeWidth="35"
          strokeLinecap="round"
        />

        {/* Fence posts */}
        {[50, 120, 190, 610, 680, 750].map((x, i) => (
          <g key={i}>
            <rect x={x - 4} y="340" width="8" height="50" fill="#8D6E63" />
            <rect x={x - 6} y="335" width="12" height="8" fill="#A1887F" rx="2" />
          </g>
        ))}

        {/* Fence rails */}
        <rect x="40" y="350" width="160" height="6" fill="#A1887F" rx="2" />
        <rect x="40" y="370" width="160" height="6" fill="#A1887F" rx="2" />
        <rect x="600" y="350" width="160" height="6" fill="#A1887F" rx="2" />
        <rect x="600" y="370" width="160" height="6" fill="#A1887F" rx="2" />

        {/* Flowers scattered */}
        {[
          { x: 80, y: 420, color: '#E91E63' },
          { x: 150, y: 450, color: '#FFEB3B' },
          { x: 100, y: 480, color: '#E91E63' },
          { x: 700, y: 430, color: '#FFEB3B' },
          { x: 720, y: 470, color: '#E91E63' },
          { x: 680, y: 500, color: '#9C27B0' },
          { x: 60, y: 520, color: '#9C27B0' },
          { x: 740, y: 520, color: '#FFEB3B' },
        ].map((flower, i) => (
          <g key={i}>
            <circle cx={flower.x} cy={flower.y} r="4" fill={flower.color}>
              <animate
                attributeName="r"
                values="4;5;4"
                dur="2s"
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
            <line
              x1={flower.x}
              y1={flower.y + 4}
              x2={flower.x}
              y2={flower.y + 15}
              stroke="#4CAF50"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Animated grass tufts */}
        {[
          { x: 30, y: 400 },
          { x: 180, y: 520 },
          { x: 250, y: 580 },
          { x: 620, y: 410 },
          { x: 770, y: 550 },
        ].map((tuft, i) => (
          <g key={i}>
            <path
              d={`M${tuft.x} ${tuft.y} Q${tuft.x - 3} ${tuft.y - 20} ${tuft.x - 5} ${tuft.y - 30}`}
              stroke="#4CAF50"
              strokeWidth="3"
              fill="none"
            >
              <animate
                attributeName="d"
                values={`M${tuft.x} ${tuft.y} Q${tuft.x - 3} ${tuft.y - 20} ${tuft.x - 5} ${tuft.y - 30};M${tuft.x} ${tuft.y} Q${tuft.x + 2} ${tuft.y - 20} ${tuft.x} ${tuft.y - 30};M${tuft.x} ${tuft.y} Q${tuft.x - 3} ${tuft.y - 20} ${tuft.x - 5} ${tuft.y - 30}`}
                dur="3s"
                begin={`${i * 0.5}s`}
                repeatCount="indefinite"
              />
            </path>
            <path
              d={`M${tuft.x} ${tuft.y} Q${tuft.x + 5} ${tuft.y - 18} ${tuft.x + 8} ${tuft.y - 28}`}
              stroke="#66BB6A"
              strokeWidth="2"
              fill="none"
            >
              <animate
                attributeName="d"
                values={`M${tuft.x} ${tuft.y} Q${tuft.x + 5} ${tuft.y - 18} ${tuft.x + 8} ${tuft.y - 28};M${tuft.x} ${tuft.y} Q${tuft.x} ${tuft.y - 18} ${tuft.x + 3} ${tuft.y - 28};M${tuft.x} ${tuft.y} Q${tuft.x + 5} ${tuft.y - 18} ${tuft.x + 8} ${tuft.y - 28}`}
                dur="2.5s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </path>
          </g>
        ))}

        {/* Birds in the distance */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;400,50;800,0"
            dur="30s"
            repeatCount="indefinite"
          />
          <path d="M50 150 Q55 145 60 150 Q65 145 70 150" fill="none" stroke="#333" strokeWidth="2" />
          <path d="M80 160 Q85 155 90 160 Q95 155 100 160" fill="none" stroke="#333" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
