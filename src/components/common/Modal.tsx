import { CSSProperties, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 'var(--space-4)',
    animation: 'fadeIn var(--transition-base) ease',
  };

  const modalStyle: CSSProperties = {
    background: 'var(--texture-parchment)',
    borderRadius: 'var(--radius-lg)',
    border: 'var(--border-gold-frame)',
    boxShadow: '0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    animation: 'slideInUp var(--transition-slow) ease',
  };

  const headerStyle: CSSProperties = {
    padding: 'var(--space-4) var(--space-6)',
    background: 'var(--texture-wood)',
    borderBottom: '2px solid var(--color-wood-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 'var(--radius-lg)',
    borderTopRightRadius: 'var(--radius-lg)',
  };

  const titleStyle: CSSProperties = {
    fontSize: 'var(--text-2xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    color: 'white',
    textShadow: 'var(--text-outline-dark)',
    margin: 0,
  };

  const closeButtonStyle: CSSProperties = {
    background: 'var(--color-wood-dark)',
    border: '2px solid var(--color-wood-border)',
    borderRadius: 'var(--radius-full)',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 'var(--text-base)',
    color: 'var(--color-parchment)',
    transition: 'all var(--transition-base)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.2)',
  };

  const contentStyle: CSSProperties = {
    padding: 'var(--space-6)',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div style={headerStyle}>
            <h2 style={titleStyle}>{title}</h2>
            <button
              style={closeButtonStyle}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8b5e3c';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-wood-dark)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
}
