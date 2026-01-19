import { CSSProperties } from 'react';
import { Button } from '../common/Button';
import { CurrencyDisplay } from '../common/CurrencyDisplay';
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
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(180deg, #87ceeb 0%, #98fb98 100%)',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2e7d32',
    margin: 0,
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    flex: 1,
  };

  const cardStyle = (color: string): CSSProperties => ({
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    borderLeft: `6px solid ${color}`,
  });

  const cardTitleStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  };

  const cardDescStyle: CSSProperties = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  };

  const emojiStyle: CSSProperties = {
    fontSize: '32px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>📚 Procvičování</h1>
        <CurrencyDisplay compact />
      </div>

      <div style={gridStyle}>
        {minigames.map((game) => (
          <div
            key={game.type}
            style={cardStyle(game.color)}
            onClick={() => startMinigame(game.type)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
          >
            <div style={cardTitleStyle}>
              <span style={emojiStyle}>{game.emoji}</span>
              {game.name}
            </div>
            <p style={cardDescStyle}>{game.description}</p>
            <Button variant="primary" size="small">
              Hrát
            </Button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button onClick={() => setScreen('farm')} variant="secondary">
          ← Zpět na farmu
        </Button>
      </div>
    </div>
  );
}
