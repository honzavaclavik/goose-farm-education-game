import { CSSProperties, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const contentStyle: CSSProperties = {
    background: 'white',
    borderRadius: '20px',
    padding: '24px',
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    animation: 'modalIn 0.2s ease',
  };

  const closeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px',
    lineHeight: 1,
  };

  const titleStyle: CSSProperties = {
    margin: '0 0 16px 0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>
          ×
        </button>
        {title && <h2 style={titleStyle}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
