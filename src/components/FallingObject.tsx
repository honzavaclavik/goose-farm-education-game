interface FallingObjectProps {
  emoji: string;
  x: number;
  y: number;
  size: number;
}

export default function FallingObject({ emoji, x, y, size }: FallingObjectProps) {
  return (
    <div
      className="falling-object"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        fontSize: size * 0.8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {emoji}
    </div>
  );
}
