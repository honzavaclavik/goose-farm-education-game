import { CSSProperties, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const baseStyle: CSSProperties = {
    position: 'relative',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    fontWeight: 'var(--font-bold)',
    transition: 'all var(--transition-base)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    overflow: 'hidden',
  };

  const sizeStyles: Record<string, CSSProperties> = {
    small: {
      padding: '10px 20px',
      fontSize: 'var(--text-sm)',
      boxShadow: 'var(--shadow-sm)',
    },
    medium: {
      padding: '14px 28px',
      fontSize: 'var(--text-base)',
      boxShadow: 'var(--shadow-md)',
    },
    large: {
      padding: '18px 36px',
      fontSize: 'var(--text-xl)',
      boxShadow: 'var(--shadow-lg)',
    },
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
      color: 'var(--color-white)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
    },
    secondary: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #dfe6e9 100%)',
      color: 'var(--color-text-primary)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
    },
    success: {
      background: 'linear-gradient(135deg, var(--color-success) 0%, #4caf50 100%)',
      color: 'var(--color-white)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
    },
    danger: {
      background: 'linear-gradient(135deg, var(--color-danger) 0%, var(--color-danger-hover) 100%)',
      color: 'var(--color-white)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
    },
    warning: {
      background: 'linear-gradient(135deg, var(--color-warning) 0%, var(--color-secondary) 100%)',
      color: 'var(--color-white)',
      boxShadow: `${sizeStyles[size].boxShadow}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
    },
  };

  const glossyOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = sizeStyles[size].boxShadow as string;
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
    >
      <div style={glossyOverlayStyle} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}
