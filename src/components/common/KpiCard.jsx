/**
 * KPI 지표 카드
 * @param {string} label - 지표명
 * @param {string|number} value - 지표값
 * @param {string} sub - 부가 정보 (예: YoY %)
 * @param {'up'|'down'|''} trend - 트렌드 방향
 */
export default function KpiCard({ label, value, sub, trend = '' }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className={`kpi-sub ${trend}`}>{sub}</div>}
    </div>
  );
}
