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
    width: '80px',
    height: '80px',
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
    <svg viewBox="0 0 80 65" style={svgStyle}>
      <defs>
        <linearGradient id={`bodyGrad-${rarity}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.body} />
          <stop offset="100%" stopColor={colors.bodyShade} />
        </linearGradient>
        <linearGradient id={`wingGrad-${rarity}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.wing} />
          <stop offset="100%" stopColor={colors.bodyShade} />
        </linearGradient>
      </defs>

      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-1.5 40 40;1.5 40 40;-1.5 40 40"
          dur="2s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />

        {/* Shadow */}
        <ellipse cx="40" cy="60" rx="18" ry="4" fill="rgba(0,0,0,0.1)" />

        {/* Tail feathers */}
        <path d="M56 38 Q64 32 62 40 Q60 44 55 42" fill={colors.wing} />
        <path d="M58 36 Q66 30 64 38 Q62 42 57 40" fill={colors.bodyShade} opacity="0.7" />

        {/* Body */}
        <ellipse cx="38" cy="40" rx="20" ry="14" fill={`url(#bodyGrad-${rarity})`} />

        {/* Body feather texture */}
        <path d="M28 36 Q32 34 36 36" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M32 40 Q36 38 40 40" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M30 44 Q34 42 38 44" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Wing */}
        <path d="M35 34 Q50 30 52 38 Q50 44 35 46 Q30 42 35 34" fill={`url(#wingGrad-${rarity})`} />
        <path d="M38 36 Q44 34 48 37" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M37 40 Q43 38 47 40" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M36 44 Q42 42 46 43" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* Neck */}
        <path d="M24 36 Q18 28 20 18 Q22 12 25 18 Q28 26 26 36" fill={`url(#bodyGrad-${rarity})`} />

        {/* Head */}
        <circle cx="22" cy="14" r="8" fill={colors.body} />

        {/* Beak */}
        <path d="M14 14 L7 16.5 L14 17.5" fill={colors.beak} />
        <line x1="14" y1="15.5" x2="8" y2="16.5" stroke={colors.beak} strokeWidth="0.5" opacity="0.5" />

        {/* Eye */}
        <circle cx="19" cy="12" r="2.5" fill={colors.eye} />
        <circle cx="18.5" cy="11.5" r="1" fill="white" />

        {/* Cheek blush */}
        <circle cx="17" cy="16" r="2.5" fill="#FFAB91" opacity="0.3" />

        {/* Feet */}
        <g>
          <path d="M32 53 L28 58 L32 57 L36 58 L32 53" fill={colors.feet} opacity="0.9">
            <animate attributeName="d"
              values="M32 53 L28 58 L32 57 L36 58 L32 53;M30 53 L26 58 L30 57 L34 58 L30 53;M32 53 L28 58 L32 57 L36 58 L32 53"
              dur="0.8s" begin={`${animationDelay}s`} repeatCount="indefinite" />
          </path>
          <path d="M42 53 L38 58 L42 57 L46 58 L42 53" fill={colors.feet} opacity="0.9">
            <animate attributeName="d"
              values="M42 53 L38 58 L42 57 L46 58 L42 53;M44 53 L40 58 L44 57 L48 58 L44 53;M42 53 L38 58 L42 57 L46 58 L42 53"
              dur="0.8s" begin={`${animationDelay + 0.4}s`} repeatCount="indefinite" />
          </path>
        </g>
      </g>
    </svg>
  );

  const renderLegendaryGoose = () => (
    <svg viewBox="0 0 90 70" style={svgStyle}>
      <defs>
        <linearGradient id="legendaryBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.body} />
          <stop offset="100%" stopColor={colors.bodyShade} />
        </linearGradient>
        <linearGradient id="legendaryWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.wing} />
          <stop offset="100%" stopColor={colors.bodyShade} />
        </linearGradient>
        <linearGradient id="peacockFeather" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="50%" stopColor="#00BCD4" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
      </defs>

      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-1 45 42;1 45 42;-1 45 42"
          dur="2s"
          begin={`${animationDelay}s`}
          repeatCount="indefinite"
        />

        {/* Shadow */}
        <ellipse cx="45" cy="65" rx="20" ry="4" fill="rgba(0,0,0,0.1)" />

        {/* Peacock tail feathers */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = -40 + i * 20;
          const length = 25 + Math.abs(2 - i) * -3;
          return (
            <g key={i}>
              <line x1="52" y1="40" x2={52 + Math.cos((angle * Math.PI) / 180) * length}
                y2={40 + Math.sin((angle * Math.PI) / 180) * length}
                stroke="url(#peacockFeather)" strokeWidth="3">
                <animateTransform attributeName="transform" type="rotate"
                  values={`-5 52 40;5 52 40;-5 52 40`} dur="2s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
              </line>
              <circle cx={52 + Math.cos((angle * Math.PI) / 180) * length}
                cy={40 + Math.sin((angle * Math.PI) / 180) * length} r="4" fill="#3F51B5">
                <animateTransform attributeName="transform" type="rotate"
                  values={`-5 52 40;5 52 40;-5 52 40`} dur="2s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={52 + Math.cos((angle * Math.PI) / 180) * length}
                cy={40 + Math.sin((angle * Math.PI) / 180) * length} r="2" fill="#00BCD4">
                <animateTransform attributeName="transform" type="rotate"
                  values={`-5 52 40;5 52 40;-5 52 40`} dur="2s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* Body */}
        <ellipse cx="42" cy="43" rx="18" ry="12" fill="url(#legendaryBodyGrad)" />

        {/* Body feather texture */}
        <path d="M32 39 Q36 37 40 39" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M35 43 Q39 41 43 43" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Wing */}
        <path d="M39 37 Q54 33 56 41 Q54 47 39 49 Q34 45 39 37" fill="url(#legendaryWingGrad)" />
        <path d="M42 39 Q48 37 52 40" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M41 43 Q47 41 51 43" stroke={colors.bodyShade} strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* Neck */}
        <path d="M28 39 Q22 31 24 21 Q26 15 29 21 Q32 29 30 39" fill="url(#legendaryBodyGrad)" />

        {/* Head */}
        <circle cx="26" cy="17" r="7" fill={colors.body} />

        {/* Crown */}
        <polygon points="20,10 22,4 24,9 26,3 28,9 30,5 32,10" fill="#FFD700" stroke="#FFA000" strokeWidth="0.5" />

        {/* Beak */}
        <path d="M19 17 L13 19.5 L19 20.5" fill={colors.beak} />

        {/* Eye */}
        <circle cx="23" cy="15" r="2.5" fill={colors.eye} />
        <circle cx="22.5" cy="14.5" r="1" fill="white" />

        {/* Cheek blush */}
        <circle cx="21" cy="19" r="2" fill="#FFAB91" opacity="0.3" />

        {/* Feet */}
        <path d="M36 56 L32 61 L36 60 L40 61 L36 56" fill={colors.feet} opacity="0.9">
          <animate attributeName="d"
            values="M36 56 L32 61 L36 60 L40 61 L36 56;M34 56 L30 61 L34 60 L38 61 L34 56;M36 56 L32 61 L36 60 L40 61 L36 56"
            dur="0.8s" begin={`${animationDelay}s`} repeatCount="indefinite" />
        </path>
        <path d="M46 56 L42 61 L46 60 L50 61 L46 56" fill={colors.feet} opacity="0.9">
          <animate attributeName="d"
            values="M46 56 L42 61 L46 60 L50 61 L46 56;M48 56 L44 61 L48 60 L52 61 L48 56;M46 56 L42 61 L46 60 L50 61 L46 56"
            dur="0.8s" begin={`${animationDelay + 0.4}s`} repeatCount="indefinite" />
        </path>

        {/* Sparkles */}
        {[{ x: 65, y: 25 }, { x: 70, y: 40 }, { x: 12, y: 12 }].map((pos, i) => (
          <g key={i}>
            <line x1={pos.x - 3} y1={pos.y} x2={pos.x + 3} y2={pos.y} stroke="#FFD700" strokeWidth="1.5">
              <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </line>
            <line x1={pos.x} y1={pos.y - 3} x2={pos.x} y2={pos.y + 3} stroke="#FFD700" strokeWidth="1.5">
              <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </line>
          </g>
        ))}
      </g>
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
