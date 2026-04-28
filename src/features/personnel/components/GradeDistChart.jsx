import { GRADE_ORDER, GRADE_COLORS } from '../data/personnelData';

/**
 * 등급 분포 차트 — 참고 분포 가이드 + 조직평가 상한(권고) 라인 표시
 */
export default function GradeDistChart({ grades, candidates, refDist, orgLimit }) {
  const total = candidates.length;
  const distribution = {};
  GRADE_ORDER.forEach(g => { distribution[g] = 0; });
  candidates.forEach(c => {
    const g = grades[c.id] || c.finalGrade;
    distribution[g] = (distribution[g] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(distribution), 1);
  const barWidth = 36;
  const gap = 12;
  const chartWidth = GRADE_ORDER.length * (barWidth + gap);
  const chartHeight = 120;

  return (
    <svg width={chartWidth + 60} height={chartHeight + 60} viewBox={`0 0 ${chartWidth + 60} ${chartHeight + 60}`}>
      {/* Y axis labels */}
      {[0, Math.ceil(maxCount / 2), maxCount].map((v, i) => (
        <text key={i} x={28} y={chartHeight - (v / maxCount) * chartHeight + 14}
          textAnchor="end" fontSize="9" fill="var(--text-muted)">
          {v}
        </text>
      ))}

      {GRADE_ORDER.map((grade, i) => {
        const count = distribution[grade] || 0;
        const barH = maxCount > 0 ? (count / maxCount) * chartHeight : 0;
        const x = 35 + i * (barWidth + gap);
        const y = chartHeight - barH + 10;

        // 참고 분포 가이드 라인
        const refPct = refDist ? refDist[grade] : null;
        const refCount = refPct && total > 0 ? (refPct / 100) * total : null;
        const refH = refCount && maxCount > 0 ? (refCount / maxCount) * chartHeight : null;
        const refY = refH ? chartHeight - refH + 10 : null;

        const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;

        return (
          <g key={grade}>
            {/* Bar */}
            <rect x={x} y={y} width={barWidth} height={barH}
              rx="3" fill={GRADE_COLORS[grade] || '#999'} opacity="0.85"
            />
            {/* Count label */}
            <text x={x + barWidth / 2} y={y - 4}
              textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text-primary)">
              {count}
            </text>
            {/* Percentage */}
            <text x={x + barWidth / 2} y={y - 14}
              textAnchor="middle" fontSize="8" fill="var(--text-muted)">
              {pct}%
            </text>
            {/* Reference line (참고 분포 — dashed) */}
            {refY && (
              <line x1={x - 2} y1={refY} x2={x + barWidth + 2} y2={refY}
                stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3,2"
              />
            )}
            {/* Grade label */}
            <text x={x + barWidth / 2} y={chartHeight + 24}
              textAnchor="middle" fontSize="11" fontWeight="600" fill={GRADE_COLORS[grade]}>
              {grade}
            </text>
          </g>
        );
      })}

      {/* A이상 권고 상한 라인 (조직평가 연동) */}
      {orgLimit && total > 0 && (
        <line
          x1={35} y1={10}
          x2={chartWidth + 35} y2={10}
          stroke="transparent" strokeWidth="0"
        />
      )}

      {/* Legend */}
      <g transform={`translate(35, ${chartHeight + 38})`}>
        <line x1="0" y1="0" x2="12" y2="0" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3,2" />
        <text x="16" y="3" fontSize="9" fill="var(--text-muted)">참고 분포 가이드</text>
        {orgLimit && (
          <>
            <text x="100" y="3" fontSize="9" fill="var(--text-muted)">
              | A이상 권고 {orgLimit.aAbove}% · A+이상 권고 {orgLimit.aPlus}%
            </text>
          </>
        )}
      </g>
    </svg>
  );
}