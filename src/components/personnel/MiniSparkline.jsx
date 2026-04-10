import { GRADE_COLORS, GRADE_NUM } from '../../data/personnelData';

export default function MiniSparkline({
  data = [],
  width = 80,
  height = 24,
}) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '10px',
        }}
      >
        데이터 없음
      </div>
    );
  }

  const padding = 4;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  // Normalize y values (1-7 for grades)
  const minY = 1;
  const maxY = 7;
  const points = data.map((d, idx) => {
    const x = (idx / Math.max(data.length - 1, 1)) * innerWidth + padding;
    const yNorm = (d.y || GRADE_NUM[d.g] || 1 - minY) / (maxY - minY);
    const y = height - (yNorm * innerHeight + padding);
    return { x, y, grade: d.g };
  });

  // Build polyline
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      width={width}
      height={height}
      style={{ display: 'block' }}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Grid line at center */}
      <line
        x1={padding}
        y1={height / 2}
        x2={width - padding}
        y2={height / 2}
        stroke="var(--divider)"
        strokeWidth="0.5"
        strokeDasharray="2,2"
        opacity="0.3"
      />

      {/* Polyline */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />

      {/* Dots */}
      {points.map((p, idx) => (
        <circle
          key={idx}
          cx={p.x}
          cy={p.y}
          r="2"
          fill={GRADE_COLORS[p.grade] || 'var(--accent)'}
          stroke="#fff"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
