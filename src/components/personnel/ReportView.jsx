import usePersonnelStore from '../../store/personnelStore';
import { CANDIDATES } from '../../data/personnelData';
import KpiCard from '../common/KpiCard';

export default function ReportView() {
  const { reportView, setReportView } = usePersonnelStore();

  // Mock data for report
  const topPromotees = CANDIDATES.filter((c) => c.grade === 'S' || c.grade === 'A+').slice(0, 3);
  const promotionRate = ((3 / CANDIDATES.length) * 100).toFixed(1);
  const avgSalaryImpact = 2.5; // 억원

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* View Toggle */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--divider)',
        }}
      >
        <button
          onClick={() => setReportView('ceo')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            border: reportView === 'ceo' ? 'none' : '1px solid var(--divider)',
            backgroundColor: reportView === 'ceo' ? 'var(--accent)' : 'var(--bg)',
            color: reportView === 'ceo' ? '#fff' : 'var(--text-body)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          👔 대표이사 뷰
        </button>
        <button
          onClick={() => setReportView('owner')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            border: reportView === 'owner' ? 'none' : '1px solid var(--divider)',
            backgroundColor: reportView === 'owner' ? 'var(--accent)' : 'var(--bg)',
            color: reportView === 'owner' ? '#fff' : 'var(--text-body)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          🎯 오너 뷰
        </button>
      </div>

      {/* Content Area */}
      {reportView === 'ceo' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflow: 'auto' }}>
          {/* Executive Summary */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              📋 Executive Summary
            </div>
            <div style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-body)' }}>
              2026 하반기 정기인사는 <strong>AI 전환 인력의 전략적 승진</strong>을 핵심으로 추진합니다.
              고성과자 3명의 과장 승진과 저성과 임원 1명의 직책해제로, 조직의 역동성과 신뢰도를 동시에 강화할 것으로 예상됩니다.
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <KpiCard
              label="승진 인원"
              value={3}
              unit="명"
              color="var(--risk-low)"
            />
            <KpiCard
              label="승진율"
              value={promotionRate}
              unit="%"
              color="var(--ok-orange)"
            />
            <KpiCard
              label="인건비 증가"
              value={avgSalaryImpact}
              unit="억원"
              color="var(--risk-mid)"
            />
          </div>

          {/* Top Promotees Cards */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
              🌟 주요 승진 대상자
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {topPromotees.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--divider)',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    {p.division}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      fontSize: '10px',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: '600',
                      }}
                    >
                      {p.grade}
                    </span>
                    <span
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-body)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                      }}
                    >
                      {p.title} → 과장
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: 'auto',
              paddingTop: '16px',
              borderTop: '1px solid var(--divider)',
            }}
          >
            <button
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: 'var(--risk-low)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ✓ 승인
            </button>
            <button
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: 'transparent',
                color: 'var(--risk-mid)',
                border: '1px solid var(--risk-mid)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ⏸ 보류
            </button>
            <button
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: 'transparent',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ↺ 수정
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflow: 'auto' }}>
          {/* One-page Summary */}
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '2px solid var(--ok-orange)',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              2026 하반기 정기인사 — 오너 보고
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-body)', lineHeight: '1.6' }}>
              <strong>개요:</strong> 총 8명 대상자 중 적격자 5명 선정.
              승진 3명(이서연·김민수·한소희), 직책해제 1명(오태현)으로 인사개편 추진.
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                주요 지표
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>• 승진율:</span>{' '}
                  <strong>{promotionRate}%</strong> (평년 대비 +0.5%p)
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>• 인건비:</span>{' '}
                  <strong>+{avgSalaryImpact}억원</strong> (연 1%)
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                리스크 &amp; 주의사항
              </div>
              <ul style={{ fontSize: '11px', color: 'var(--text-body)', marginLeft: '14px', lineHeight: '1.4' }}>
                <li>오태현(B 등급) 직책해제: 노조 협의 필수</li>
                <li>외부 영입 제한으로 인한 신입 배치 지연 관찰</li>
              </ul>
            </div>
          </div>

          {/* AI Copilot Prompt Area */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--divider)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
              🤖 AI Copilot Prompt
            </div>
            <textarea
              placeholder="자유로운 지시사항을 입력하세요. 예: '이 인사안의 리스크 분석 결과를 요약해줘'"
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--divider)',
                backgroundColor: 'var(--bg)',
                fontSize: '12px',
                fontFamily: 'var(--font-main)',
                color: 'var(--text-body)',
                flex: 1,
                resize: 'none',
                marginBottom: '8px',
              }}
            />
            <button
              style={{
                padding: '8px 14px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              💬 질문하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
