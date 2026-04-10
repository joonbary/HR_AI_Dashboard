import { GRADE_COLORS, checkEligibility } from '../../data/personnelData';

export default function CandidateCard({ candidate: c, isSelected, onClick }) {
  const eligibility = checkEligibility(c);

  return (
    <div
      onClick={onClick}
      style={{
        padding: '14px', backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius)',
        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--divider)',
        cursor: 'pointer', transition: 'all 0.15s',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Header: Name + Grade Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {c.name}
            {c.flagged && (
              <span style={{ marginLeft: '6px', fontSize: '10px', color: '#EF4444', fontWeight: '600' }}>
                ⚠ {c.flagged}
              </span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {c.entity} · {c.division || c.dept} · {c.jobFamily}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span style={{
            padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: '600',
            backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)',
            border: '1px solid var(--divider)',
          }}>
            기초 {c.baseGrade}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>→</span>
          <span style={{
            padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: '700',
            backgroundColor: GRADE_COLORS[c.finalGrade] || '#999', color: '#fff',
          }}>
            {c.finalGrade}
          </span>
        </div>
      </div>

      {/* Level & Title */}
      <div style={{ display: 'flex', gap: '6px', fontSize: '11px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '2px 8px', borderRadius: '3px',
          backgroundColor: 'var(--bg-subtle)', color: 'var(--text-body)',
          border: '1px solid var(--divider)',
        }}>
          {c.level} {c.title}
        </span>
        {c.jobType && (
          <span style={{
            padding: '2px 8px', borderRadius: '3px',
            backgroundColor: 'var(--bg-subtle)', color: 'var(--text-body)',
            border: '1px solid var(--divider)',
          }}>
            {c.jobType}
          </span>
        )}
        <span style={{
          padding: '2px 8px', borderRadius: '3px',
          backgroundColor: eligibility.eligible ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: eligibility.eligible ? '#16A34A' : '#DC2626',
          border: `1px solid ${eligibility.eligible ? '#22C55E' : '#EF4444'}`,
          fontWeight: '600',
        }}>
          {eligibility.eligible ? '✓ 적격' : '✗ 부적격'}
        </span>
        {eligibility.tenureYears != null && (
          <span style={{
            padding: '2px 8px', borderRadius: '3px',
            backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)',
            border: '1px solid var(--divider)',
          }}>
            체류 {eligibility.tenureYears}년
          </span>
        )}
      </div>

      {/* CEI Bar (0~4 scale) */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {[
          { key: 'c', label: 'C 기여', val: c.cei.c },
          { key: 'e', label: 'E 전문', val: c.cei.e },
          { key: 'i', label: 'I 영향', val: c.cei.i },
        ].map(({ key, label, val }) => (
          <div key={key} style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
              <span>{label}</span>
              <span style={{ fontWeight: '600' }}>{val}</span>
            </div>
            <div style={{ height: '4px', borderRadius: '2px', backgroundColor: 'var(--divider)' }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                width: `${Math.min((val / 4) * 100, 100)}%`,
                backgroundColor: val >= 3 ? '#22C55E' : val >= 2 ? '#3B82F6' : val >= 1 ? '#F59E0B' : '#EF4444',
                transition: 'width 0.3s',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* CEI Total + Pay Step */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
        <div style={{ color: 'var(--text-muted)' }}>
          CEI 합계: <strong style={{ color: 'var(--text-primary)' }}>{c.ceiTotal}</strong>
          {c.payStep && <span> · 급호: <strong>{c.payStep}</strong></span>}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
          {c.hireDate && `입사: ${c.hireDate.slice(0,7)}`}
        </div>
      </div>

      {/* Keywords (optional) */}
      {c.keywords && c.keywords.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {c.keywords.map((kw, i) => (
            <span key={i} style={{
              fontSize: '10px', padding: '2px 6px', borderRadius: '3px',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)',
            }}>
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Ineligibility Reasons */}
      {!eligibility.eligible && (
        <div style={{
          padding: '6px 8px', borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)',
          fontSize: '10px', color: '#DC2626', lineHeight: '1.4',
        }}>
          {eligibility.reasons.map((r, i) => <div key={i}>• {r}</div>)}
        </div>
      )}
    </div>
  );
}
