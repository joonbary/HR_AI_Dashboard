/**
 * KPI 吏??移대뱶
 * @param {string} label - 吏?쒕챸
 * @param {string|number} value - 吏?쒓컪
 * @param {string} sub - 遺媛 ?뺣낫 (?? YoY %)
 * @param {'up'|'down'|''} trend - ?몃젋??諛⑺뼢
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
