import { useMemo } from 'react';
import { dashboardData as D } from '../../../services/dashboard/dashboardDataModel';
import KpiCard from '../../../shared/ui/common/KpiCard';
import ChartCard from '../../../shared/ui/charts/ChartCard';
import DataTable from '../../../shared/ui/common/DataTable';
import { CHART_COLORS } from '../../../styles/chartPalette';

export default function AITab() {
  const awta = useMemo(() => D.awta || [], []);
  const shift = useMemo(() => D.shift || [], []);

  const totals = useMemo(() => {
    const total = awta.reduce((s, r) => s + (r.total || 0), 0);
    const possible = awta.reduce((s, r) => s + (r.possible || 0), 0);
    const started = awta.reduce((s, r) => s + (r.started || 0), 0);
    const rate = possible > 0 ? (started / possible * 100).toFixed(1) : 0;
    return { total, possible, started, rate };
  }, [awta]);

  const awtaConfig = useMemo(() => ({
    type: 'bar',
      data: {
        labels: awta.map(r => r.co),
        datasets: [
        { label: 'AI 가능', data: awta.map(r => r.possible), backgroundColor: CHART_COLORS.neutral, borderRadius: 4 },
        { label: '착수', data: awta.map(r => r.started), backgroundColor: CHART_COLORS.primary, borderRadius: 4 },
        ],
      },
    options: { plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } },
  }), [awta]);

  const shiftConfig = useMemo(() => ({
    type: 'radar',
    data: {
      labels: shift.map(s => s.t),
      datasets: [{
        label: '과제 수',
        data: shift.map(s => s.c),
        backgroundColor: CHART_COLORS.primarySoft,
        borderColor: CHART_COLORS.primary,
        pointBackgroundColor: CHART_COLORS.primary,
      }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { r: { beginAtZero: true } },
    },
  }), [shift]);

  const headers = ['법인', '전체 과제', 'AI 가능', '착수', '착수율'];
  const rows = awta.map(r => [
    r.co,
    r.total,
    r.possible,
    r.started,
    r.possible > 0 ? (r.started / r.possible * 100).toFixed(1) + '%' : '-',
  ]);

  return (
    <div>
      <div className="kpi-row">
        <KpiCard label="전체 과제" value={totals.total + '건'} />
        <KpiCard label="AI 가능 과제" value={totals.possible + '건'} />
        <KpiCard label="착수 과제" value={totals.started + '건'} />
        <KpiCard label="그룹 착수율" value={totals.rate + '%'} sub="목표 30%" />
      </div>
      <div className="chart-grid chart-grid-2">
        <ChartCard title="법인별 AWTA 착수율" subtitle="AI 가능 과제 대비 착수 건수" config={awtaConfig} />
        <ChartCard title="업무 SHIFT 분포" subtitle={`과제 유형별 분포 (전체 ${totals.total}건)`} config={shiftConfig} />
      </div>
      <div className="section-title">AWTA 과제 상세</div>
      <DataTable headers={headers} rows={rows} />
    </div>
  );
}
