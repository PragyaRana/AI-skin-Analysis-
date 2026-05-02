import { useEffect, useState } from 'react';

const getColor = (score) => {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#C8976E';
  return '#C9607B';
};

export default function ScoreRing({ score = 0, label, size = 96 }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - 14) / 2;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (animated / 100) * circ;
  const color  = getColor(score);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 8 }}>
      <div style={{ position:'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke="#F5E0D8" strokeWidth={7}
          />
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div style={{
          position:'absolute', inset:0, display:'flex',
          alignItems:'center', justifyContent:'center',
        }}>
          <span style={{
            fontFamily:"'Playfair Display',serif",
            fontSize: size > 80 ? 20 : 15, fontWeight: 700, color,
          }}>
            {animated}
          </span>
        </div>
      </div>
      <span style={{ fontSize: 12, color:'var(--muted)', fontWeight:500, textAlign:'center' }}>
        {label}
      </span>
    </div>
  );
}
