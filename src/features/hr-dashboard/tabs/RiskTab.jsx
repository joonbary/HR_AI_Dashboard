import { useMemo } from 'react';
import { buildRiskData, HEATMAP_ITEMS } from '../../../data/riskData';
import KpiCard from '../../../shared/ui/common/KpiCard';
import ChartCard from '../../../shared/ui/charts/ChartCard';
import { CHART_COLORS } from '../../../styles/chartPalette';

export default function RiskTab() {
  const risk = useMemo(() => buildRiskData(), []);

  const radarConfig = useMemo(() => ({
    type: 'radar',
    data: {
      labels: risk.categories.map(c => c.name),
      datasets: [{
        label: '리스크 스코어',
        data: risk.categories.map(c => c.score),
        backgroundColor: CHART_COLORS.dangerSoft,
        borderColor: CHART_COLORS.danger,
        pointBackgroundColor: CHART_COLORS.danger,
      }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { r: { beginAtZero: true, max: 100 } },
    },
  }), [risk]);

  return (
    <div>
      <div className="kpi-row">
        <KpiCard label="종합 리스크 스코어" value={risk.totalScore + '/100'} sub={risk.totalScore < 40 ? '양호' : risk.totalScore < 65 ? '주의' : '경고'} trend={risk.totalScore >= 65 ? 'up' : ''} />
        {risk.categories.map(c => (
          <KpiCard key={c.name} label={c.name} value={c.score + '점'} sub={c.level} />
        ))}
      </div>

      <div className="chart-grid chart-grid-2">
        {/* Heatmap placeholder ? canvas로 직접 그리기 */}
        <div className="chart-card">
          <div className="chart-title">리스크 히트맵</div>
          <div className="chart-subtitle">발생확률 × 영향도 (4개 카테고리)</div>
          <div className="chart-wrap h280" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: 2, padding: 8 }}>
            {[5,4,3,2,1].map(impact =>
              [1,2,3,4,5].map(prob => {
                const items = HEATMAP_ITEMS.filter(h => h.prob === prob && h.impact === impact);
                const bg = (prob * impact) >= 15 ? CHART_COLORS.dangerSoft : (prob * impact) >= 8 ? CHART_COLORS.warningSoft : CHART_COLORS.positiveSoft;
                return (
                  <div key={`${prob}-${impact}`} style={{ background: bg, borderRadius: 4, fontSize: 9, padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    {items.map(h => h.label).join(', ')}
                  </div>
                );
              })
            )}
          </div>
        </div>
        <ChartCard title="카테고리별 리스크 스코어" subtitle="100점 만점 (낮을수록 양호)" config={radarConfig} />
      </div>

      {/* Category detail cards */}
      <div className="chart-grid chart-grid-2">
        {risk.categories.map(cat => (
          <div key={cat.name} className="chart-card">
            <div className="chart-title" style={{ color: cat.score >= 60 ? 'var(--risk-high)' : cat.score >= 40 ? 'var(--risk-mid)' : 'var(--risk-low)' }}>
              {cat.name} ({cat.score}점)
            </div>
            <ul style={{ listStyle: 'none', marginTop: 8 }}>
              {cat.items.map((item, i) => (
                <li key={i} style={{ padding: '4px 0', fontSize: 12, borderBottom: '1px solid var(--divider)' }}>
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
