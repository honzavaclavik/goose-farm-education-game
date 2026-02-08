import { CSSProperties } from 'react';
import { useGiphy } from '../../hooks/useGiphy';

interface GiphyGifProps {
  tag: string;
  fallbackEmoji: string;
  size?: 'small' | 'large';
}

export function GiphyGif({ tag, fallbackEmoji, size = 'small' }: GiphyGifProps) {
  const { gifUrl, isLoading } = useGiphy(tag);

  const maxW = size === 'large' ? '400px' : '300px';
  const emojiSize = size === 'large' ? '80px' : '56px';

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    margin: '8px 0',
  };

  const frameStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #FFF8E1 0%, #F5E6C8 50%, #EDD9A3 100%)',
    border: '2px solid #C8A96E',
    borderRadius: 'var(--radius-lg, 12px)',
    padding: '6px',
    maxWidth: maxW,
    boxShadow: '0 2px 8px rgba(139,109,56,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
  };

  const imgStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    borderRadius: 'var(--radius-md, 8px)',
  };


  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ ...frameStyle, padding: '20px 30px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', animation: 'giphySpin 1s linear infinite', display: 'inline-block' }}>
            ⏳
          </span>
        </div>
        <style>{`
          @keyframes giphySpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!gifUrl) {
    return (
      <div style={containerStyle}>
        <div style={{ ...frameStyle, padding: '12px 20px', textAlign: 'center' }}>
          <span style={{ fontSize: emojiSize, display: 'inline-block', animation: 'giphyBounce 0.6s ease infinite alternate' }}>
            {fallbackEmoji}
          </span>
        </div>
        <style>{`
          @keyframes giphyBounce {
            0% { transform: scale(1) translateY(0); }
            100% { transform: scale(1.15) translateY(-6px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={frameStyle}>
        <img src={gifUrl} alt={tag} style={imgStyle} />
      </div>
    </div>
  );
}
