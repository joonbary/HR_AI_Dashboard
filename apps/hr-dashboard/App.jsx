import { CopilotPanel, FilterBar, TopBar, useDashboardStore } from '../../src/features/hr-dashboard';
import { useCopilotStore } from '../../src/shared/store';
import WorkforceTab from '../../src/features/hr-dashboard/tabs/WorkforceTab';
import PerformanceTab from '../../src/features/hr-dashboard/tabs/PerformanceTab';
import AITab from '../../src/features/hr-dashboard/tabs/AITab';
import RiskTab from '../../src/features/hr-dashboard/tabs/RiskTab';
import InsightsTab from '../../src/features/hr-dashboard/tabs/InsightsTab';
import ExecTab from '../../src/features/hr-dashboard/tabs/ExecTab';
import OrgTab from '../../src/features/hr-dashboard/tabs/OrgTab';
import '../../src/styles/theme.css';

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
