import { useMemo } from 'react';
import usePersonnelStore from '../../store/personnelStore';
import { CANDIDATES, SCENARIOS, ACTION_TYPES, BENCHMARK_26H1 } from '../../data/personnelData';
import KpiCard from '../common/KpiCard';

export default function HRPlanView() {
  const { activeScenario, setActiveScenario } = usePersonnelStore();
  const currentScenario = useMemo(() => SCENARIOS[activeScenario], [activeScenario]);

  // 유형별 집계
  const grouped = useMemo(() => {
    if (!currentScenario) return {};
    const result = {};
    ACTION_TYPES.forEach(t => { result[t.id] = []; });
    currentScenario.actions.forEach(a => {
      if (result[a.type]) {
        const candidate = CANDIDATES.find(c => c.id === a.candidateId);
        result[a.type].push({ ...a, candidate });
      }
    });
    return result;
  }, [currentScenario]);

  // 시나리오 메트릭
  const metrics = useMemo(() => {
    if (!currentScenario) return {};
    const promoCount = (grouped.promotion || []).length;
    const payStepCount = (grouped.payStep || []).length;
    const elevCount = (grouped.elevation || []).length;
    const transCount = (grouped.transfer || []).length;
    const removalCount = (grouped.removal || []).length;
    const salaryImpact = promoCount * 2500 + elevCount * 1500; // 만원 단위
    return { promoCount, payStepCount, elevCount, transCount, removalCount, total: currentScenario.actions.length, salaryImpact };
  }, [currentScenario, grouped]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Scenario Tabs */}
      <div style={{
        display: 'flex', gap: '8px', alignItems: 'center', padding: '12px 16px',
        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
      }}>
        {SCENARIOS.map((scenario, idx) => (
          <button key={idx} onClick={() => setActiveScenario(idx)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
            border: activeScenario === idx ? 'none' : '1px solid var(--divider)',
            backgroundColor: activeScenario === idx ? 'var(--accent)' : 'var(--bg)',
            color: activeScenario === idx ? '#fff' : 'var(--text-body)',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {scenario.name}
          </button>
        ))}
        <button style={{
          marginLeft: 'auto', padding: '6px 14px', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--divider)', backgroundColor: 'var(--bg)',
          color: 'var(--accent)', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
        }}>+ 시나리오 추가</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {ACTION_TYPES.map(t => (
          <KpiCard key={t.id} label={t.label} value={grouped[t.id]?.length || 0} unit="명" color={t.color} />
        ))}
      </div>

      {/* Main: Action Lists + Impact */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', flex: 1, overflow: 'hidden' }}>
        {/* Left: Action Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'auto' }}>
          {ACTION_TYPES.map(t => {
            const items = grouped[t.id] || [];
            if (items.length === 0) return null;
            return (
              <div key={t.id} style={{
                padding: '12px', backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
              }}>
                <div style={{
                  fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)',
                  marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span>{t.icon}</span> {t.label} ({items.length}명)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{
                      padding: '6px 10px', backgroundColor: 'var(--bg)',
                      borderRadius: 'var(--radius-sm)', fontSize: '12px',
                      border: `1px solid ${t.color}30`, display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {item.candidate?.name || item.candidateId}
                        </span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                          {item.from} → {item.to}
                        </span>
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Impact & Benchmark */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto' }}>
          {/* 인건비 */}
          <div style={{
            padding: '12px', backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>
              예상 인건비 변동
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>
              +{(metrics.salaryImpact / 10000).toFixed(1)}억원
            </div>
          </div>

          {/* 26상 벤치마크 */}
          <div style={{
            padding: '12px', backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
              📊 26상 실적 벤치마크
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
              {ACTION_TYPES.map(t => {
                const benchKey = { promotion: 'promotion', payStep: 'payStep', elevation: 'elevation', transfer: 'transfer', removal: 'removal' }[t.id];
                const bench = BENCHMARK_26H1.summary[benchKey];
                if (!bench) return null;
                const current = grouped[t.id]?.length || 0;
                return (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-body)' }}>
                    <span>{t.icon} {t.label}</span>
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>{current}명</strong>
                      <span style={{ color: 'var(--text-muted)' }}> / 26상 {bench.total}명</span>
                    </span>
                  </div>
                );
              })}
              <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '4px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>합계</span>
                <span><strong>{metrics.total}명</strong> <span style={{ color: 'var(--text-muted)' }}>/ 26상 {BENCHMARK_26H1.grandTotal}명</span></span>
              </div>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div style={{
            padding: '12px', backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius)', border: '1px solid var(--divider)', flex: 1,
          }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              🤖 AI Executive Summary
            </div>
            <div contentEditable suppressContentEditableWarning style={{
              padding: '8px', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-sm)',
              fontSize: '11px', color: 'var(--text-body)', minHeight: '60px',
              border: '1px solid var(--divider)', lineHeight: '1.5',
            }}>
              {currentScenario?.name === '원안'
                ? `승진 ${metrics.promoCount}명, 승급 ${metrics.payStepCount}명, 승격 ${metrics.elevCount}명, 이동 ${metrics.transCount}명, 직책해제 ${metrics.removalCount}명으로 구성. 26상 대비 승진 규모 축소, AI 인재 전략적 배치에 집중. 인건비 증가는 연 ${(metrics.salaryImpact / 10000).toFixed(1)}억 수준으로 관리 가능.`
                : currentScenario?.name?.includes('보수')
                  ? '보수적 인사안으로 분쟁 위험 최소화. 다만 고성과자 인센티브 효과 약화 우려.'
                  : '적극적 인사로 세대교체 가속. 승격 확대에 따른 인건비 증가 및 기존 직책자 반발 리스크 관리 필요.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
