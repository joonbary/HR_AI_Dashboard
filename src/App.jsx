import useStore from './store/useStore';
import TopBar from './components/layout/TopBar';
import FilterBar from './components/layout/FilterBar';
import WorkforceTab from './components/tabs/WorkforceTab';
import PerformanceTab from './components/tabs/PerformanceTab';
import AITab from './components/tabs/AITab';
import RiskTab from './components/tabs/RiskTab';
import InsightsTab from './components/tabs/InsightsTab';
import ExecTab from './components/tabs/ExecTab';
import OrgTab from './components/tabs/OrgTab';
import CopilotPanel from './components/copilot/CopilotPanel';
import './styles/theme.css';

const TAB_COMPONENTS = {
  workforce: WorkforceTab,
  performance: PerformanceTab,
  ai: AITab,
  risk: RiskTab,
  insight: InsightsTab,
  exec: ExecTab,
  org: OrgTab,
};

export default function App() {
  const { activeTab, copilotOpen } = useStore();
  const ActiveComponent = TAB_COMPONENTS[activeTab] || WorkforceTab;

  return (
    <div className="shell">
      <div className={`shell-main ${copilotOpen ? 'copilot-open' : ''}`}>
        <TopBar />
        <FilterBar />
        <div className="content-area">
          <ActiveComponent />
        </div>
      </div>
      <CopilotPanel />
    </div>
  );
}
