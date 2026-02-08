import { CSSProperties } from 'react';
import { Button } from '../common/Button';
import { useGameStore } from '../../store/gameStore';
import { useProgressStore } from '../../store/progressStore';
import type { MinigameType, ExerciseCategory } from '../../types/farm';

interface MinigameInfo {
  type: MinigameType;
  name: string;
  description: string;
  category: ExerciseCategory;
  color: string;
  colorDark: string;
  requiredLevel?: number;
}

const minigames: MinigameInfo[] = [
  {
    type: 'eggNest',
    name: 'Vejce v hnízdě',
    description: 'I/Y po měkkých a tvrdých souhláskách',
    category: 'softHardIY',
    color: '#FFD54F',
    colorDark: '#F9A825',
  },
  {
    type: 'gooseMarch',
    name: 'Husí pochod',
    description: 'Předpony vz/z/s',
    category: 'prefixes',
    color: '#81C784',
    colorDark: '#388E3C',
  },
  {
    type: 'flockFlight',
    name: 'Přelet hejna',
    description: 'Vyjmenovaná slova',
    category: 'declaredWords',
    color: '#64B5F6',
    colorDark: '#1565C0',
  },
  {
    type: 'fenceBuilder',
    name: 'Stavba plotu',
    description: 'Délka samohlásek',
    category: 'vowelLength',
    color: '#A1887F',
    colorDark: '#5D4037',
  },
  {
    type: 'gooseDetective',
    name: 'Husí detektiv',
    description: 'Najdi chybu ve větě',
    category: 'sentences',
    color: '#9575CD',
    colorDark: '#4527A0',
  },
  {
    type: 'fractionFarm',
    name: 'Zlomková farma',
    description: 'Zlomky pro 5. třídu',
    category: 'fractions',
    color: '#42A5F5',
    colorDark: '#1565C0',
  },
];

/* ── Mini SVG Scene Icons ── */

function EggNestScene() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72">
      {/* Nest */}
      <ellipse cx="40" cy="58" rx="28" ry="10" fill="#8D6E63" />
      <ellipse cx="40" cy="55" rx="26" ry="12" fill="#A1887F" />
      {/* Straw */}
      <path d="M18 52 Q22 48 26 52" stroke="#D4A840" strokeWidth="2" fill="none" />
      <path d="M30 50 Q34 46 38 50" stroke="#E8C56D" strokeWidth="2" fill="none" />
      <path d="M44 50 Q48 46 52 50" stroke="#D4A840" strokeWidth="2" fill="none" />
      <path d="M54 52 Q58 48 62 52" stroke="#E8C56D" strokeWidth="2" fill="none" />
      {/* Eggs */}
      <ellipse cx="30" cy="48" rx="7" ry="9" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1" />
      <ellipse cx="40" cy="46" rx="7" ry="9" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1" />
      <ellipse cx="50" cy="48" rx="7" ry="9" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1" />
      {/* Shine */}
      <ellipse cx="28" cy="44" rx="2" ry="3" fill="rgba(255,255,255,0.5)" />
      <ellipse cx="38" cy="42" rx="2" ry="3" fill="rgba(255,255,255,0.5)" />
      {/* Letter on egg */}
      <text x="40" y="50" fontSize="10" fill="#F57C00" textAnchor="middle" fontWeight="bold">Y</text>
      <text x="30" y="52" fontSize="10" fill="#F57C00" textAnchor="middle" fontWeight="bold">I</text>
    </svg>
  );
}

function GooseMarchScene() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72">
      {/* Path */}
      <path d="M5 60 Q20 55 40 58 Q60 61 75 56" stroke="#A1887F" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Goose 1 */}
      <g transform="translate(15, 30)">
        <ellipse cx="12" cy="14" rx="8" ry="6" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
        <path d="M8 10 Q6 4 8 2" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="8" cy="2" r="3" fill="white" />
        <circle cx="7" cy="1.5" r="0.8" fill="#333" />
        <path d="M5 2.5 L3 2 L5 1.5" fill="#FF8F00" />
      </g>
      {/* Goose 2 */}
      <g transform="translate(35, 28)">
        <ellipse cx="12" cy="14" rx="8" ry="6" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
        <path d="M8 10 Q6 4 8 2" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="8" cy="2" r="3" fill="white" />
        <circle cx="7" cy="1.5" r="0.8" fill="#333" />
        <path d="M5 2.5 L3 2 L5 1.5" fill="#FF8F00" />
      </g>
      {/* Goose 3 */}
      <g transform="translate(55, 26)">
        <ellipse cx="12" cy="14" rx="8" ry="6" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
        <path d="M8 10 Q6 4 8 2" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="8" cy="2" r="3" fill="white" />
        <circle cx="7" cy="1.5" r="0.8" fill="#333" />
        <path d="M5 2.5 L3 2 L5 1.5" fill="#FF8F00" />
      </g>
      {/* Signpost */}
      <rect x="2" y="18" width="3" height="42" fill="#6D4C41" />
      <rect x="-2" y="14" width="16" height="10" fill="#8D6E63" rx="2" />
      <text x="6" y="21" fontSize="5" fill="white" textAnchor="middle" fontWeight="bold">VZ</text>
    </svg>
  );
}

