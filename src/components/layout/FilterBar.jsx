import useStore from '../../store/useStore';
import { D } from '../../data/dashboardData';

const COMPANY_OPTIONS = [
  { value: 'ALL', label: '전체 그룹' },
  ...D.companies.map(co => ({ value: co, label: co })),
];

const YEAR_OPTIONS = [
  { value: 'ALL', label: '전체' },
  ...D.years.map(y => ({ value: String(y), label: String(y) })),
];

export default function FilterBar() {
  const { company, year, setCompany, setYear } = useStore();

  return (
    <div className="filterbar">
      <span className="filter-label">법인</span>
      <select
        className="filter-select"
        value={company}
        onChange={e => setCompany(e.target.value)}
      >
        {COMPANY_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <span className="filter-label" style={{ marginLeft: 16 }}>기간</span>
      {YEAR_OPTIONS.map(o => (
        <button
          key={o.value}
          className={`filter-chip ${year === o.value ? 'active' : ''}`}
          onClick={() => setYear(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
