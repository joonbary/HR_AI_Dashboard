import usePersonnelStore from './store/personnelStore';
import CandidateExplorer from './components/CandidateExplorer';
import CalibrationView from './components/CalibrationView';
import HRPlanView from './components/HRPlanView';
import ReportView from './components/ReportView';
import CeremonyView from './components/CeremonyView';
import DecisionLogBar from './components/DecisionLogBar';

const SUB_TABS = [
  { id: 'explore', label: '\uB300\uC0C1\uC790 \uD0D0\uC0C9' },
  { id: 'calibration', label: '\uCE98\uB9AC\uBE0C\uB808\uC774\uC158' },
  { id: 'plan', label: '\uC778\uC0AC\uC548' },
  { id: 'report', label: '\uBCF4\uACE0 \uBAA8\uB4DC' },
  { id: 'ceremony', label: '\uC138\uB808\uBAA8\uB2C8' },
];

const SUB_TAB_COMPONENTS = {
  explore: CandidateExplorer,
  calibration: CalibrationView,
  plan: HRPlanView,
  report: ReportView,
  ceremony: CeremonyView,
};

export default function PersonnelTab() {
  const { activeSubTab, setActiveSubTab, phase } = usePersonnelStore();
  const ActiveSubComponent = SUB_TAB_COMPONENTS[activeSubTab] || CandidateExplorer;

  const now = new Date();
  const baselineDate = new Date('2026-07-01');
  const daysRemaining = Math.ceil((baselineDate - now) / (1000 * 60 * 60 * 24));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {'2026 \uD558\uBC18\uAE30 \uC815\uAE30\uC778\uC0AC'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {'\uC815\uAE30\uC778\uC0AC \uD504\uB85C\uC138\uC2A4 \uAD00\uB9AC \uBC0F \uC2DC\uBBAC\uB808\uC774\uC158'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              textAlign: 'center',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--divider)',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{'\uB514\uB370\uC774'}</div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--accent)',
                marginTop: '2px',
              }}
            >
              D{daysRemaining >= 0 ? '-' : '+'}{Math.abs(daysRemaining)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['A', 'B', 'C', 'D'].map((p) => (
              <div
                key={p}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  backgroundColor: phase === p ? 'var(--accent)' : 'var(--bg-subtle)',
                  color: phase === p ? '#fff' : 'var(--text-muted)',
                  border: phase === p ? 'none' : '1px solid var(--divider)',
                }}
              >
                {'\uB2E8\uACC4'} {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '0 20px',
          borderBottom: '1px solid var(--divider)',
          display: 'flex',
          gap: '0',
          backgroundColor: 'var(--bg)',
        }}
      >
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '13px',
              fontWeight: activeSubTab === tab.id ? '600' : '500',
              color: activeSubTab === tab.id ? 'var(--accent)' : 'var(--text-body)',
              borderBottom: activeSubTab === tab.id ? '2px solid var(--accent)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px 24px',
          paddingBottom: '80px',
        }}
      >
        <ActiveSubComponent />
      </div>

      <DecisionLogBar />
    </div>
  );
}
