import { CSSProperties } from 'react';
import { Button } from '../common/Button';
import { useGameStore } from '../../store/gameStore';
import type { MinigameType, ExerciseCategory } from '../../types/farm';

interface MinigameInfo {
  type: MinigameType;
  name: string;
  description: string;
  category: ExerciseCategory;
  emoji: string;
  color: string;
}

const minigames: MinigameInfo[] = [
  {
    type: 'eggNest',
    name: 'Vejce v hnízdě',
    description: 'I/Y po měkkých a tvrdých souhláskách',
    category: 'softHardIY',
    emoji: '🥚',
    color: '#FFD54F',
  },
  {
    type: 'gooseMarch',
    name: 'Husí pochod',
    description: 'Předpony vz/z/s',
    category: 'prefixes',
    emoji: '🪿',
    color: '#81C784',
  },
  {
    type: 'flockFlight',
    name: 'Přelet hejna',
    description: 'Vyjmenovaná slova',
    category: 'declaredWords',
    emoji: '🦆',
    color: '#64B5F6',
  },
  {
    type: 'fenceBuilder',
    name: 'Stavba plotu',
    description: 'Délka samohlásek',
    category: 'vowelLength',
    emoji: '🏗️',
    color: '#A1887F',
  },
  {
    type: 'gooseDetective',
    name: 'Husí detektiv',
    description: 'Najdi chybu ve větě',
    category: 'sentences',
    emoji: '🔍',
    color: '#9575CD',
  },
  {
    type: 'fractionFarm',
    name: 'Zlomková farma',
    description: 'Zlomky pro 5. třídu',
    category: 'fractions',
    emoji: '🧮',
    color: '#42A5F5',
  },
];

export function MinigameSelector() {
  const { setScreen, startMinigame } = useGameStore();

  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    padding: 'var(--space-6)',
    background: 'linear-gradient(180deg, var(--color-sky-start) 0%, var(--color-grass-end) 100%)',
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: 'var(--space-8)',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'var(--text-4xl)',
    fontWeight: 'var(--font-extrabold)',
    color: 'white',
    textShadow: '3px 3px 0 rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.3)',
    marginBottom: 'var(--space-4)',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 'var(--space-5)',
    maxWidth: '1200px',
    margin: '0 auto var(--space-8)',
  };

  const cardStyle = (): CSSProperties => ({
    background: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-2xl)',
    padding: 'var(--space-6)',
    boxShadow: 'var(--shadow-xl)',
    cursor: 'pointer',
    transition: 'all var(--transition-base)',
    position: 'relative',
    overflow: 'hidden',
    border: '3px solid white',
  });

  const cardIconStyle: CSSProperties = {
    fontSize: '64px',
    marginBottom: 'var(--space-3)',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
    animation: 'float 3s ease-in-out infinite',
  };

  const cardTitleStyle: CSSProperties = {
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)',
  };

  const cardDescStyle: CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
    marginBottom: 'var(--space-4)',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>📚 Procvičování</h1>
      </div>

      <div style={gridStyle}>
        {minigames.map((game) => (
          <div
            key={game.type}
            style={cardStyle()}
            onClick={() => startMinigame(game.type)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl), 0 0 30px rgba(76, 175, 80, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
          >
            <div style={cardIconStyle}>{game.emoji}</div>
            <div style={cardTitleStyle}>{game.name}</div>
            <p style={cardDescStyle}>{game.description}</p>
            <Button variant="primary" size="small" fullWidth>
              Hrát
            </Button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button onClick={() => setScreen('farm')} variant="secondary" size="medium">
          ← Zpět na farmu
        </Button>
      </div>
    </div>
  );
}
