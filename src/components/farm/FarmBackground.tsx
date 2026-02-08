import { CSSProperties } from 'react';

export function FarmBackground() {
  const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
    background: 'linear-gradient(180deg, #7EC8E3 0%, #A8D8EA 40%, #C5E8F7 70%, #7CB342 71%, #6DAE35 100%)',
  };

  return (
    <div style={containerStyle}>
      <svg
        viewBox="0 0 1024 400"
        preserveAspectRatio="xMidYMin slice"
        style={{ width: '100%', height: '60%', position: 'absolute', top: 0 }}
      >
        <defs>
          <radialGradient id="sky-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#FFF176" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFF176" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sun with warm rays */}
        <circle cx="900" cy="80" r="100" fill="url(#sky-sun-glow)" />
        <circle cx="900" cy="80" r="35" fill="#FFF176" opacity="0.4" />
        <circle cx="900" cy="80" r="24" fill="#FFEE58" opacity="0.5" />
        {/* Rotating sun rays */}
        <g opacity="0.1">
          <animateTransform attributeName="transform" type="rotate" from="0 900 80" to="360 900 80" dur="120s" repeatCount="indefinite" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <line key={angle} x1="900" y1="80" x2={900 + Math.cos(angle * Math.PI / 180) * 160} y2={80 + Math.sin(angle * Math.PI / 180) * 160} stroke="#FFD54F" strokeWidth="6" />
          ))}
        </g>

        {/* Cloud layer 1 - far/slow */}
        <g opacity="0.4">
          <animateTransform attributeName="transform" type="translate" values="0,0;80,0;0,0" dur="120s" repeatCount="indefinite" />
          <ellipse cx="120" cy="50" rx="50" ry="18" fill="white" />
          <ellipse cx="155" cy="45" rx="35" ry="14" fill="white" />
          <ellipse cx="650" cy="40" rx="40" ry="15" fill="white" />
          <ellipse cx="680" cy="35" rx="30" ry="12" fill="white" />
        </g>

        {/* Cloud layer 2 - mid/medium */}
        <g opacity="0.6">
          <animateTransform attributeName="transform" type="translate" values="0,0;60,0;0,0" dur="80s" repeatCount="indefinite" />
          <ellipse cx="180" cy="100" rx="70" ry="28" fill="white" />
          <ellipse cx="230" cy="92" rx="55" ry="22" fill="white" />
          <ellipse cx="140" cy="105" rx="45" ry="18" fill="white" />
        </g>

        {/* Cloud layer 3 - near/fast */}
        <g opacity="0.7">
          <animateTransform attributeName="transform" type="translate" values="0,0;-50,0;0,0" dur="50s" repeatCount="indefinite" />
          <ellipse cx="550" cy="65" rx="60" ry="26" fill="white" />
          <ellipse cx="600" cy="58" rx="50" ry="20" fill="white" />
          <ellipse cx="510" cy="70" rx="40" ry="16" fill="white" />
        </g>
        <g opacity="0.5">
          <animateTransform attributeName="transform" type="translate" values="0,0;40,0;0,0" dur="65s" repeatCount="indefinite" />
          <ellipse cx="800" cy="130" rx="50" ry="20" fill="white" />
          <ellipse cx="840" cy="122" rx="40" ry="16" fill="white" />
          <ellipse cx="770" cy="135" rx="35" ry="13" fill="white" />
        </g>
      </svg>
    </div>
  );
}
