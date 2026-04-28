import { dashboardData as D } from '../dashboard/dashboardDataModel.js';
import { buildInsightTraceMap, buildInsightsFeed } from '../insights/generateInsights.js';

export function buildDashboardCopilotContext() {
  const insights = buildInsightsFeed(D).slice(0, 20);
  const traceMap = buildInsightTraceMap(insights);

  return {
    scope: 'hr-dashboard',
    companies: D.companies,
    years: D.years,
    latestYear: D.years[D.years.length - 1],
    summary: {
      groupTotal: D.groupTotal,
      turnover: D.turnover,
      laborTotal: D.laborTotal,
      insights,
      insight_trace_map: traceMap,
    },
  };
}
