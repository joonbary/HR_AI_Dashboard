import { useMemo } from 'react';
import useDashboardStore from '../store/dashboardStore';
import { dashboardData as D } from '../../../services/dashboard/dashboardDataModel';
import useFilteredData from '../../../hooks/useFilteredData';
import KpiCard from '../../../shared/ui/common/KpiCard';
import ChartCard from '../../../shared/ui/charts/ChartCard';
import { BINARY_PALETTE, CHART_COLORS, CATEGORY_PALETTE, NEUTRAL_PALETTE, getPaletteColor } from '../../../styles/chartPalette';

const ACCENT = CHART_COLORS.primary;

function MetricTableCard({ title, subtitle, headers, rows }) {
  return (
    <div className="chart-card" style={{ overflowX: 'auto' }}>
      <div className="chart-title">{title}</div>
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}
      <table className="data-table" style={{ marginTop: 0 }}>
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={ci > 0 ? { textAlign: 'right' } : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WorkforceTab() {
  const { company } = useDashboardStore();
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
          backgroundColor: labels.map((_, i) => getPaletteColor(i, CATEGORY_PALETTE)),
          borderRadius: 4,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    };
  }, [fd.latestYear]);

  const jobtypeRows = useMemo(() => {
    const jobMap = {};
    const cos = company === 'ALL' ? D.companies : [company];
    cos.forEach(co => {
      const yd = D.jobtypeByCo?.[co]?.[fd.latestYear] || {};
      Object.entries(yd).forEach(([jt, cnt]) => {
        jobMap[jt] = (jobMap[jt] || 0) + cnt;
      });
    });
    const total = Object.values(jobMap).reduce((sum, value) => sum + value, 0);
    return Object.entries(jobMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => [
        name,
        Math.round(value).toLocaleString(),
        total > 0 ? `${(value / total * 100).toFixed(1)}%` : '-',
      ]);
  }, [company, fd.latestYear]);

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
          { label: '입사', data: entryData, backgroundColor: CHART_COLORS.blue, borderRadius: 4 },
          { label: '퇴사', data: resignData, backgroundColor: CHART_COLORS.danger, borderRadius: 4 },
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
        datasets: [{
          data: [m, f],
          backgroundColor: [BINARY_PALETTE.secondary, BINARY_PALETTE.primary],
          borderColor: '#fff',
          borderWidth: 2,
        }],
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
        datasets: [{
          data,
          backgroundColor: groups.map((_, i) => getPaletteColor(i, CATEGORY_PALETTE)),
          borderColor: '#fff',
          borderWidth: 2,
        }],
      },
      options: { plugins: { legend: { position: 'right', labels: { font: { size: 10 } } } } },
    };
  }, [fd.latestYear]);

  const turnoverLineConfig = useMemo(() => {
    const labels = D.years;
    return {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '그룹 이직률',
          data: labels.map(y => Math.round((D.turnover?.[y] || 0) * 1000) / 10),
          borderColor: ACCENT,
          backgroundColor: CHART_COLORS.primarySoft,
          fill: true,
          tension: 0.3,
          pointRadius: 4,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, title: { display: true, text: '%' } } },
      },
    };
  }, []);

  const avgAgeConfig = useMemo(() => {
    const labels = D.companies;
    const data = labels.map(co => D.avgAge?.[co] || 0);
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: labels.map((_, i) => getPaletteColor(i, NEUTRAL_PALETTE)),
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
  const tableHeaders = ['법인', ...D.years.map(String), '전년 대비'];
  const tableRows = D.companies.map(co => {
    const row = [co];
    D.years.forEach(y => row.push((D.headcount[co]?.[y] || 0).toLocaleString()));
    const cur = D.headcount[co]?.[fd.latestYear] || 0;
    const prev = D.headcount[co]?.[fd.latestYear - 1] || 0;
    const delta = prev > 0 ? ((cur - prev) / prev * 100).toFixed(1) + '%' : '-';
    row.push(delta);
    return row;
  });

  const turnoverRows = D.companies.map(co => [
    co,
    ...D.years.map(y => {
      const value = D.turnoverByCompany[co]?.[y];
      return value ? `${(value * 100).toFixed(1)}%` : '-';
    }),
  ]);

  return (
    <div>
      {/* KPI */}
      <div className="kpi-row">
        <KpiCard label="그룹 인원" value={fd.totalHeadcount.toLocaleString() + '명'} sub={`전년 대비 ${fd.yoy > 0 ? '+' : ''}${fd.yoy}% (${fd.yoyDelta > 0 ? '+' : ''}${fd.yoyDelta}명)`} trend={fd.yoy >= 0 ? 'up' : 'down'} />
        <KpiCard label="이직률" value={fd.turnoverRate + '%'} sub={`${fd.latestYear} 기준`} />
        <KpiCard label="평균 연령" value={(D.avgAge?.['그룹'] || '-') + '세'} sub="2025 기준" />
      </div>

      {/* Charts Row 1 */}
      <div className="chart-grid chart-grid-2">
        <ChartCard title="법인별 인원" subtitle={`${fd.latestYear} 기준 법인별 재직자 수`} config={companyBarConfig} />
        <MetricTableCard
          title="직종별 구성"
          subtitle={`${fd.latestYear} 기준 직종별 인원 및 비중`}
          headers={['직종', '인원', '비중']}
          rows={jobtypeRows}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="chart-grid chart-grid-2">
        <ChartCard title="직군별 구성" subtitle={`${fd.latestYear} 기준 직군 분포`} config={jobGroupConfig} />
        <MetricTableCard
          title="법인별 인원 추이"
          subtitle="연도별 인원 변화와 전년 대비"
          headers={tableHeaders}
          rows={tableRows}
        />
      </div>

      {/* Charts Row 3 */}
      <div className="chart-grid chart-grid-2">
        <ChartCard title="입사·퇴사 추이" subtitle="연도별 입사자·퇴사자 수" config={entryResignConfig} />
        <ChartCard title="성별 구성" subtitle="2025 기준" config={genderConfig} />
      </div>

      {/* Charts Row 4: 이직률 */}
      <div className="chart-grid chart-grid-2">
        <ChartCard title="그룹 이직률 추이" subtitle="전체 이직률 (%)" config={turnoverLineConfig} />
        <MetricTableCard
          title="법인별 이직률"
          subtitle="연도별 법인별 이직률 (%)"
          headers={['법인', ...D.years.map(String)]}
          rows={turnoverRows}
        />
      </div>

      {/* Charts Row 5 */}
      <div className="chart-grid chart-grid-2">
        <ChartCard title="평균연령" subtitle="법인별 평균 연령 (2025)" config={avgAgeConfig} />
        <div />
      </div>
    </div>
  );
}
