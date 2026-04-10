import { GRADE_COLORS, GRADE_NUM } from '../../data/personnelData';
import MiniSparkline from './MiniSparkline';

export default function CandidateCard({
  candidate,
  isSelected = false,
  onClick,
  onAskCopilot,
}) {
  const gradeColor = GRADE_COLORS[candidate.grade] || '#999';
  const borderColor = isSelected ? 'var(--accent)' : 'var(--divider)';
  const borderWidth = isSelected ? '2px' : '1px';

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: 'var(--radius)',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: 'var(--shadow)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header: Name, Grade, Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {candidate.entity} · {candidate.division}
          </div>
        </div>
        <div
          style={{
            backgroundColor: gradeColor,
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          {candidate.grade}
        </div>
      </div>

      {/* Title & Level */}
      <div style={{ fontSize: '12px', color: 'var(--text-body)', marginBottom: '12px' }}>
        {candidate.title} · {candidate.level} · {candidate.years}년
      </div>

      {/* CEI Bars */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
          CEI
        </div>
        {['c', 'e', 'i'].map((key) => {
          const val = candidate.cei[key];
          const pct = (val / 100) * 100;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', minWidth: '16px' }}>
                {key.toUpperCase()}
              </span>
              <div
                style={{
                  flex: 1,
                  height: '6px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    backgroundColor: gradeColor,
                    width: `${pct}%`,
                    transition: 'width 0.2s',
                  }}
                />
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '20px', textAlign: 'right' }}>
                {val}
              </span>
            </div>
          );
        })}
      </div>

      {/* Evaluation History Sparkline */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
          평가 추이
        </div>
        <MiniSparkline data={candidate.evalHistory} width={80} height={24} />
      </div>

      {/* Keywords */}
      {candidate.keywords && candidate.keywords.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {candidate.keywords.map((kw, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-body)',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Utilization Stars & Eligible Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              style={{
                color: i < candidate.aiScore ? 'var(--accent)' : 'var(--divider)',
                fontSize: '14px',
              }}
            >
              ★
            </span>
          ))}
        </div>
        {candidate.eligible && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#fff',
              backgroundColor: 'var(--risk-low)',
              padding: '2px 8px',
              borderRadius: '3px',
            }}
          >
            적격
          </span>
        )}
      </div>

      {/* Ask Copilot Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAskCopilot?.(candidate.id);
        }}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: 'var(--accent-light)',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          fontSize: '12px',
          fontWeight: '600',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-light)';
          e.currentTarget.style.color = 'var(--accent)';
        }}
      >
        🤖 질문
      </button>
    </div>
  );
}
