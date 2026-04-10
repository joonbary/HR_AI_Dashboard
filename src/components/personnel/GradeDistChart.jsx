import { GRADE_ORDER, GRADE_COLORS } from '../../data/personnelData';

export default function GradeDistChart({ grades, candidates, upperLimit }) {
  // Calculate distribution
  const distribution = {};
  GRADE_ORDER.forEach((grade) => {
    distribution[grade] = Object.values(grades).filter((g) => g === grade).length;
  });

  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  // Find max count for scaling
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: '200px',
        gap: '8px',
        padding: '0 8px',
      }}
    >
      {GRADE_ORDER.map((grade) => {
        const count = distribution[grade] || 0;
        const percentage = ((count / total) * 100).toFixed(1);
        const limit = upperLimit?.[grade] || 0;
        const isExceeding = count > limit;
        const barHeight = (count / maxCount) * 100;

        return (
          <div
            key={grade}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {/* Dashed limit line */}
            {limit > 0 && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: `${(limit / maxCount) * 100}%`,
                  borderTop: '1px dashed var(--text-muted)',
                  opacity: 0.5,
                }}
              />
            )}

            {/* Bar */}
            <div
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: isExceeding ? 'var(--risk-high)' : GRADE_COLORS[grade],
                borderRadius: '4px 4px 0 0',
                position: 'relative',
                transition: 'all 0.2s',
              }}
              title={`${grade}: ${count}명 (${percentage}%)`}
            />

            {/* Grade Label */}
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {grade}
            </div>

            {/* Count & Percentage */}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {count}명
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {percentage}%
            </div>

            {/* Exceeding indicator */}
            {isExceeding && (
              <div style={{ fontSize: '10px', color: 'var(--risk-high)', fontWeight: '600' }}>
                ⚠ 초과
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
