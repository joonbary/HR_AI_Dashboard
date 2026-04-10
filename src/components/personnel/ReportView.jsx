import { useMemo } from 'react';
import usePersonnelStore from '../../store/personnelStore';
import { CANDIDATES, SCENARIOS, ACTION_TYPES, BENCHMARK_26H1, GRADE_ORDER, GRADE_COLORS, checkEligibility } from '../../data/personnelData';
import KpiCard from '../common/KpiCard';

export default function ReportView() {
  const { reportView, setReportView, activeScenario } = usePersonnelStore();
  const scenario = SCENARIOS.length > 0 ? (SCENARIOS[activeScenario] || SCENARIOS[0]) : null;

  // ── 시나리오 없을 때: 실 데이터 기반 현황 보고 모드 ──
  if (!scenario) {
    return <ReportNoScenario reportView={reportView} setReportView={setReportView} />;
  }

  const promotees = scenario.actions
    .filter(a => a.type === 'promotion')
    .map(a => ({ ...a, candidate: CANDIDATES.find(c => c.id === a.candidateId) }))
    .filter(a => a.candidate);

  const totalActions = scenario.actions.length;
  const promoCount = scenario.actions.filter(a => a.type === 'promotion').length;
  const removalCount = scenario.actions.filter(a => a.type === 'removal').length;
  const promotionRate = ((promoCount / CANDIDATES.length) * 100).toFixed(1);
  const salaryImpact = (promoCount * 2500 + scenario.actions.filter(a => a.type === 'elevation').length * 1500) / 10000;

  // 유형별 집계
  const typeSummary = ACTION_TYPES.map(t => ({
    ...t,
    count: scenario.actions.filter(a => a.type === t.id).length,
  })).filter(t => t.count > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* View Toggle */}
      <div style={{
        display: 'flex', gap: '8px', padding: '12px 16px',
        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
      }}>
        {[
          { id: 'ceo', label: '👔 대표이사 뷰' },
          { id: 'owner', label: '🎯 오너 뷰' },
        ].map(v => (
          <button key={v.id} onClick={() => setReportView(v.id)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
            border: reportView === v.id ? 'none' : '1px solid var(--divider)',
            backgroundColor: reportView === v.id ? 'var(--accent)' : 'var(--bg)',
            color: reportView === v.id ? '#fff' : 'var(--text-body)',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
          }}>{v.label}</button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>
          시나리오 「{scenario.name}」 · 총 {totalActions}건
        </div>
      </div>

      {reportView === 'ceo' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflow: 'auto' }}>
          {/* Executive Summary */}
          <div style={{
            padding: '16px', backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
          }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              📋 Executive Summary
            </div>
            <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-body)' }}>
              2026 하반기 정기인사 「{scenario.name}」안은 <strong>AI 전환 인력의 전략적 승진</strong>과
              <strong> 세대교체</strong>를 핵심으로 추진합니다.
              승진 {promoCount}명, 직책해제 {removalCount}명을 포함한 총 {totalActions}건의 인사로
              조직 역동성을 강화합니다.
              26상 실적(508명) 대비 정밀 타겟형으로 전환하여 핵심 인재에 집중합니다.
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <KpiCard label="승진 인원" value={promoCount} unit="명" color="var(--risk-low)" />
            <KpiCard label="승진율" value={promotionRate} unit="%" color="var(--ok-orange)" />
            <KpiCard label="인건비 증가" value={salaryImpact.toFixed(1)} unit="억원" color="var(--risk-mid)" />
            <KpiCard label="총 인사건수" value={totalActions} unit="건" color="var(--accent)" />
          </div>

          {/* 유형별 요약 */}
          <div style={{
            padding: '16px', backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
          }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
              📊 유형별 현황
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {typeSummary.map(t => (
                <div key={t.id} style={{
                  padding: '10px 16px', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${t.color}40`, backgroundColor: `${t.color}10`,
                  textAlign: 'center', minWidth: '80px',
                }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.icon} {t.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: t.color }}>{t.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 주요 승진 대상자 */}
          {promotees.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
                🌟 주요 승진 대상자
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(promotees.length, 3)}, 1fr)`, gap: '12px' }}>
                {promotees.slice(0, 3).map((p) => (
                  <div key={p.candidateId} style={{
                    padding: '12px', backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--divider)',
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {p.candidate.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      {p.candidate.entity} · {p.candidate.division}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '10px' }}>
                      <span style={{
                        backgroundColor: 'var(--accent)', color: '#fff',
                        padding: '2px 6px', borderRadius: '3px', fontWeight: '600',
                      }}>{p.candidate.finalGrade}</span>
                      <span style={{
                        backgroundColor: 'var(--bg-subtle)', color: 'var(--text-body)',
                        padding: '2px 6px', borderRadius: '3px',
                      }}>{p.from} → {p.to}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{p.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px',
            borderTop: '1px solid var(--divider)',
          }}>
            {[
              { label: '✓ 승인', bg: 'var(--risk-low)', color: '#fff', border: 'none' },
              { label: '⏸ 보류', bg: 'transparent', color: 'var(--risk-mid)', border: '1px solid var(--risk-mid)' },
              { label: '↺ 수정', bg: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)' },
            ].map(btn => (
              <button key={btn.label} style={{
                flex: 1, padding: '10px 16px', backgroundColor: btn.bg,
                color: btn.color, border: btn.border, borderRadius: 'var(--radius-sm)',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              }}>{btn.label}</button>
            ))}
          </div>
        </div>
      ) : (
        /* Owner View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflow: 'auto' }}>
          <div style={{
            padding: '20px', backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius)', border: '2px solid var(--ok-orange)',
            minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              2026 하반기 정기인사 — 오너 보고
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-body)', lineHeight: '1.6' }}>
              <strong>개요:</strong> 시나리오 「{scenario.name}」 — 총 {totalActions}건.
              승진 {promoCount}명, 직책해제 {removalCount}명으로 인사 개편 추진.
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                주요 지표
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>• 승진율:</span> <strong>{promotionRate}%</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>• 인건비:</span> <strong>+{salaryImpact.toFixed(1)}억원</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>• 26상 대비:</span> <strong>{totalActions}/{BENCHMARK_26H1.grandTotal}건</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>• 직군:</span> <strong>PL {scenario.actions.filter(a => { const c = CANDIDATES.find(x => x.id === a.candidateId); return c?.jobFamily === 'PL'; }).length}명 / Non-PL {scenario.actions.filter(a => { const c = CANDIDATES.find(x => x.id === a.candidateId); return c?.jobFamily === 'Non-PL'; }).length}명</strong></div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                리스크 & 주의사항
              </div>
              <ul style={{ fontSize: '11px', color: 'var(--text-body)', marginLeft: '14px', lineHeight: '1.5' }}>
                {removalCount > 0 && <li>직책해제 {removalCount}건 — 노조 협의 및 소명 기회 부여 필수</li>}
                <li>4B 기조 하 외부채용 제한으로 내부 승진 집중 — 핵심인재 이탈 방지 모니터링 필요</li>
                <li>AI Fast-track(Track C) 적용 가능 대상 확인 필요</li>
              </ul>
            </div>
          </div>

          {/* AI Copilot */}
          <div style={{
            padding: '16px', backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius)', border: '1px solid var(--divider)', flex: 1,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              🤖 AI Copilot
            </div>
            <textarea placeholder="질문을 입력하세요. 예: '이 인사안의 리스크 분석 결과를 요약해줘'" style={{
              padding: '12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--divider)', backgroundColor: 'var(--bg)',
              fontSize: '12px', fontFamily: 'var(--font-main)', color: 'var(--text-body)',
              flex: 1, resize: 'none', marginBottom: '8px',
            }} />
            <button style={{
              padding: '8px 14px', backgroundColor: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            }}>💬 질문하기</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 시나리오 미편성 시 실 데이터 기반 현황 보고 ──────────
function ReportNoScenario({ reportView, setReportView }) {
  const stats = useMemo(() => {
    const gradeDist = {};
    const entityDist = {};
    const levelDist = {};
    const jfDist = {};
    let eligibleCount = 0;

    CANDIDATES.forEach(c => {
      gradeDist[c.finalGrade] = (gradeDist[c.finalGrade] || 0) + 1;
      entityDist[c.entity] = (entityDist[c.entity] || 0) + 1;
      levelDist[c.level] = (levelDist[c.level] || 0) + 1;
      jfDist[c.jobFamily] = (jfDist[c.jobFamily] || 0) + 1;
      if (checkEligibility(c).eligible) eligibleCount++;
    });

    const aAbove = (gradeDist['S'] || 0) + (gradeDist['A+'] || 0) + (gradeDist['A'] || 0);
    const aAbovePct = ((aAbove / CANDIDATES.length) * 100).toFixed(1);

    return { gradeDist, entityDist, levelDist, jfDist, eligibleCount, aAbove, aAbovePct };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* View Toggle */}
      <div style={{
        display: 'flex', gap: '8px', padding: '12px 16px',
        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
      }}>
        {[
          { id: 'ceo', label: '👔 대표이사 뷰' },
          { id: 'owner', label: '🎯 오너 뷰' },
        ].map(v => (
          <button key={v.id} onClick={() => setReportView(v.id)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
            border: reportView === v.id ? 'none' : '1px solid var(--divider)',
            backgroundColor: reportView === v.id ? 'var(--accent)' : 'var(--bg)',
            color: reportView === v.id ? '#fff' : 'var(--text-body)',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
          }}>{v.label}</button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>
          실 데이터 기반 현황 · {CANDIDATES.length}명
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <KpiCard label="평가 대상자" value={CANDIDATES.length} unit="명" color="var(--accent)" />
        <KpiCard label="승진 적격" value={stats.eligibleCount} unit="명" color="var(--risk-low)" />
        <KpiCard label="A 이상 비율" value={stats.aAbovePct} unit="%" color="#3B82F6" />
        <KpiCard label="26상 벤치마크" value={BENCHMARK_26H1.grandTotal} unit="명" color="var(--ok-orange)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1, overflow: 'auto' }}>
        {/* 등급 분포 */}
        <div style={{
          padding: '16px', backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
            📊 최종등급 분포
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {GRADE_ORDER.map(g => {
              const count = stats.gradeDist[g] || 0;
              const pct = ((count / CANDIDATES.length) * 100).toFixed(1);
              return (
                <div key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '28px', textAlign: 'center', fontSize: '11px', fontWeight: '700',
                    color: GRADE_COLORS[g], padding: '2px 0',
                  }}>{g}</span>
                  <div style={{ flex: 1, height: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`, backgroundColor: GRADE_COLORS[g],
                      borderRadius: '3px', transition: 'width 0.3s',
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px',
                    }}>
                      {parseFloat(pct) > 8 && (
                        <span style={{ fontSize: '9px', color: '#fff', fontWeight: '600' }}>{count}</span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '50px', textAlign: 'right' }}>
                    {count}명 ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 법인별 현황 */}
        <div style={{
          padding: '16px', backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
            🏢 법인별 대상자
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(stats.entityDist)
              .sort((a, b) => b[1] - a[1])
              .map(([entity, count]) => (
                <div key={entity} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid var(--divider)' }}>
                  <span style={{ color: 'var(--text-body)' }}>{entity}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{count}명</span>
                </div>
              ))}
          </div>
        </div>

        {/* 레벨·직군 분포 */}
        <div style={{
          padding: '16px', backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
            📈 레벨별 현황
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Lv.1', 'Lv.2', 'Lv.3', 'Lv.4'].map(lv => (
              <div key={lv} style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{lv}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.levelDist[lv] || 0}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            {Object.entries(stats.jfDist).map(([jf, count]) => (
              <div key={jf} style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--divider)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{jf}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent)' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 26상 벤치마크 */}
        <div style={{
          padding: '16px', backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)', border: '1px solid var(--divider)',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
            📋 26상 인사 실적 벤치마크
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            {ACTION_TYPES.map(t => {
              const bench = BENCHMARK_26H1.summary[
                { promotion: 'promotion', payStep: 'payStep', elevation: 'elevation', transfer: 'transfer', removal: 'removal' }[t.id]
              ];
              if (!bench) return null;
              return (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--divider)' }}>
                  <span>{t.icon} {t.label}</span>
                  <span style={{ fontWeight: '600' }}>{bench.total}명 <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({bench.note})</span></span>
                </div>
              );
            })}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', fontWeight: '700' }}>
              <span>합계</span>
              <span>{BENCHMARK_26H1.grandTotal}명</span>
            </div>
          </div>
          <div style={{
            marginTop: '12px', padding: '8px 12px', backgroundColor: 'rgba(232,87,42,0.08)',
            borderRadius: 'var(--radius-sm)', fontSize: '11px', color: 'var(--text-body)', lineHeight: '1.5',
          }}>
            Calibration 완료 후 인사안 시나리오를 편집하면 이 벤치마크 대비 비교 분석이 자동 생성됩니다
          </div>
        </div>
      </div>
    </div>
  );
}
