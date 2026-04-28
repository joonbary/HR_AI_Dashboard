import { COPILOT_APP_SCOPES, getCopilotEndpoint } from './copilotRoutes';

export async function sendCopilotMessage({
  app = COPILOT_APP_SCOPES.dashboard,
  message,
  history = [],
  context = {},
}) {
  const response = await fetch(getCopilotEndpoint(app), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app,
      message,
      history,
      context: JSON.stringify({ app, ...context }),
    }),
  });

  if (!response.ok) {
    throw new Error(`Copilot request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.answer || data.reply || 'Unable to process Copilot response.';
}
