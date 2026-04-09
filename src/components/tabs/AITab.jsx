import { useMemo } from 'react';
import { D } from '../../data/dashboardData';
import KpiCard from '../common/KpiCard';
import ChartCard from '../charts/ChartCard';
import DataTable from '../common/DataTable';

export default function AITab() {
  const awta = D.awta || [];
  const shift = D.shift || [];

  const totals = useMemo(() => {
    const total = awta.reduce((s, r) => s + (r.total || 0), 0);
    const possible = awta.reduce((s, r) => s + (r.possible || 0), 0);
    const started = awta.reduce((s, r) => s + (r.started || 0), 0);
    const rate = possible > 0 ? (started / possible * 100).toFixed(1) : 0;
    return { total, possible, started, rate };
  }, []);

  const awtaConfig = useMemo(() => ({
    type: 'bar',
    data: {
      labels: awta.map(r => r.co),
      datasets: [
        { label: 'AI가능', data: awta.map(r => r.possible), backgroundColor: '#3498DB', borderRadius: 4 },
        { label: '착수', data: awta.map(r => r.started), backgroundColor: '#E8572A', borderRadius: 4 },
      ],
    },
    options: { plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } },
  }), []);

  const shiftConfig = useMemo(() => ({
    type: 'radar',
    data: {
      labels: shift.map(s => s.t),
      datasets: [{
        label: '과제 수',
        data: shift.map(s => s.c),
        backgroundColor: 'rgba(232,87,42,0.2)',
        borderColor: '#E8572A',
        pointBackgroundColor: '#E8572A',
      }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { r: { beginAtZero: true } },
    },
  }), []);

  const headers = ['법인', '전체 과제', 'AI가능', '착수', '착수율'];
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
        <KpiCard label="AI가능 과제" value={totals.possible + '건'} />
        <KpiCard label="착수 과제" value={totals.started + '건'} />
        <KpiCard label="그룹 착수율" value={totals.rate + '%'} sub="목표 30%" />
      </div>
      <div className="chart-grid chart-grid-2">
        <ChartCard title="법인별 AWTA 착수율" subtitle="AI 가능 과제 대비 착수 건수" config={awtaConfig} />
        <ChartCard title="Work SHIFT 분포" subtitle={`과제 유형별 분포 (전체 ${totals.total}건)`} config={shiftConfig} />
      </div>
      <div className="section-title">AWTA 과제 현황 상세</div>
      <DataTable headers={headers} rows={rows} />
    </div>
  );
}
