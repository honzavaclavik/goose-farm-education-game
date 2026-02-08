import { CSSProperties, useState } from 'react';
import { Button } from '../common/Button';
import { CurrencyDisplay } from '../common/CurrencyDisplay';
import { Modal } from '../common/Modal';
import { WoodPanel } from '../common/WoodPanel';
import { useGameStore } from '../../store/gameStore';
import { useFarmStore } from '../../store/farmStore';
import { useCurrencyStore } from '../../store/currencyStore';
import { useSound } from '../../hooks/useSound';
import type { Goose, Building, GooseRarity, BuildingType } from '../../types/farm';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'eggs' | 'feathers';
  type: 'goose' | 'building';
  rarity?: GooseRarity;
  buildingType?: BuildingType;
  category: 'geese' | 'buildings';
}

const shopItems: ShopItem[] = [
  {
    id: 'goose-common',
    name: 'Bílá husa',
    description: '+10% bonus k odměnám',
    price: 20,
    currency: 'eggs',
    type: 'goose',
    rarity: 'common',
    category: 'geese',
  },
  {
    id: 'goose-rare',
    name: 'Labuť',
    description: '+20% bonus k odměnám',
    price: 50,
    currency: 'eggs',
    type: 'goose',
    rarity: 'rare',
    category: 'geese',
  },
  {
    id: 'goose-epic',
    name: 'Kachna',
    description: '+30% bonus, +1 peří',
    price: 100,
    currency: 'eggs',
    type: 'goose',
    rarity: 'epic',
    category: 'geese',
  },
  {
    id: 'goose-legendary',
    name: 'Páv',
    description: '+50% bonus, +2 peří',
    price: 25,
    currency: 'feathers',
    type: 'goose',
    rarity: 'legendary',
    category: 'geese',
  },
  {
    id: 'building-coop',
    name: 'Nový kurník',
    description: '+3 místa pro husy = více bonusů!',
    price: 75,
    currency: 'eggs',
    type: 'building',
    buildingType: 'coop',
    category: 'buildings',
  },
  {
    id: 'building-field',
    name: 'Obilné pole',
    description: '+10 zrní/min pro krmení',
    price: 60,
    currency: 'eggs',
    type: 'building',
    buildingType: 'field',
    category: 'buildings',
  },
];

/* ── Mini SVG Icons ── */

function MiniGooseSVG({ rarity }: { rarity?: GooseRarity }) {
  const bodyColor = rarity === 'epic' ? '#5D8C3E' : rarity === 'legendary' ? '#1565C0' : '#F5F5F5';
  const headColor = rarity === 'epic' ? '#6D9C4E' : rarity === 'legendary' ? '#1976D2' : '#FAFAFA';
  const beakColor = rarity === 'legendary' ? '#FFD54F' : '#FF8F00';
  const accentColor = rarity === 'rare' ? '#E0E0E0' : rarity === 'epic' ? '#8BC34A' : rarity === 'legendary' ? '#42A5F5' : 'none';

  return (
    <svg viewBox="0 0 64 64" width="64" height="64">
      {/* Body */}
      <ellipse cx="32" cy="40" rx="18" ry="14" fill={bodyColor} stroke="#BDBDBD" strokeWidth="0.5" />
      {/* Wing */}
      <ellipse cx="38" cy="38" rx="10" ry="8" fill={accentColor !== 'none' ? accentColor : bodyColor}
        opacity="0.7" transform="rotate(-10 38 38)" />
      {/* Neck */}
      <path d="M22 34 Q18 24 20 16 Q22 12 26 14" fill={headColor} stroke="#BDBDBD" strokeWidth="0.5" />
      {/* Head */}
      <circle cx="22" cy="14" r="6" fill={headColor} stroke="#BDBDBD" strokeWidth="0.5" />
      {/* Eye */}
      <circle cx="20" cy="13" r="1.5" fill="#333" />
      <circle cx="19.5" cy="12.5" r="0.5" fill="white" />
      {/* Beak */}
      <path d="M16 15 L12 14 L16 13 Z" fill={beakColor} />
      {/* Tail */}
      <path d="M50 38 Q54 34 52 30" fill="none" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
      {/* Feet */}
      <path d="M26 52 L24 58 L20 56 M26 52 L28 58 L24 56" stroke={beakColor} strokeWidth="1.5" fill="none" />
      <path d="M38 52 L36 58 L32 56 M38 52 L40 58 L36 56" stroke={beakColor} strokeWidth="1.5" fill="none" />
      {/* Legendary crown */}
      {rarity === 'legendary' && (
        <g>
          <polygon points="16,8 18,4 20,7 22,3 24,7 26,4 28,8" fill="#FFD700" stroke="#FFA000" strokeWidth="0.5" />
          <rect x="17" y="8" width="10" height="2" fill="#FFD700" rx="0.5" />
        </g>
      )}
      {/* Rare sparkle */}
      {rarity === 'rare' && (
        <text x="44" y="20" fontSize="10" fill="#FFD700">✦</text>
      )}
    </svg>
  );
}

