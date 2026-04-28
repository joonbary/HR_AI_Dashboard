import useDashboardStore from '../store/dashboardStore';
import useCopilotStore from '../../../shared/store/copilotStore';

const TABS = [
  { id: 'workforce', label: '인력현황' },
  { id: 'performance', label: '성과·보상' },
  { id: 'ai', label: 'AI 전환' },
  { id: 'risk', label: '리스크' },
  { id: 'insight', label: 'HR 인사이트' },
  { id: 'exec', label: '임원 요약' },
  { id: 'org', label: '조직도' },
];

const CEO_TABS = ['workforce', 'risk', 'exec'];
const personnelAppHref = `${import.meta.env.BASE_URL}apps/personnel-app/`;

export default function TopBar() {
  const { activeTab, setActiveTab, viewMode, setViewMode } = useDashboardStore();
  const { toggleCopilot, copilotOpen } = useCopilotStore();

  const visibleTabs = viewMode === 'ceo'
    ? TABS.filter(t => CEO_TABS.includes(t.id))
    : TABS;

  return (
    <header className="topbar">
      <div className="topbar-logo">HR 대시보드</div>
      <nav className="topbar-tabs">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            className={`topbar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="topbar-actions">
        <select
          className="filter-select"
          value={viewMode}
          onChange={e => setViewMode(e.target.value)}
          style={{ fontSize: '11px' }}
        >
          <option value="standard">표준 모드</option>
          <option value="ceo">경영진 모드</option>
        </select>
        <button
          className={`btn ${copilotOpen ? 'btn-primary' : ''}`}
          onClick={toggleCopilot}
          style={{ fontSize: '11px' }}
        >
          AI 코파일럿
        </button>
        <a className="btn" href={personnelAppHref} style={{ fontSize: '11px', textDecoration: 'none' }}>
          정기인사 앱
        </a>
      </div>
    </header>
  );
}
