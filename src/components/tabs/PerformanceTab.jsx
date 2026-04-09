import { useMemo } from 'react';
import { D } from '../../data/dashboardData';
import useFilteredData from '../../hooks/useFilteredData';
import useStore from '../../store/useStore';
import KpiCard from '../common/KpiCard';
import ChartCard from '../charts/ChartCard';
import DataTable from '../common/DataTable';

const GRADE_COLORS = { S:'#E8572A', 'A+':'#F77310', A:'#FCAF17', 'B+':'#7AB648', B:'#3498DB', C:'#9B59B6', D:'#999' };

export default function PerformanceTab() {
  const { company } = useStore();
  const fd = useFilteredData();

  const evalStackConfig = useMemo(() => {
    const grades = Object.keys(D.evalDist || {});
    return {
      type: 'bar',
      data: {
        labels: D.years,
        datasets: grades.map(g => ({
          label: g,
          data: D.years.map(y => Math.round((D.evalDist[g]?.[y] || 0) * 1000) / 10),
          backgroundColor: GRADE_COLORS[g] || '#999',
        })),
      },
      options: { plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } },
    };
  }, []);

  const aAboveConfig = useMemo(() => ({
    type: 'line',
    data: {
      labels: D.years,
      datasets: [{
        label: 'A이상 비율',
        data: D.years.map(y => Math.round((D.aAbove?.[y] || 0) * 1000) / 10),
        borderColor: '#E8572A',
        backgroundColor: 'rgba(232,87,42,0.1)',
        fill: true,
        tension: 0.3,
      }],
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } },
  }), []);

  const laborCostConfig = useMemo(() => ({
    type: 'bar',
    data: {
      labels: D.years,
      datasets: D.companies.map((co, i) => ({
        label: co,
        data: D.years.map(y => D.laborCost[co]?.[y] || 0),
        backgroundColor: ['#E8572A','#F77310','#FCAF17','#7AB648','#3498DB','#9B59B6','#1ABC9C'][i],
      })),
    },
    options: { plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } },
  }), []);

  const perCapitaConfig = useMemo(() => {
    const totalByCo = {};
    D.companies.forEach(co => { totalByCo[co] = {}; D.years.forEach(y => {
      const hc = D.headcount[co]?.[y] || 1;
      totalByCo[co][y] = Math.round((D.laborCost[co]?.[y] || 0) / hc);
    }); });
    return {
      type: 'line',
      data: {
        labels: D.years,
        datasets: [{
          label: '그룹 1인당',
          data: D.years.map(y => {
            const totalCost = D.companies.reduce((s, co) => s + (D.laborCost[co]?.[y] || 0), 0);
            const totalHc = D.companies.reduce((s, co) => s + (D.headcount[co]?.[y] || 0), 0);
            return totalHc > 0 ? Math.round(totalCost / totalHc) : 0;
          }),
          borderColor: '#E8572A',
          tension: 0.3,
          pointRadius: 4,
        }],
      },
      options: { plugins: { legend: { display: false } } },
    };
  }, []);

  // Table
  const headers = ['법인', ...D.years.map(y => y + '년'), 'YoY'];
  const rows = D.companies.map(co => {
    const r = [co, ...D.years.map(y => (D.laborCost[co]?.[y] || 0).toLocaleString())];
    const cur = D.laborCost[co]?.[fd.latestYear] || 0;
    const prev = D.laborCost[co]?.[fd.latestYear - 1] || 0;
    r.push(prev > 0 ? ((cur - prev) / prev * 100).toFixed(1) + '%' : '-');
    return r;
  });

  return (
    <div>
      <div className="kpi-row">
        <KpiCard label="그룹 인건비" value={fd.totalLaborCost.toLocaleString() + '백만'} sub={`${fd.latestYear}년 기준`} />
        <KpiCard label="1인당 인건비" value={fd.perCapita.toLocaleString() + '백만'} sub="그룹 평균" />
      </div>
      <div className="chart-grid chart-grid-2">
        <ChartCard title="성과등급 분포 추이" subtitle="연도별 등급 비율 (2022~2024: 5등급, 2025~: 7등급)" config={evalStackConfig} />
        <ChartCard title="A이상 비율 추이" subtitle="S + A+ + A 합산 비율" config={aAboveConfig} />
      </div>
      <div className="chart-grid chart-grid-2">
        <ChartCard title="그룹 인건비 추이" subtitle="법인별 연간 인건비 (백만원)" config={laborCostConfig} />
        <ChartCard title="1인당 인건비" subtitle="그룹 합계 기준 (백만원)" config={perCapitaConfig} />
      </div>
      <div className="section-title">인건비 상세 (법인별, 백만원)</div>
      <DataTable headers={headers} rows={rows} />
    </div>
  );
}