function FlockFlightScene() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72">
      {/* Sky */}
      <rect width="80" height="80" fill="none" />
      {/* Clouds */}
      <ellipse cx="15" cy="20" rx="12" ry="6" fill="rgba(255,255,255,0.6)" />
      <ellipse cx="65" cy="15" rx="10" ry="5" fill="rgba(255,255,255,0.4)" />
      {/* Flying birds (V formation) */}
      <path d="M30 30 L36 26 L42 30" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M38 36 L44 32 L50 36" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M22 36 L28 32 L34 36" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M46 42 L52 38 L58 42" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M14 42 L20 38 L26 42" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Lead goose (bigger) */}
      <g transform="translate(34, 22)">
        <ellipse cx="6" cy="8" rx="5" ry="3.5" fill="white" stroke="#BDBDBD" strokeWidth="0.5" />
        <path d="M4 6 Q3 2 4 0" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="4" cy="0" r="2" fill="white" />
        <circle cx="3.5" cy="-0.5" r="0.5" fill="#333" />
        <path d="M2 0.3 L0.5 0 L2 -0.3" fill="#FF8F00" />
      </g>
      {/* Word bubble */}
      <rect x="46" y="10" width="24" height="14" fill="white" rx="4" stroke="#E0E0E0" strokeWidth="1" />
      <text x="58" y="20" fontSize="7" fill="#1565C0" textAnchor="middle" fontWeight="bold">BÝT</text>
      <polygon points="50,24 46,28 54,24" fill="white" />
    </svg>
  );
}

function FenceBuilderScene() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72">
      {/* Ground */}
      <rect x="0" y="60" width="80" height="20" fill="#8D6E63" rx="4" />
      <rect x="0" y="58" width="80" height="6" fill="#A1887F" rx="2" />
      {/* Fence posts */}
      <rect x="8" y="24" width="5" height="38" fill="#6D4C41" rx="1" />
      <rect x="28" y="24" width="5" height="38" fill="#6D4C41" rx="1" />
      <rect x="48" y="24" width="5" height="38" fill="#6D4C41" rx="1" />
      <rect x="68" y="24" width="5" height="38" fill="#6D4C41" rx="1" />
      {/* Fence rails */}
      <rect x="8" y="30" width="65" height="4" fill="#A1887F" rx="1" />
      <rect x="8" y="44" width="65" height="4" fill="#A1887F" rx="1" />
      {/* Post caps */}
      <rect x="7" y="22" width="7" height="4" fill="#8D6E63" rx="1" />
      <rect x="27" y="22" width="7" height="4" fill="#8D6E63" rx="1" />
      <rect x="47" y="22" width="7" height="4" fill="#8D6E63" rx="1" />
      <rect x="67" y="22" width="7" height="4" fill="#8D6E63" rx="1" />
      {/* Hammer */}
      <rect x="56" y="8" width="3" height="16" fill="#5D4037" rx="0.5" transform="rotate(-30 57 16)" />
      <rect x="52" y="4" width="10" height="6" fill="#78909C" rx="1" transform="rotate(-30 57 7)" />
      {/* Letter signs */}
      <text x="18" y="42" fontSize="8" fill="#F57C00" textAnchor="middle" fontWeight="bold">Á</text>
      <text x="38" y="42" fontSize="8" fill="#F57C00" textAnchor="middle" fontWeight="bold">A</text>
    </svg>
  );
}

