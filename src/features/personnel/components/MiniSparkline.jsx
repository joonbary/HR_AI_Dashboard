import { GRADE_COLORS, GRADE_NUM } from '../data/personnelData';

/**
 * 평가 추이 스파크라인 — 기초등급 + 최종등급 표시
 * history: [{ y, base, final }]
 */
export default function MiniSparkline({ history = [], width = 120, height = 32 }) {
  if (!history.length) return null;

  const pad = 4;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;
  const step = history.length > 1 ? plotW / (history.length - 1) : 0;

  const toY = (grade) => {
    const num = GRADE_NUM[grade] || 3;
    return plotH - ((num - 1) / 6) * plotH + pad;
  };

  const points = history.map((h, i) => ({
    x: pad + i * step,
    yFinal: toY(h.final),
    yBase: toY(h.base),
    year: h.y,
    base: h.base,
    final: h.final,
  }));

  // Final grade line
  const lineFinal = points.map((p) => `${p.x},${p.yFinal}`).join(' ');
  // Base grade line (dashed)
  const lineBase = points.map((p) => `${p.x},${p.yBase}`).join(' ');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Base grade line (dashed, faint) */}
        <polyline
          points={lineBase} fill="none"
          stroke="var(--divider)" strokeWidth="1" strokeDasharray="2,2"
        />
        {/* Final grade line */}
        <polyline
          points={lineFinal} fill="none"
          stroke="var(--accent)" strokeWidth="1.5"
        />
        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.yFinal} r="3"
              fill={GRADE_COLORS[p.final] || 'var(--accent)'}
              stroke="#fff" strokeWidth="1"
            />
          </g>
        ))}
      </svg>
      <div style={{ fontSize: '9px', color: 'var(--text-muted)', lineHeight: '1.2' }}>
        {history.map((h) => `${String(h.y).slice(2)}: ${h.final}`).join(' → ')}
      </div>
    </div>
  );
}