function MiniCoopSVG() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64">
      {/* Body */}
      <rect x="12" y="28" width="36" height="24" fill="#C9956A" rx="2" />
      {/* Planks */}
      <line x1="12" y1="34" x2="48" y2="34" stroke="#A07040" strokeWidth="0.5" opacity="0.5" />
      <line x1="12" y1="40" x2="48" y2="40" stroke="#A07040" strokeWidth="0.5" opacity="0.5" />
      <line x1="12" y1="46" x2="48" y2="46" stroke="#A07040" strokeWidth="0.5" opacity="0.5" />
      {/* Side */}
      <polygon points="48,28 60,22 60,46 48,52" fill="#A07040" />
      {/* Roof */}
      <polygon points="8,28 52,28 64,20 20,20" fill="#8D6E63" />
      <polygon points="52,28 64,20 64,22 52,30" fill="#6D4C41" />
      {/* Door */}
      <rect x="25" y="38" width="10" height="14" fill="#4A2E14" rx="1" />
      {/* Window */}
      <rect x="14" y="30" width="8" height="6" fill="#4A3520" rx="0.5" />
      {/* Nesting boxes */}
      <rect x="50" y="26" width="8" height="10" fill="#8B6030" stroke="#6D4C41" strokeWidth="0.5" />
      <line x1="54" y1="26" x2="54" y2="36" stroke="#6D4C41" strokeWidth="0.5" />
      {/* Egg */}
      <ellipse cx="52" cy="33" rx="1.5" ry="2" fill="#FFF8E1" />
      {/* Straw */}
      <ellipse cx="30" cy="54" rx="10" ry="2" fill="#E8C56D" opacity="0.6" />
    </svg>
  );
}

function MiniFieldSVG() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64">
      {/* Soil */}
      <polygon points="32,16 56,32 32,48 8,32" fill="#6D4C41" />
      <polygon points="8,32 32,48 32,52 8,36" fill="#5D3C31" />
      <polygon points="56,32 32,48 32,52 56,36" fill="#4E342E" />
      {/* Wheat stalks */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 22 + col * 10 + row * 3;
        const y = 24 + row * 8;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y - 10} stroke="#7CB342" strokeWidth="1" />
            <ellipse cx={x} cy={y - 12} rx="2" ry="4" fill="#FFD54F" />
          </g>
        );
      })}
      {/* Fence */}
      <line x1="12" y1="28" x2="28" y2="20" stroke="#A1887F" strokeWidth="1.5" />
      <line x1="36" y1="20" x2="52" y2="28" stroke="#A1887F" strokeWidth="1.5" />
      {/* Posts */}
      <rect x="11" y="25" width="2" height="8" fill="#8D6E63" />
      <rect x="51" y="25" width="2" height="8" fill="#8D6E63" />
    </svg>
  );
}

function ShopItemIcon({ item }: { item: ShopItem }) {
  if (item.type === 'goose') {
    return <MiniGooseSVG rarity={item.rarity} />;
  }
  if (item.buildingType === 'coop') {
    return <MiniCoopSVG />;
  }
  return <MiniFieldSVG />;
}

/* ── Currency SVG Icons ── */

function EggIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size}>
      <ellipse cx="8" cy="9" rx="5.5" ry="6.5" fill="#FFF8E1" stroke="#FFE082" strokeWidth="1" />
      <ellipse cx="7" cy="7" rx="2" ry="2.5" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

function FeatherIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size}>
      <path d="M8 2 Q12 6 10 14 Q8 10 6 14 Q4 6 8 2Z" fill="#90CAF9" stroke="#64B5F6" strokeWidth="0.5" />
      <line x1="8" y1="3" x2="8" y2="14" stroke="#42A5F5" strokeWidth="0.5" />
    </svg>
  );
}

