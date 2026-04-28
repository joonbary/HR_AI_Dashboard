export const COPILOT_APP_SCOPES = {
  dashboard: 'dashboard',
  personnel: 'personnel',
};

export function getCopilotEndpoint(app = COPILOT_APP_SCOPES.dashboard) {
  return `/api/copilot/${app}`;
}
