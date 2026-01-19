import { CSSProperties, useState } from 'react';
import { Button } from '../common/Button';
import { CurrencyDisplay } from '../common/CurrencyDisplay';
import { Modal } from '../common/Modal';
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
  emoji: string;
  type: 'goose' | 'building';
  rarity?: GooseRarity;
  buildingType?: BuildingType;
}

const shopItems: ShopItem[] = [
  {
    id: 'goose-common',
    name: 'Bílá husa',
    description: '+10% bonus k odměnám',
    price: 20,
    currency: 'eggs',
    emoji: '🪿',
    type: 'goose',
    rarity: 'common',
  },
  {
    id: 'goose-rare',
    name: 'Labuť',
    description: '+20% bonus k odměnám',
    price: 50,
    currency: 'eggs',
    emoji: '🦢',
    type: 'goose',
    rarity: 'rare',
  },
  {
    id: 'goose-epic',
    name: 'Kachna',
    description: '+30% bonus, +1 peří',
    price: 100,
    currency: 'eggs',
    emoji: '🦆',
    type: 'goose',
    rarity: 'epic',
  },
  {
    id: 'goose-legendary',
    name: 'Páv',
    description: '+50% bonus, +2 peří',
    price: 25,
    currency: 'feathers',
    emoji: '🦚',
    type: 'goose',
    rarity: 'legendary',
  },
  {
    id: 'building-coop',
    name: 'Nový kurník',
    description: '+3 místa pro husy = více bonusů!',
    price: 75,
    currency: 'eggs',
    emoji: '🏠',
    type: 'building',
    buildingType: 'coop',
  },
  {
    id: 'building-field',
    name: 'Obilné pole',
    description: '+10 zrní/min pro krmení',
    price: 60,
    currency: 'eggs',
    emoji: '🌾',
    type: 'building',
    buildingType: 'field',
  },
];

export function Shop() {
  const { setScreen } = useGameStore();
  const { addGoose, addBuilding, geese, getGooseCapacity } = useFarmStore();
  const { eggs, feathers, spendEggs, spendFeathers } = useCurrencyStore();
  const { play } = useSound();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const capacity = getGooseCapacity();
  const canAddGoose = geese.length < capacity;

  const handlePurchase = (item: ShopItem) => {
    // Kontrola měny
    const hasEnough =
      item.currency === 'eggs' ? eggs >= item.price : feathers >= item.price;

    if (!hasEnough) {
      play('wrong');
      setMessage(`Nemáš dost ${item.currency === 'eggs' ? 'vajec' : 'peří'}!`);
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Kontrola kapacity pro husy
    if (item.type === 'goose' && !canAddGoose) {
      play('wrong');
      setMessage('Kurník je plný! Kup si nový kurník.');
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Odečíst měnu
    const success =
      item.currency === 'eggs'
        ? spendEggs(item.price)
        : spendFeathers(item.price);

    if (!success) return;

    // Zvuk nákupu
    play('purchase');

    // Přidat položku
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
      setMessage(`${item.emoji} ${item.name} se připojila k farmě!`);
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
      setMessage(`${item.emoji} ${item.name} byla postavena!`);
    }

    setTimeout(() => setMessage(null), 2000);
    setSelectedItem(null);
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #fff8e1 0%, #ffe082 100%)',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.8)',
    flexWrap: 'wrap',
    gap: '10px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#e65100',
    margin: 0,
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
    padding: '20px',
    flex: 1,
  };

  const cardStyle = (canAfford: boolean): CSSProperties => ({
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    cursor: canAfford ? 'pointer' : 'not-allowed',
    opacity: canAfford ? 1 : 0.6,
    transition: 'transform 0.2s',
  });

  const emojiStyle: CSSProperties = {
    fontSize: '48px',
    marginBottom: '8px',
  };

  const nameStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  };

  const descStyle: CSSProperties = {
    fontSize: '12px',
    color: '#666',
    marginBottom: '12px',
  };

  const priceStyle = (currency: 'eggs' | 'feathers'): CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: currency === 'eggs' ? '#fff3e0' : '#f3e5f5',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: currency === 'eggs' ? '#e65100' : '#7b1fa2',
  });

  const messageStyle: CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '20px 40px',
    borderRadius: '16px',
    fontSize: '18px',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🛒 Obchod</h1>
        <CurrencyDisplay />
      </div>

      <div style={gridStyle}>
        {shopItems.map((item) => {
          const canAfford =
            item.currency === 'eggs' ? eggs >= item.price : feathers >= item.price;

          return (
            <div
              key={item.id}
              style={cardStyle(canAfford)}
              onClick={() => canAfford && setSelectedItem(item)}
              onMouseEnter={(e) => {
                if (canAfford) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={emojiStyle}>{item.emoji}</div>
              <div style={nameStyle}>{item.name}</div>
              <div style={descStyle}>{item.description}</div>
              <div style={priceStyle(item.currency)}>
                {item.currency === 'eggs' ? '🥚' : '🪶'} {item.price}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Button onClick={() => setScreen('farm')} variant="secondary" size="large">
          ← Zpět na farmu
        </Button>
      </div>

      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Potvrdit nákup"
      >
        {selectedItem && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {selectedItem.emoji}
            </div>
            <h3 style={{ margin: '0 0 8px 0' }}>{selectedItem.name}</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              {selectedItem.description}
            </p>
            <div style={{ ...priceStyle(selectedItem.currency), marginBottom: '20px' }}>
              {selectedItem.currency === 'eggs' ? '🥚' : '🪶'} {selectedItem.price}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
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