export function Shop() {
  const { setScreen } = useGameStore();
  const { addGoose, addBuilding, geese, getGooseCapacity } = useFarmStore();
  const { eggs, feathers, spendEggs, spendFeathers } = useCurrencyStore();
  const { play } = useSound();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'geese' | 'buildings'>('geese');

  const capacity = getGooseCapacity();
  const canAddGoose = geese.length < capacity;

  const filteredItems = shopItems.filter((item) => item.category === activeTab);

  const handlePurchase = (item: ShopItem) => {
    const hasEnough =
      item.currency === 'eggs' ? eggs >= item.price : feathers >= item.price;

    if (!hasEnough) {
      play('wrong');
      setMessage(`Nemáš dost ${item.currency === 'eggs' ? 'vajec' : 'peří'}!`);
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    if (item.type === 'goose' && !canAddGoose) {
      play('wrong');
      setMessage('Kurník je plný! Kup si nový kurník.');
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    const success =
      item.currency === 'eggs'
        ? spendEggs(item.price)
        : spendFeathers(item.price);

    if (!success) return;

    play('purchase');

    if (item.type === 'goose' && item.rarity) {
      const newGoose: Goose = {
        id: `goose-${Date.now()}`,
        name: item.name,
        rarity: item.rarity,
        eggProduction: getEggProduction(item.rarity),
        featherBonus: getFeatherBonus(item.rarity),
        purchasePrice: item.price,
        unlocked: true,
      };
      addGoose(newGoose);
      setMessage(`${item.name} se připojila k farmě!`);
    } else if (item.type === 'building' && item.buildingType) {
      const newBuilding: Building = {
        id: `building-${Date.now()}`,
        type: item.buildingType,
        name: item.name,
        level: 1,
        maxLevel: 5,
        effect: getBuildingEffect(item.buildingType),
        upgradeCost: Math.floor(item.price * 0.5),
        purchasePrice: item.price,
      };
      addBuilding(newBuilding);
      setMessage(`${item.name} byla postavena!`);
    }

    setTimeout(() => setMessage(null), 2000);
    setSelectedItem(null);
  };

  /* ── Styles ── */

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: `
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 28px,
        rgba(0, 0, 0, 0.06) 28px,
        rgba(0, 0, 0, 0.06) 30px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 5px,
        rgba(0, 0, 0, 0.02) 5px,
        rgba(0, 0, 0, 0.02) 6px
      ),
      radial-gradient(ellipse at 50% 0%, rgba(255, 180, 80, 0.15) 0%, transparent 60%),
      linear-gradient(180deg, #5a3e22 0%, #3a2515 100%)
    `,
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--space-4) var(--space-5)',
    background: 'var(--texture-wood)',
    borderBottom: '3px solid var(--color-wood-border)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    flexWrap: 'wrap',
    gap: '10px',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'var(--text-3xl)',
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--font-extrabold)',
    color: 'white',
    textShadow: 'var(--text-outline-dark)',
    margin: 0,
  };

  const tabBarStyle: CSSProperties = {
    display: 'flex',
    gap: '0',
    padding: 'var(--space-4) var(--space-5) 0',
  };

  const tabStyle = (isActive: boolean): CSSProperties => ({
    padding: 'var(--space-3) var(--space-6)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    fontSize: 'var(--text-base)',
    cursor: 'pointer',
    border: 'none',
    borderTopLeftRadius: 'var(--radius-md)',
    borderTopRightRadius: 'var(--radius-md)',
    borderBottom: 'none',
    color: isActive ? 'white' : 'var(--color-parchment-dark)',
    textShadow: isActive ? 'var(--text-outline-dark)' : 'none',
    background: isActive
      ? 'var(--texture-wood)'
      : `
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 18px,
          rgba(0, 0, 0, 0.04) 18px,
          rgba(0, 0, 0, 0.04) 19px
        ),
        linear-gradient(180deg, var(--color-wood-dark) 0%, #4a3520 100%)
      `,
    boxShadow: isActive
      ? 'var(--shadow-wood-panel), 0 2px 0 var(--color-wood-light)'
      : '0 2px 4px rgba(0,0,0,0.2)',
    borderTop: isActive ? '2px solid var(--color-wood-border)' : '2px solid #3a2515',
    borderLeft: isActive ? '2px solid var(--color-wood-border)' : '2px solid #3a2515',
    borderRight: isActive ? '2px solid var(--color-wood-border)' : '2px solid #3a2515',
    transition: 'all var(--transition-fast)',
    position: 'relative',
    zIndex: isActive ? 2 : 1,
    marginBottom: isActive ? '-2px' : '0',
  });

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: 'var(--space-4)',
    padding: 'var(--space-5)',
    flex: 1,
  };

  const cardStyle = (canAfford: boolean): CSSProperties => ({
    background: 'var(--texture-parchment)',
    borderRadius: 'var(--radius-md)',
    border: 'var(--border-gold-frame)',
    padding: 'var(--space-4)',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(90,62,34,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
    cursor: canAfford ? 'pointer' : 'not-allowed',
    opacity: canAfford ? 1 : 0.55,
    transition: 'all var(--transition-base)',
    position: 'relative',
    overflow: 'hidden',
  });

  const iconContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 'var(--space-2)',
    height: '72px',
  };

  const nameStyle: CSSProperties = {
    fontSize: 'var(--text-base)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--color-wood-dark)',
    marginBottom: 'var(--space-1)',
  };

  const descStyle: CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-stone-dark)',
    marginBottom: 'var(--space-3)',
    lineHeight: 1.3,
  };

  const ribbonStyle = (currency: 'eggs' | 'feathers'): CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: currency === 'eggs'
      ? 'linear-gradient(180deg, #FFB74D 0%, #F57C00 100%)'
      : 'linear-gradient(180deg, #CE93D8 0%, #8E24AA 100%)',
    color: 'white',
    padding: '5px 16px 5px 16px',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    textShadow: 'var(--text-outline-dark)',
    position: 'relative',
    clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  });

  const messageStyle: CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'var(--texture-parchment)',
    border: 'var(--border-gold-frame)',
    color: 'var(--color-wood-dark)',
    padding: '20px 40px',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-lg)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    zIndex: 1000,
    boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
    animation: 'fadeIn 0.3s ease',
    textAlign: 'center',
  };

  const confirmIconStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 'var(--space-4)',
    height: '80px',
  };

  const confirmNameStyle: CSSProperties = {
    margin: '0 0 var(--space-2) 0',
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-2xl)',
    color: 'var(--color-wood-dark)',
  };

  const confirmDescStyle: CSSProperties = {
    color: 'var(--color-stone-dark)',
    marginBottom: 'var(--space-5)',
    fontSize: 'var(--text-sm)',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Obchod</h1>
        <CurrencyDisplay />
      </div>

      {/* Category Tabs */}
      <div style={tabBarStyle}>
        <button
          style={tabStyle(activeTab === 'geese')}
          onClick={() => setActiveTab('geese')}
        >
          Husy
        </button>
        <button
          style={tabStyle(activeTab === 'buildings')}
          onClick={() => setActiveTab('buildings')}
        >
          Budovy
        </button>
      </div>

      {/* Grid */}
      <WoodPanel variant="dark" style={{
        margin: '0 var(--space-5) var(--space-5)',
        borderTopLeftRadius: 0,
        padding: 0,
      }}>
        <div style={gridStyle}>
          {filteredItems.map((item) => {
            const canAfford =
              item.currency === 'eggs' ? eggs >= item.price : feathers >= item.price;

            return (
              <div
                key={item.id}
                style={cardStyle(canAfford)}
                onClick={() => canAfford && setSelectedItem(item)}
                onMouseEnter={(e) => {
                  if (canAfford) {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(90,62,34,0.4), inset 0 1px 0 rgba(255,255,255,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(90,62,34,0.3), inset 0 1px 0 rgba(255,255,255,0.3)';
                }}
              >
                <div style={iconContainerStyle}>
                  <ShopItemIcon item={item} />
                </div>
                <div style={nameStyle}>{item.name}</div>
                <div style={descStyle}>{item.description}</div>
                <div style={ribbonStyle(item.currency)}>
                  {item.currency === 'eggs' ? <EggIcon /> : <FeatherIcon />}
                  {item.price}
                </div>
              </div>
            );
          })}
        </div>
      </WoodPanel>

      <div style={{ padding: '0 var(--space-5) var(--space-5)', textAlign: 'center' }}>
        <Button onClick={() => setScreen('farm')} variant="secondary" size="large">
          ← Zpět na farmu
        </Button>
      </div>

      {/* Purchase Confirmation Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Potvrdit nákup"
      >
        {selectedItem && (
          <div style={{ textAlign: 'center' }}>
            <div style={confirmIconStyle}>
              <ShopItemIcon item={selectedItem} />
            </div>
            <h3 style={confirmNameStyle}>{selectedItem.name}</h3>
            <p style={confirmDescStyle}>
              {selectedItem.description}
            </p>
            <div style={{ marginBottom: 'var(--space-5)', display: 'flex', justifyContent: 'center' }}>
              <div style={ribbonStyle(selectedItem.currency)}>
                {selectedItem.currency === 'eggs' ? <EggIcon /> : <FeatherIcon />}
                {selectedItem.price}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <Button onClick={() => handlePurchase(selectedItem)} variant="success">
                Koupit
              </Button>
              <Button onClick={() => setSelectedItem(null)} variant="secondary">
                Zrušit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {message && <div style={messageStyle}>{message}</div>}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}

function getEggProduction(rarity: GooseRarity): number {
  switch (rarity) {
    case 'common':
      return 1;
    case 'rare':
      return 2;
    case 'epic':
      return 3;
    case 'legendary':
      return 5;
  }
}

function getFeatherBonus(rarity: GooseRarity): number {
  switch (rarity) {
    case 'common':
      return 0;
    case 'rare':
      return 0;
    case 'epic':
      return 1;
    case 'legendary':
      return 2;
  }
}

function getBuildingEffect(type: BuildingType): number {
  switch (type) {
    case 'coop':
      return 3;
    case 'field':
      return 10;
    case 'mill':
      return 10;
    case 'market':
      return 5;
  }
}