function GooseDetectiveScene() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72">
      {/* Goose body */}
      <ellipse cx="36" cy="50" rx="14" ry="10" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
      {/* Neck */}
      <path d="M28 44 Q24 30 28 22" stroke="white" strokeWidth="4" fill="none" />
      {/* Head */}
      <circle cx="28" cy="20" r="6" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
      {/* Eye */}
      <circle cx="26" cy="19" r="1.2" fill="#333" />
      {/* Beak */}
      <path d="M22 21 L18 20 L22 19" fill="#FF8F00" />
      {/* Detective hat */}
      <ellipse cx="28" cy="15" rx="8" ry="2" fill="#5D4037" />
      <path d="M22 15 Q28 6 34 15" fill="#795548" />
      {/* Magnifying glass */}
      <circle cx="54" cy="34" r="10" fill="none" stroke="#5D4037" strokeWidth="3" />
      <circle cx="54" cy="34" r="8" fill="rgba(173, 216, 230, 0.3)" />
      <line x1="61" y1="41" x2="68" y2="50" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
      {/* Error text in magnifying glass */}
      <text x="54" y="37" fontSize="8" fill="#D32F2F" textAnchor="middle" fontWeight="bold">?!</text>
    </svg>
  );
}

function FractionFarmScene() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72">
      {/* Barn */}
      <rect x="10" y="30" width="30" height="30" fill="#C62828" rx="2" />
      <polygon points="10,30 25,14 40,30" fill="#D32F2F" />
      {/* Barn door */}
      <rect x="18" y="42" width="14" height="18" fill="#4E342E" rx="1" />
      <path d="M18 42 Q25 36 32 42" fill="#5D4037" />
      {/* Chalkboard */}
      <rect x="46" y="18" width="28" height="22" fill="#2E7D32" rx="2" stroke="#5D4037" strokeWidth="2" />
      {/* Fraction */}
      <text x="60" y="29" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">3</text>
      <line x1="52" y1="31" x2="68" y2="31" stroke="white" strokeWidth="1.5" />
      <text x="60" y="39" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">4</text>
      {/* Fence */}
      <rect x="44" y="50" width="3" height="14" fill="#6D4C41" />
      <rect x="56" y="50" width="3" height="14" fill="#6D4C41" />
      <rect x="68" y="50" width="3" height="14" fill="#6D4C41" />
      <rect x="44" y="54" width="27" height="3" fill="#A1887F" rx="0.5" />
      {/* Hay */}
      <ellipse cx="25" cy="62" rx="8" ry="3" fill="#E8C56D" opacity="0.7" />
    </svg>
  );
}

const sceneComponents: Record<MinigameType, () => JSX.Element> = {
  eggNest: EggNestScene,
  gooseMarch: GooseMarchScene,
  flockFlight: FlockFlightScene,
  fenceBuilder: FenceBuilderScene,
  gooseDetective: GooseDetectiveScene,
  fractionFarm: FractionFarmScene,
};

/* ── Star Rating ── */

