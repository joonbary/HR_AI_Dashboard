import useStore from '../../store/useStore';

const TABS = [
  { id: 'workforce', label: '인력현황' },
  { id: 'performance', label: '성과·보상' },
  { id: 'ai', label: 'AI전환' },
  { id: 'risk', label: '리스크' },
  { id: 'insight', label: 'HR인사이트' },
  { id: 'exec', label: '임원요약' },
  { id: 'org', label: '조직도' },
];

const CEO_TABS = ['workforce', 'risk', 'exec'];

export default function TopBar() {
  const { activeTab, setActiveTab, viewMode, setViewMode, toggleCopilot, copilotOpen } = useStore();

  const visibleTabs = viewMode === 'ceo'
    ? TABS.filter(t => CEO_TABS.includes(t.id))
    : TABS;

  return (
    <header className="topbar">
      <div className="topbar-logo">HR Dashboard</div>
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
          <option value="standard">Standard</option>
          <option value="ceo">CEO 모드</option>
        </select>
        <button
          className={`btn ${copilotOpen ? 'btn-primary' : ''}`}
          onClick={toggleCopilot}
          style={{ fontSize: '11px' }}
        >
          💬 Copilot
        </button>
      </div>
    </header>
  );
}
