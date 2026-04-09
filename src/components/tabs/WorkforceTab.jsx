import { useMemo } from 'react';
import useStore from '../../store/useStore';
import { D } from '../../data/dashboardData';
import useFilteredData from '../../hooks/useFilteredData';
import KpiCard from '../common/KpiCard';
import ChartCard from '../charts/ChartCard';
import DataTable from '../common/DataTable';

const ACCENT = '#E8572A';
const COLORS = ['#E8572A','#F77310','#FCAF17','#7AB648','#3498DB','#9B59B6','#1ABC9C','#34495E','#E74C3C','#2ECC71','#F39C12','#8E44AD','#16A085'];

export default function WorkforceTab() {
  const { company, year } = useStore();
  const fd = useFilteredData();

  // ── Chart configs ──
  const companyBarConfig = useMemo(() => {
    const labels = D.companies;
    const data = labels.map(co => D.headcount[co]?.[fd.latestYear] || 0);
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
          borderRadius: 4,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    };
  }, [fd.latestYear]);

  const jobtypeConfig = useMemo(() => {
    // 직종별 합산
    const jobMap = {};
    const cos = company === 'ALL' ? D.companies : [company];
    cos.forEach(co => {
      const yd = D.jobtypeByCo?.[co]?.[fd.latestYear] || {};
      Object.entries(yd).forEach(([jt, cnt]) => {
        jobMap[jt] = (jobMap[jt] || 0) + cnt;
      });
    });
    const sorted = Object.entries(jobMap).sort((a, b) => b[1] - a[1]);
    return {
      type: 'doughnut',
      data: {
        labels: sorted.map(s => s[0]),
        datasets: [{
          data: sorted.map(s => s[1]),
          backgroundColor: sorted.map((_, i) => COLORS[i % COLORS.length]),
        }],
      },
      options: {
        plugins: { legend: { position: 'right', labels: { font: { size: 10 } } } },
      },
    };
  }, [company, fd.latestYear]);

  const trendLineConfig = useMemo(() => {
    const labels = D.years;
    const datasets = D.companies.map((co, i) => ({
      label: co,
      data: labels.map(y => D.headcount[co]?.[y] || 0),
      borderColor: COLORS[i],
      backgroundColor: 'transparent',
      tension: 0.3,
      pointRadius: 3,
    }));
    return {
      type: 'line',
      data: { labels, datasets },
      options: { plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } },
    };
  }, []);

  const entryResignConfig = useMemo(() => {
    const labels = D.years;
    const cos = company === 'ALL' ? D.companies : [company];
    const entryData = labels.map(y => cos.reduce((s, co) => s + (D.entry[co]?.[y] || 0), 0));
    const resignData = labels.map(y => cos.reduce((s, co) => s + (D.resign[co]?.[y] || 0), 0));
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: '입사', data: entryData, backgroundColor: '#3498DB', borderRadius: 4 },
          { label: '퇴사', data: resignData, backgroundColor: '#E74C3C', borderRadius: 4 },
        ],
      },
      options: { plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } },
    };
  }, [company]);

  const genderConfig = useMemo(() => {
    const cos = company === 'ALL' ? D.companies : [company];
    let m = 0, f = 0;
    cos.forEach(co => {
      m += D.gender2025?.[co]?.m || 0;
      f += D.gender2025?.[co]?.f || 0;
    });
    return {
      type: 'doughnut',
      data: {
        labels: ['남성', '여성'],
        datasets: [{ data: [m, f], backgroundColor: ['#3498DB', '#E74C3C'] }],
      },
      options: { plugins: { legend: { position: 'bottom' } } },
    };
  }, [company]);

  const jobGroupConfig = useMemo(() => {
    const groups = Object.keys(D.jobgroupYearly || {});
    const data = groups.map(g => D.jobgroupYearly[g]?.[fd.latestYear] || 0);
    return {
      type: 'doughnut',
      data: {
        labels: groups,
        datasets: [{ data, backgroundColor: groups.map((_, i) => COLORS[i]) }],
      },
      options: { plugins: { legend: { position: 'right', labels: { font: { size: 10 } } } } },
    };
  }, [fd.latestYear]);

  const avgAgeConfig = useMemo(() => {
    const labels = D.companies;
    const data = labels.map(co => D.avgAge?.[co] || 0);
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: labels.map((_, i) => COLORS[i]),
          borderRadius: 4,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false, min: 30 } },
      },
    };
  }, []);

  // ── Data Table ──
  const tableHeaders = ['법인', ...D.years.map(String), 'YoY'];
  const tableRows = D.companies.map(co => {
    const row = [co];
    D.years.forEach(y => row.push((D.headcount[co]?.[y] || 0).toLocaleString()));
    const cur = D.headcount[co]?.[fd.latestYear] || 0;
    const prev = D.headcount[co]?.[fd.latestYear - 1] || 0;
    const delta = prev > 0 ? ((cur - prev) / prev * 100).toFixed(1) + '%' : '-';
    row.push(delta);
    return row;
  });

  return (
    <div>
      {/* KPI */}
      <div className="kpi-row">
        <KpiCard label="그룹 인원" value={fd.totalHeadcount.toLocaleString() + '명'} sub={`YoY ${fd.yoy > 0 ? '+' : ''}${fd.yoy}% (${fd.yoyDelta > 0 ? '+' : ''}${fd.yoyDelta}명)`} trend={fd.yoy >= 0 ? 'up' : 'down'} />
        <KpiCard label="이직률" value={fd.turnoverRate + '%'} sub={`${fd.latestYear} 기준`} />
        <KpiCard label="평균 연령" value={(D.avgAge?.['그룹'] || '-') + '세'} sub="2025 기준" />
      </div>

      {/* Charts Row 1 */}
      <div className="chart-grid chart-grid-2">
        <ChartCard title="법인별 인원" subtitle={`${fd.latestYear} 기준 법인별 재직자 수`} config={companyBarConfig} />
        <ChartCard title="직종별 구성" subtitle={`${fd.latestYear} 기준 직종 분포`} config={jobtypeConfig} />
      </div>

      {/* Charts Row 2 */}
      <div className="chart-grid chart-grid-2">
        <ChartCard title="직군별 구성" subtitle={`${fd.latestYear} 기준 직군 분포`} config={jobGroupConfig} />
        <ChartCard title="그룹 인원 추이" subtitle="법인별 연도별 인원 변화" config={trendLineConfig} />
      </div>

      {/* Charts Row 3 */}
      <div className="chart-grid chart-grid-2">
        <ChartCard title="입사·퇴사 추이" subtitle="연도별 입사자·퇴사자 수" config={entryResignConfig} />
        <ChartCard title="성별 구성" subtitle="2025 기준" config={genderConfig} />
      </div>

      {/* Charts Row 4 */}
      <div className="chart-grid chart-grid-2">
        <ChartCard title="평균연령" subtitle="법인별 평균 연령 (2025)" config={avgAgeConfig} />
        <div /> {/* placeholder */}
      </div>

      {/* Table */}
      <div className="section-title">법인 × 연도 인력 매트릭스</div>
      <DataTable headers={tableHeaders} rows={tableRows} />
    </div>
  );
}
