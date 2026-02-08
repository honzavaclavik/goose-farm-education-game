import { useRegisterSW } from 'virtual:pwa-register/react';
import { CSSProperties } from 'react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      // Check for updates every 60 seconds
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 1000);
      }
      console.log('SW registered:', swUrl);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  const bannerStyle: CSSProperties = {
    position: 'fixed',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(30, 20, 10, 0.95)',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    border: '2px solid var(--color-gold)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'slideUp 0.3s ease-out',
  };

  const buttonStyle: CSSProperties = {
    background: 'linear-gradient(180deg, #66bb6a 0%, #43a047 100%)',
    color: 'white',
    border: '2px solid #2e7d32',
    borderRadius: '8px',
    padding: '6px 16px',
    fontSize: '13px',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-bold)',
    cursor: 'pointer',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <div style={bannerStyle}>
        <span>Nová verze od Daddy Piga!</span>
        <button style={buttonStyle} onClick={() => updateServiceWorker(true)}>
          Aktualizovat
        </button>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
