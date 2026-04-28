import { PersonnelApp as PersonnelTab } from '../../src/features/personnel';
import '../../src/styles/theme.css';

const dashboardHref = `${import.meta.env.BASE_URL}`;

export default function App() {
  return (
    <div className="shell">
      <div className="shell-main">
        <header className="topbar">
          <div className="topbar-logo">?뺢린?몄궗 Application</div>
          <nav className="topbar-tabs">
            <span className="topbar-tab active" style={{ cursor: 'default' }}>2026 ?섎컲湲??뺢린?몄궗</span>
          </nav>
          <div className="topbar-actions">
            <a className="btn" href={dashboardHref} style={{ textDecoration: 'none' }}>
              HR Dashboard
            </a>
          </div>
        </header>
        <div className="content-area" style={{ padding: 0 }}>
          <PersonnelTab />
        </div>
      </div>
    </div>
  );
}
