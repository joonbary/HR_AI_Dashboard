import usePersonnelStore from '../../store/personnelStore';
import CandidateExplorer from '../personnel/CandidateExplorer';
import CalibrationView from '../personnel/CalibrationView';
import HRPlanView from '../personnel/HRPlanView';
import ReportView from '../personnel/ReportView';
import CeremonyView from '../personnel/CeremonyView';
import DecisionLogBar from '../personnel/DecisionLogBar';

const SUB_TABS = [
  { id: 'explore', label: '대상자 탐색' },
  { id: 'calibration', label: 'Calibration' },
  { id: 'plan', label: '인사안' },
  { id: 'report', label: '보고 모드' },
  { id: 'ceremony', label: '세레모니' },
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

  // D-day counter (simple mock — assume baselineDate = 2026-07-01)
  const now = new Date();
  const baselineDate = new Date('2026-07-01');
  const daysRemaining = Math.ceil((baselineDate - now) / (1000 * 60 * 60 * 24));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Header Bar */}
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
            2026 하반기 정기인사
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            정기인사 프로세스 관리 및 시뮬레이션
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* D-day Counter */}
          <div
            style={{
              textAlign: 'center',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--divider)',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>D-day</div>
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

          {/* Phase Chips */}
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
                Phase {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Tab Bar */}
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
            onMouseEnter={(e) => {
              if (activeSubTab !== tab.id) {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSubTab !== tab.id) {
                e.currentTarget.style.color = 'var(--text-body)';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px 24px',
          paddingBottom: '80px', // Make room for DecisionLogBar
        }}
      >
        <ActiveSubComponent />
      </div>

      {/* Decision Log Bar (fixed at bottom) */}
      <DecisionLogBar />
    </div>
  );
}
