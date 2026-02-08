import { CSSProperties, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrencyStore } from '../../store/currencyStore';

const WheatIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <g fill="#c9935a" stroke="#8b6914" strokeWidth="0.5">
      <ellipse cx="12" cy="4" rx="2.5" ry="3.5" fill="#daa520" />
      <ellipse cx="8" cy="7" rx="2" ry="3" fill="#daa520" transform="rotate(-20 8 7)" />
      <ellipse cx="16" cy="7" rx="2" ry="3" fill="#daa520" transform="rotate(20 16 7)" />
      <ellipse cx="9" cy="11" rx="1.8" ry="2.5" fill="#daa520" transform="rotate(-15 9 11)" />
      <ellipse cx="15" cy="11" rx="1.8" ry="2.5" fill="#daa520" transform="rotate(15 15 11)" />
    </g>
    <line x1="12" y1="7" x2="12" y2="23" stroke="#8b6914" strokeWidth="1.5" />
  </svg>
);

const EggIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <ellipse cx="12" cy="13" rx="7" ry="9" fill="#fef3e0" stroke="#d4a463" strokeWidth="1" />
    <ellipse cx="10" cy="10" rx="3" ry="4" fill="rgba(255,255,255,0.5)" />
  </svg>
);

const FeatherIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M12 2 C8 6, 6 10, 8 16 C10 14, 12 10, 12 2Z" fill="#b39ddb" stroke="#7e57c2" strokeWidth="0.5" />
    <path d="M12 2 C16 6, 18 10, 16 16 C14 14, 12 10, 12 2Z" fill="#ce93d8" stroke="#7e57c2" strokeWidth="0.5" />
    <line x1="12" y1="2" x2="12" y2="22" stroke="#7e57c2" strokeWidth="1" />
  </svg>
);

interface FloatingDelta {
  id: number;
  value: number;
}

function AnimatedValue({ value }: { value: number }) {
  const prevRef = useRef(value);
  const [deltas, setDeltas] = useState<FloatingDelta[]>([]);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev !== value && prev !== 0) {
      const diff = value - prev;
      const id = Date.now();
      setDeltas((d) => [...d, { id, value: diff }]);
      setTimeout(() => setDeltas((d) => d.filter((delta) => delta.id !== id)), 900);
    }
    prevRef.current = value;
  }, [value]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <motion.span
        key={value}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
      >
        {value}
      </motion.span>
      <AnimatePresence>
        {deltas.map((delta) => (
          <motion.span
            key={delta.id}
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{ opacity: 0, y: -20, x: delta.value > 0 ? 8 : -8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '-2px',
              left: '100%',
              marginLeft: '4px',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-extrabold)',
              color: delta.value > 0 ? '#4CAF50' : '#F44336',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {delta.value > 0 ? '+' : ''}{delta.value}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

export function CurrencyDisplay() {
  const { grain, eggs, feathers } = useCurrencyStore();

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: 'var(--space-2)',
    flexWrap: 'wrap',
  };

  const badgeStyle: CSSProperties = {
    background: 'var(--texture-wood)',
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 'var(--font-extrabold)',
    fontSize: 'var(--text-sm)',
    color: 'white',
    textShadow: 'var(--text-outline-brown)',
    boxShadow: 'var(--shadow-wood-panel)',
    border: '2px solid var(--color-wood-border)',
    minWidth: '72px',
  };

  const Badge = ({ icon, value }: { icon: React.ReactNode; value: number }) => (
    <div style={badgeStyle}>
      {icon}
      <AnimatedValue value={value} />
    </div>
  );

  return (
    <div style={containerStyle}>
      <Badge icon={<WheatIcon />} value={grain} />
      <Badge icon={<EggIcon />} value={eggs} />
      <Badge icon={<FeatherIcon />} value={feathers} />
    </div>
  );
}
