import { useMemo } from 'react';
import { dashboardData as D } from '../../../services/dashboard/dashboardDataModel';
import useFilteredData from '../../../hooks/useFilteredData';
import KpiCard from '../../../shared/ui/common/KpiCard';
import ChartCard from '../../../shared/ui/charts/ChartCard';
import { CHART_COLORS } from '../../../styles/chartPalette';

export default function ExecTab() {
  const fd = useFilteredData();

  const comboConfig = useMemo(() => ({
    type: 'bar',
    data: {
      labels: D.years,
      datasets: [
        {
          type: 'bar',
          label: '그룹 인원',
          data: D.years.map(y => D.companies.reduce((s, co) => s + (D.headcount[co]?.[y] || 0), 0)),
          backgroundColor: CHART_COLORS.primary,
          borderRadius: 4,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: '이직률',
          data: D.years.map(y => D.turnoverByCompany?.['그룹']?.[y] || 0),
          borderColor: CHART_COLORS.navy,
          backgroundColor: 'transparent',
          tension: 0.3,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { position: 'left', beginAtZero: true },
        y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false } },
      },
    },
  }), []);

  const radarConfig = useMemo(() => ({
    type: 'radar',
    data: {
      labels: ['인원 안정성', '이직률', '인건비 효율', '성과 우수율', 'AI 전환율'],
      datasets: [{
        label: '핵심 지표',
        data: [75, 60, 70, 80, 45],
        backgroundColor: CHART_COLORS.primarySoft,
        borderColor: CHART_COLORS.primary,
        pointBackgroundColor: CHART_COLORS.primary,
      }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { r: { beginAtZero: true, max: 100 } },
    },
  }), []);

  const actionItems = [
    { priority: '[긴급]', text: 'AWTA 2차 취합 마감 임박 (4/11)', detail: '법인별 과업정의서 제출 모니터링 필요' },
    { priority: '[주의]', text: 'OK저축은행 이직률 상승 추세', detail: '전년 대비 2.1%p 상승, 핵심인력 리텐션 전략 검토' },
    { priority: '[모니터링]', text: '1인당 인건비 3년 연속 증가', detail: '생산성 지표 대비 인건비 효율성 모니터링' },
  ];

  return (
    <div>
      <div className="kpi-row">
        <KpiCard label="그룹 인원" value={fd.totalHeadcount.toLocaleString() + '명'} sub={`전년 대비 ${fd.yoy > 0 ? '+' : ''}${fd.yoy}%`} trend={fd.yoy >= 0 ? 'up' : 'down'} />
        <KpiCard label="이직률" value={fd.turnoverRate + '%'} />
        <KpiCard label="인건비" value={fd.totalLaborCost.toLocaleString() + '백만 원'} />
        <KpiCard label="1인당 인건비" value={fd.perCapita.toLocaleString() + '백만 원'} />
      </div>

      <div className="chart-grid chart-grid-2">
        <ChartCard title="인원·이직률 요약" config={comboConfig} height="h240" />
        <ChartCard title="핵심 지표 레이더" config={radarConfig} height="h240" />
      </div>

      <div className="section-title">주요 조치 항목</div>
      {actionItems.map((item, i) => (
        <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--divider)', borderRadius: 'var(--radius)', marginBottom: 8, boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{item.priority} {item.text}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{item.detail}</div>
        </div>
      ))}
    </div>
  );
}
