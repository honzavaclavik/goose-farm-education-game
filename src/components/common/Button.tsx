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
    border: 'none',
    borderRadius: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const sizeStyles: Record<string, CSSProperties> = {
    small: { padding: '8px 16px', fontSize: '14px' },
    medium: { padding: '12px 24px', fontSize: '16px' },
    large: { padding: '16px 32px', fontSize: '20px' },
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    secondary: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      color: '#333',
    },
    success: {
      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      color: 'white',
    },
    danger: {
      background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
      color: 'white',
    },
    warning: {
      background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
      color: '#333',
    },
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
    >
      {children}
    </button>
  );
}
