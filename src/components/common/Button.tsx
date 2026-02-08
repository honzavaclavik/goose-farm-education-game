import { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

const variantColors: Record<string, { bg: string; bgHover: string; depth: string }> = {
  primary: {
    bg: 'linear-gradient(180deg, #66bb6a 0%, #43a047 100%)',
    bgHover: 'linear-gradient(180deg, #72c576 0%, #4caf50 100%)',
    depth: '#2e7d32',
  },
  secondary: {
    bg: 'linear-gradient(180deg, var(--color-wood-light) 0%, var(--color-wood-mid) 100%)',
    bgHover: 'linear-gradient(180deg, #d4a463 0%, var(--color-wood-light) 100%)',
    depth: 'var(--color-wood-dark)',
  },
  success: {
    bg: 'linear-gradient(180deg, #81c784 0%, #4caf50 100%)',
    bgHover: 'linear-gradient(180deg, #8fd692 0%, #5cb860 100%)',
    depth: '#2e7d32',
  },
  danger: {
    bg: 'linear-gradient(180deg, #ef5350 0%, #d32f2f 100%)',
    bgHover: 'linear-gradient(180deg, #f06360 0%, #e33b3b 100%)',
    depth: '#b71c1c',
  },
  warning: {
    bg: 'linear-gradient(180deg, #ffb74d 0%, #f57c00 100%)',
    bgHover: 'linear-gradient(180deg, #ffc370 0%, #ff8f00 100%)',
    depth: '#e65100',
  },
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const colors = variantColors[variant];

  const sizeStyles: Record<string, CSSProperties> = {
    small: {
      padding: '8px 18px',
      fontSize: 'var(--text-sm)',
    },
    medium: {
      padding: '12px 24px',
      fontSize: 'var(--text-base)',
    },
    large: {
      padding: '16px 32px',
      fontSize: 'var(--text-xl)',
    },
  };

  const buttonStyle: CSSProperties = {
    position: 'relative',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'white',
    background: colors.bg,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    overflow: 'hidden',
    textShadow: 'var(--text-outline-dark)',
    borderBottom: `4px solid ${colors.depth}`,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.25)',
    letterSpacing: '0.3px',
    ...sizeStyles[size],
    ...style,
  };

  const glossyOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      whileHover={disabled ? undefined : {
        y: -2,
        transition: { type: 'spring', stiffness: 400, damping: 15 },
      }}
      whileTap={disabled ? undefined : {
        y: 2,
        scale: 0.97,
        transition: { type: 'spring', stiffness: 400, damping: 15 },
      }}
    >
      <div style={glossyOverlayStyle} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  );
}
