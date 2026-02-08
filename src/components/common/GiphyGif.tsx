import { CSSProperties } from 'react';
import { useRandomGif } from '../../hooks/useGiphy';

interface GiphyGifProps {
  /** Direct URL to display. If omitted, picks a random one. */
  url?: string;
  /** @deprecated No longer used, kept for API compat */
  tag?: string;
  /** @deprecated No longer used */
  fallbackEmoji?: string;
  size?: 'small' | 'large';
}

export function GiphyGif({ url, size = 'small' }: GiphyGifProps) {
  const randomUrl = useRandomGif();
  const gifUrl = url ?? randomUrl;

  const maxW = size === 'large' ? '400px' : '300px';

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

  return (
    <div style={containerStyle}>
      <div style={frameStyle}>
        <img src={gifUrl} alt="GIF" style={imgStyle} />
      </div>
    </div>
  );
}
