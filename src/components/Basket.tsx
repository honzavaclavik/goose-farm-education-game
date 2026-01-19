interface BasketProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function Basket({ x, y, width, height }: BasketProps) {
  return (
    <div
      className="basket"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        fontSize: height * 0.8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      🪹
    </div>
  );
}
