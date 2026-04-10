import { useMemo } from 'react';
import usePersonnelStore from '../../store/personnelStore';
import { CANDIDATES, SCENARIOS } from '../../data/personnelData';
import KpiCard from '../common/KpiCard';

export default function HRPlanView() {
  const { activeScenario, setActiveScenario } = usePersonnelStore();

  const currentScenario = useMemo(() => SCENARIOS[activeScenario], [activeScenario]);

  // Calculate metrics for current scenario
  const metrics = useMemo(() => {
    if (!currentScenario) return {};

    const promotees = CANDIDATES.filter((c) => currentScenario.promotions.includes(c.id));
    const transferees = CANDIDATES.filter((c) => currentScenario.transfers.includes(c.id));
    const demoted = CANDIDATES.filter((c) => currentScenario.demotions.includes(c.id));

    // Simple salary bump estimation (mock)
    const avgSalaryIncrease = promotees.length * 25000000; // 2,500만원 per promotion

    // Department headcount changes (mock)
    const deptChanges = {};
    CANDIDATES.forEach((c) => {
      deptChanges[c.division] = (deptChanges[c.division] || 0) + 1;
    });

    return {
      promotionCount: promotees.length,
      transferCount: transferees.length,
      demotionCount: demoted.length,
      salaryImpact: avgSalaryIncrease,
      deptChanges,
      promotees,
    };
  }, [currentScenario]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Scenario Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)',
        }}
      >
        {SCENARIOS.map((scenario, idx) => (
          <button
            key={idx}
            onClick={() => setActiveScenario(idx)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: activeScenario === idx ? 'none' : '1px solid var(--divider)',
              backgroundColor: activeScenario === idx ? 'var(--accent)' : 'var(--bg)',
              color: activeScenario === idx ? '#fff' : 'var(--text-body)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {scenario.name}
          </button>
        ))}
        <button
          style={{
            marginLeft: 'auto',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--divider)',
            backgroundColor: 'var(--bg)',
            color: 'var(--accent)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          + 시나리오 추가
        </button>
      </div>

      {/* Main Content: Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', flex: 1 }}>
        {/* Left Column: Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto' }}>
          {/* Promotions List */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              승진 ({metrics.promotionCount || 0}명)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(metrics.promotees || []).map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '6px 8px',
                    backgroundColor: 'var(--bg)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    color: 'var(--text-body)',
                    border: '1px solid var(--risk-low)',
                  }}
                >
                  {p.name} ({p.title} → 과장)
                </div>
              ))}
            </div>
          </div>

          {/* Transfers List */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              이동 ({metrics.transferCount || 0}명)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Mock transfer data */}
              <div
                style={{
                  padding: '6px 8px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                이동 대상자 없음
              </div>
            </div>
          </div>

          {/* Demotions List */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              직책해제 ({metrics.demotionCount || 0}명)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Mock demotion data */}
              <div
                style={{
                  padding: '6px 8px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                직책해제 대상자 없음
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Impact Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto' }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <KpiCard
              label="승진 인원"
              value={metrics.promotionCount || 0}
              unit="명"
              color="var(--risk-low)"
            />
            <KpiCard
              label="이동 인원"
              value={metrics.transferCount || 0}
              unit="명"
              color="var(--risk-mid)"
            />
          </div>

          {/* Salary Impact Card */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>
              인건비 변동
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--accent)',
              }}
            >
              +{(metrics.salaryImpact / 100000000).toFixed(1)}억원
            </div>
          </div>

          {/* Headcount Changes */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              부서별 정원 변동
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
              {Object.entries(metrics.deptChanges || {}).map(([dept, count]) => (
                <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
                  <span>{dept}</span>
                  <span style={{ fontWeight: '600' }}>+{count}명</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Executive Summary */}
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
              flex: 1,
              overflow: 'auto',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              🤖 AI Executive Summary
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              style={{
                padding: '8px',
                backgroundColor: 'var(--bg)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                color: 'var(--text-body)',
                minHeight: '80px',
                border: '1px solid var(--divider)',
                lineHeight: '1.4',
              }}
            >
              {currentScenario?.name === '원안'
                ? '승진 3명, 직책해제 1명으로 리스크 최소화. 인건비 증가는 연 2억 수준으로 관리 가능.'
                : '대안1: 보수적 인사로 분쟁 위험 완화. 다만 고성과자 인센티브 효과 약화 우려.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