function StarRating({ filled }: { filled: number }) {
  return (
    <svg viewBox="0 0 54 16" width="54" height="16">
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${i * 19}, 0)`}>
          <polygon
            points="8,0 10.5,5 16,6 12,10 13,16 8,13 3,16 4,10 0,6 5.5,5"
            fill={i < filled ? '#FFD700' : 'none'}
            stroke={i < filled ? '#FFA000' : '#BDBDBD'}
            strokeWidth="1"
          />
          {i < filled && (
            <polygon
              points="8,2 9.5,5.5 13,6.5 10.5,9 11,13 8,11"
              fill="rgba(255,255,255,0.25)"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── Padlock SVG ── */

function PadlockIcon() {
  return (
    <svg viewBox="0 0 40 48" width="40" height="48">
      <path d="M10 20 L10 14 Q10 4 20 4 Q30 4 30 14 L30 20" fill="none" stroke="#78909C" strokeWidth="3" />
      <rect x="6" y="20" width="28" height="22" fill="#90A4AE" rx="4" />
      <rect x="8" y="22" width="24" height="18" fill="#B0BEC5" rx="3" />
      <circle cx="20" cy="30" r="3" fill="#546E7A" />
      <rect x="18.5" y="30" width="3" height="5" fill="#546E7A" rx="0.5" />
    </svg>
  );
}

/* ── Wooden Signpost ── */

function WoodenSignpost({ text }: { text: string }) {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 'var(--space-6)',
  };

  return (
    <div style={containerStyle}>
      <svg viewBox="0 0 280 90" width="280" height="90">
        {/* Post */}
        <rect x="132" y="60" width="16" height="30" fill="#6D4C41" />
        <rect x="134" y="60" width="4" height="30" fill="rgba(255,255,255,0.05)" />
        {/* Sign board */}
        <rect x="20" y="8" width="240" height="52" fill="#A1887F" rx="6" />
        <rect x="22" y="10" width="236" height="48" fill="#8D6E63" rx="5" />
        {/* Wood grain */}
        <line x1="22" y1="22" x2="258" y2="22" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        <line x1="22" y1="34" x2="258" y2="34" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        <line x1="22" y1="46" x2="258" y2="46" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        {/* Nails */}
        <circle cx="34" cy="34" r="3" fill="#5D4037" />
        <circle cx="34" cy="34" r="1.5" fill="#A1887F" />
        <circle cx="246" cy="34" r="3" fill="#5D4037" />
        <circle cx="246" cy="34" r="1.5" fill="#A1887F" />
        {/* Text */}
        <text x="140" y="42" fontSize="22" fill="white" textAnchor="middle"
          fontWeight="bold" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
          {text}
        </text>
      </svg>
    </div>
  );
}

export function MinigameSelector() {
  const { setScreen, startMinigame } = useGameStore();
  const { categoryStats, level } = useProgressStore();

  const getStarCount = (category: ExerciseCategory): number => {
    const stats = categoryStats[category];
    if (stats.totalAttempts === 0) return 0;
    const rate = stats.correctAnswers / stats.totalAttempts;
    if (rate >= 0.8) return 3;
    if (rate >= 0.5) return 2;
    if (stats.totalAttempts >= 3) return 1;
    return 0;
  };

  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    padding: 'var(--space-6)',
    background: 'linear-gradient(180deg, var(--color-sky-start) 0%, #85C1E9 40%, var(--color-grass-end) 100%)',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 'var(--space-5)',
    maxWidth: '1200px',
    margin: '0 auto var(--space-8)',
  };

  const cardStyle = (color: string, colorDark: string): CSSProperties => ({
    background: 'var(--texture-parchment)',
    borderRadius: 'var(--radius-lg)',
    border: `3px solid ${color}`,
    boxShadow: `0 5px 0 ${colorDark}, 0 8px 16px rgba(0,0,0,0.2)`,
    cursor: 'pointer',
    transition: 'all var(--transition-base)',
    position: 'relative',
    overflow: 'hidden',
  });

  const cardTopStyle = (color: string): CSSProperties => ({
    background: `linear-gradient(180deg, ${color}22 0%, ${color}11 100%)`,
    padding: 'var(--space-4) var(--space-4) var(--space-3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '2px solid rgba(0,0,0,0.06)',
  });

  const cardBottomStyle: CSSProperties = {
    padding: 'var(--space-3) var(--space-4) var(--space-4)',
  };

  const cardTitleStyle: CSSProperties = {
    fontSize: 'var(--text-lg)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-wood-dark)',
    marginBottom: 'var(--space-1)',
  };

  const cardDescStyle: CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-stone-dark)',
    lineHeight: 1.4,
    marginBottom: 'var(--space-3)',
  };

  const starsRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-3)',
  };

  const lockedOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    borderRadius: 'inherit',
    zIndex: 5,
  };

  const lockedTextStyle: CSSProperties = {
    color: 'white',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    fontSize: 'var(--text-base)',
    textShadow: 'var(--text-outline-dark)',
  };

  return (
    <div style={containerStyle}>
      <WoodenSignpost text="Procvičování" />

      <div style={gridStyle}>
        {minigames.map((game) => {
          const Scene = sceneComponents[game.type];
          const stars = getStarCount(game.category);
          const isLocked = game.requiredLevel !== undefined && level < game.requiredLevel;

          return (
            <div
              key={game.type}
              style={cardStyle(game.color, game.colorDark)}
              onClick={() => !isLocked && startMinigame(game.type)}
              onMouseEnter={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 8px 0 ${game.colorDark}, 0 14px 24px rgba(0,0,0,0.25)`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = `0 5px 0 ${game.colorDark}, 0 8px 16px rgba(0,0,0,0.2)`;
              }}
            >
              {/* Locked overlay */}
              {isLocked && (
                <div style={lockedOverlayStyle}>
                  <PadlockIcon />
                  <div style={lockedTextStyle}>Level {game.requiredLevel}</div>
                </div>
              )}

              {/* Top: Scene icon */}
              <div style={cardTopStyle(game.color)}>
                <Scene />
              </div>

              {/* Bottom: Info */}
              <div style={cardBottomStyle}>
                <div style={starsRowStyle}>
                  <div style={cardTitleStyle}>{game.name}</div>
                  <StarRating filled={stars} />
                </div>
                <p style={cardDescStyle}>{game.description}</p>
                <Button
                  variant="primary"
                  size="small"
                  fullWidth
                  disabled={isLocked}
                  style={{
                    background: `linear-gradient(180deg, ${game.color} 0%, ${game.colorDark} 100%)`,
                    borderBottomColor: game.colorDark,
                  }}
                >
                  Hrát
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button onClick={() => setScreen('farm')} variant="secondary" size="medium">
          ← Zpět na farmu
        </Button>
      </div>
    </div>
  );
}
