import { CopilotPanel, FilterBar, TopBar, useDashboardStore } from './features/hr-dashboard';
import { useCopilotStore } from './shared/store';
import WorkforceTab from './features/hr-dashboard/tabs/WorkforceTab';
import PerformanceTab from './features/hr-dashboard/tabs/PerformanceTab';
import AITab from './features/hr-dashboard/tabs/AITab';
import RiskTab from './features/hr-dashboard/tabs/RiskTab';
import InsightsTab from './features/hr-dashboard/tabs/InsightsTab';
import ExecTab from './features/hr-dashboard/tabs/ExecTab';
import OrgTab from './features/hr-dashboard/tabs/OrgTab';
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
  const activeTab = useDashboardStore((s) => s.activeTab);
  const copilotOpen = useCopilotStore((s) => s.copilotOpen);
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
