import { CSSProperties } from 'react';

interface GooseSVGProps {
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isCollecting?: boolean;
  animationDelay?: number;
  onClick?: () => void;
  name?: string;
  eggProduction?: number;
  isHungry?: boolean;
  hasEgg?: boolean;
}

export function GooseSVG({
  rarity,
  isCollecting = false,
  animationDelay = 0,
  onClick,
  name,
  eggProduction,
  isHungry = false,
  hasEgg = false,
}: GooseSVGProps) {
  const getColors = () => {
    switch (rarity) {
      case 'common':
        return {
          body: '#F5F5F5',
          bodyShade: '#E0E0E0',
          beak: '#FF9800',
          feet: '#FF9800',
          eye: '#212121',
          wing: '#EEEEEE',
          glow: 'none',
        };
      case 'rare':
        return {
          body: '#FFFFFF',
          bodyShade: '#E3F2FD',
          beak: '#FF5722',
          feet: '#FF5722',
          eye: '#212121',
          wing: '#E1F5FE',
          glow: 'drop-shadow(0 0 8px rgba(33, 150, 243, 0.5))',
        };
      case 'epic':
        return {
          body: '#E8F5E9',
          bodyShade: '#C8E6C9',
          beak: '#4CAF50',
          feet: '#FF9800',
          eye: '#212121',
          wing: '#A5D6A7',
          glow: 'drop-shadow(0 0 10px rgba(76, 175, 80, 0.6))',
        };
      case 'legendary':
        return {
          body: '#E8EAF6',
          bodyShade: '#C5CAE9',
          beak: '#FFD700',
          feet: '#FFD700',
          eye: '#673AB7',
          wing: '#9FA8DA',
          tail1: '#3F51B5',
          tail2: '#2196F3',
          tail3: '#00BCD4',
          glow: 'drop-shadow(0 0 15px rgba(103, 58, 183, 0.7))',
        };
    }
  };

  const colors = getColors();

  const containerStyle: CSSProperties = {
    width: '70px',
    height: '70px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    filter: isHungry ? `grayscale(50%) ${colors.glow}` : colors.glow,
    position: 'relative',
  };

  const svgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
  };

  const eggStyle: CSSProperties = {
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '24px',
    animation: isCollecting ? 'eggFloat 0.6s ease-out forwards' : 'none',
    pointerEvents: 'none',
  };

  const renderCommonGoose = () => (
    <svg viewBox="0 0 60 50" style={svgStyle}>
      <defs>
        <linearGradient id={`bodyGrad-${rarity}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.body} />
          <stop offset="100%" stopColor={colors.bodyShade} />
        </linearGradient>
      </defs>

      {/* Body */}
      <ellipse cx="30" cy="35" rx="18" ry="12" fill={`url(#bodyGrad-${rarity})`}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3 30 35;3 30 35;-3 30 35"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Wing */}
      <ellipse cx="32" cy="33" rx="10" ry="7" fill={colors.wing}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3 30 35;3 30 35;-3 30 35"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Neck */}
      <path
        d="M20 32 Q15 25 18 15 Q20 10 22 15 Q25 25 22 32"
        fill={`url(#bodyGrad-${rarity})`}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3 30 35;3 30 35;-3 30 35"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </path>

      {/* Head */}
      <circle cx="18" cy="12" r="7" fill={colors.body}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3 30 35;3 30 35;-3 30 35"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </circle>

      {/* Beak */}
      <path d="M11 12 L6 14 L11 15" fill={colors.beak}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3 30 35;3 30 35;-3 30 35"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </path>

      {/* Eye */}
      <circle cx="15" cy="10" r="2" fill={colors.eye}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3 30 35;3 30 35;-3 30 35"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="14.5" cy="9.5" r="0.5" fill="white">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3 30 35;3 30 35;-3 30 35"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </circle>

      {/* Feet */}
      <g>
        <path d="M25 46 L22 50 M25 46 L25 50 M25 46 L28 50" stroke={colors.feet} strokeWidth="2" fill="none">
          <animate
            attributeName="d"
            values="M25 46 L22 50 M25 46 L25 50 M25 46 L28 50;M23 46 L20 50 M23 46 L23 50 M23 46 L26 50;M25 46 L22 50 M25 46 L25 50 M25 46 L28 50"
            dur="0.8s"
            begin={`${animationDelay}s`}
            repeatCount="indefinite"
          />
        </path>
        <path d="M35 46 L32 50 M35 46 L35 50 M35 46 L38 50" stroke={colors.feet} strokeWidth="2" fill="none">
          <animate
            attributeName="d"
            values="M35 46 L32 50 M35 46 L35 50 M35 46 L38 50;M37 46 L34 50 M37 46 L37 50 M37 46 L40 50;M35 46 L32 50 M35 46 L35 50 M35 46 L38 50"
            dur="0.8s"
            begin={`${animationDelay + 0.4}s`}
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Tail feathers */}
      <path d="M47 32 Q52 30 50 35 Q48 38 45 35" fill={colors.wing}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-3 30 35;3 30 35;-3 30 35"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );

  const renderLegendaryGoose = () => (
    <svg viewBox="0 0 70 55" style={svgStyle}>
      <defs>
        <linearGradient id="legendaryBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.body} />
          <stop offset="100%" stopColor={colors.bodyShade} />
        </linearGradient>
        <linearGradient id="peacockFeather" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="50%" stopColor="#00BCD4" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
      </defs>

      {/* Peacock tail feathers */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = -40 + i * 20;
        const length = 25 + Math.abs(2 - i) * -3;
        return (
          <g key={i}>
            <line
              x1="45"
              y1="35"
              x2={45 + Math.cos((angle * Math.PI) / 180) * length}
              y2={35 + Math.sin((angle * Math.PI) / 180) * length}
              stroke="url(#peacockFeather)"
              strokeWidth="3"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`-5 45 35;5 45 35;-5 45 35`}
                dur="2s"
                begin={`${i * 0.1}s`}
                repeatCount="indefinite"
              />
            </line>
            <circle
              cx={45 + Math.cos((angle * Math.PI) / 180) * length}
              cy={35 + Math.sin((angle * Math.PI) / 180) * length}
              r="4"
              fill="#3F51B5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`-5 45 35;5 45 35;-5 45 35`}
                dur="2s"
                begin={`${i * 0.1}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={45 + Math.cos((angle * Math.PI) / 180) * length}
              cy={35 + Math.sin((angle * Math.PI) / 180) * length}
              r="2"
              fill="#00BCD4"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`-5 45 35;5 45 35;-5 45 35`}
                dur="2s"
                begin={`${i * 0.1}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}

      {/* Body */}
      <ellipse cx="35" cy="38" rx="16" ry="10" fill="url(#legendaryBodyGrad)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-2 35 38;2 35 38;-2 35 38"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Wing */}
      <ellipse cx="37" cy="36" rx="9" ry="6" fill={colors.wing}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-2 35 38;2 35 38;-2 35 38"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Neck */}
      <path d="M25 35 Q20 28 23 18 Q25 13 27 18 Q30 28 27 35" fill="url(#legendaryBodyGrad)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-2 35 38;2 35 38;-2 35 38"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </path>

      {/* Head */}
      <circle cx="23" cy="15" r="6" fill={colors.body}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-2 35 38;2 35 38;-2 35 38"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </circle>

      {/* Crown feathers */}
      <g>
        <line x1="23" y1="9" x2="21" y2="3" stroke="#673AB7" strokeWidth="2" />
        <circle cx="21" cy="2" r="2" fill="#FFD700" />
        <line x1="25" y1="9" x2="25" y2="2" stroke="#673AB7" strokeWidth="2" />
        <circle cx="25" cy="1" r="2" fill="#FFD700" />
        <line x1="27" y1="10" x2="29" y2="4" stroke="#673AB7" strokeWidth="2" />
        <circle cx="29" cy="3" r="2" fill="#FFD700" />
      </g>

      {/* Beak */}
      <path d="M17 15 L12 17 L17 18" fill={colors.beak}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-2 35 38;2 35 38;-2 35 38"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </path>

      {/* Eye */}
      <circle cx="20" cy="13" r="2" fill={colors.eye}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-2 35 38;2 35 38;-2 35 38"
          dur="1.5s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="19.5" cy="12.5" r="0.5" fill="white" />

      {/* Feet */}
      <path d="M30 48 L27 52 M30 48 L30 52 M30 48 L33 52" stroke={colors.feet} strokeWidth="2" fill="none">
        <animate
          attributeName="d"
          values="M30 48 L27 52 M30 48 L30 52 M30 48 L33 52;M28 48 L25 52 M28 48 L28 52 M28 48 L31 52;M30 48 L27 52 M30 48 L30 52 M30 48 L33 52"
          dur="0.8s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />
      </path>
      <path d="M40 48 L37 52 M40 48 L40 52 M40 48 L43 52" stroke={colors.feet} strokeWidth="2" fill="none">
        <animate
          attributeName="d"
          values="M40 48 L37 52 M40 48 L40 52 M40 48 L43 52;M42 48 L39 52 M42 48 L42 52 M42 48 L45 52;M40 48 L37 52 M40 48 L40 52 M40 48 L43 52"
          dur="0.8s"
          begin={`${animationDelay + 0.4}s`}
          repeatCount="indefinite"
        />
      </path>

      {/* Sparkles */}
      {[
        { x: 55, y: 20 },
        { x: 60, y: 35 },
        { x: 10, y: 10 },
      ].map((pos, i) => (
        <g key={i}>
          <line
            x1={pos.x - 3}
            y1={pos.y}
            x2={pos.x + 3}
            y2={pos.y}
            stroke="#FFD700"
            strokeWidth="1.5"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.5s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </line>
          <line
            x1={pos.x}
            y1={pos.y - 3}
            x2={pos.x}
            y2={pos.y + 3}
            stroke="#FFD700"
            strokeWidth="1.5"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.5s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </line>
        </g>
      ))}
    </svg>
  );

  return (
    <div
      style={containerStyle}
      onClick={onClick}
      title={name ? `${name} (+${eggProduction} 🥚)` : undefined}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
      }}
    >
      {rarity === 'legendary' ? renderLegendaryGoose() : renderCommonGoose()}
      {isCollecting && <div style={eggStyle}>🥚</div>}
      {isHungry && !hasEgg && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-5px',
            fontSize: '16px',
            animation: 'hungryPulse 1s infinite',
          }}
        >
          😫
        </div>
      )}
      {hasEgg && !isCollecting && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '20px',
            animation: 'eggReady 1s infinite',
            cursor: 'pointer',
          }}
        >
          🥚
        </div>
      )}

      <style>{`
        @keyframes eggFloat {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
        }
        @keyframes hungryPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes eggReady {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
