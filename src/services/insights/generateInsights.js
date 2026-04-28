function toPercentPoint(value) {
  return (value * 100).toFixed(1);
}

function sumByCompanies(companies, sourceByCompany, year) {
  return companies.reduce((sum, company) => sum + (sourceByCompany?.[company]?.[year] || 0), 0);
}

function makeRuleInsight({
  id,
  traceId,
  badges,
  trace,
  title,
  content,
  cat,
  tab,
  imp,
  date,
}) {
  return {
    id,
    trace_id: traceId,
    badges,
    trace,
    date,
    cat,
    imp,
    title,
    content,
    tab,
    source: 'rule',
  };
}

function generateRuleInsights(data) {
  const insights = [];
  const years = data.years || [];
  if (years.length < 2) return insights;

  const latestYear = years[years.length - 1];
  const prevYear = years[years.length - 2];
  const latestDate = `${latestYear}-12-31`;
  const companies = data.companies || [];

  const latestTurnover = data.turnover?.[latestYear] || 0;
  const prevTurnover = data.turnover?.[prevYear] || 0;
  const turnoverDeltaPp = (latestTurnover - prevTurnover) * 100;
  if (Math.abs(turnoverDeltaPp) >= 1.0) {
    insights.push(
      makeRuleInsight({
        id: `rule-turnover-${latestYear}`,
        traceId: `turnover_delta:${latestYear}`,
        badges: ['turnover_delta'],
        trace: {
          metric: 'turnover_delta',
          latest_year: latestYear,
          prev_year: prevYear,
          latest_rate_pct: Number(toPercentPoint(latestTurnover)),
          prev_rate_pct: Number(toPercentPoint(prevTurnover)),
          delta_pp: Number(turnoverDeltaPp.toFixed(1)),
        },
        date: latestDate,
        cat: '\uC8FC\uC694 \uBCF4\uACE0',
        tab: '\uC778\uB825\uD604\uD669',
        imp: turnoverDeltaPp > 0 ? '\uC0C1' : '\uC911',
        title: `\uADF8\uB8F9 \uC774\uC9C1\uB960 ${turnoverDeltaPp > 0 ? '\uC0C1\uC2B9' : '\uD558\uB77D'} \uCD94\uC138 \uC810\uAC80`,
        content: `${latestYear}\uB144 \uADF8\uB8F9 \uC774\uC9C1\uB960\uC740 ${toPercentPoint(latestTurnover)}%\uB85C ${prevYear}\uB144 \uB300\uBE44 ${Math.abs(turnoverDeltaPp).toFixed(1)}%p ${turnoverDeltaPp > 0 ? '\uC0C1\uC2B9' : '\uD558\uB77D'}\uD588\uC2B5\uB2C8\uB2E4.`,
      }),
    );
  }

  const latestLabor = data.laborTotal?.[latestYear] || sumByCompanies(companies, data.laborCost, latestYear);
  const prevLabor = data.laborTotal?.[prevYear] || sumByCompanies(companies, data.laborCost, prevYear);
  const laborDeltaPct = prevLabor > 0 ? ((latestLabor - prevLabor) / prevLabor) * 100 : 0;
  if (Math.abs(laborDeltaPct) >= 8) {
    insights.push(
      makeRuleInsight({
        id: `rule-labor-${latestYear}`,
        traceId: `labor_delta:${latestYear}`,
        badges: ['labor_delta'],
        trace: {
          metric: 'labor_delta',
          latest_year: latestYear,
          prev_year: prevYear,
          latest_labor_million_krw: latestLabor,
          prev_labor_million_krw: prevLabor,
          delta_pct: Number(laborDeltaPct.toFixed(1)),
        },
        date: latestDate,
        cat: '\uC778\uAC74\uBE44 \uBCC0\uB3D9',
        tab: '\uC131\uACFC\u00B7\uBCF4\uC0C1',
        imp: laborDeltaPct > 0 ? '\uC911' : '\uD558',
        title: '\uADF8\uB8F9 \uC778\uAC74\uBE44 \uBCC0\uB3D9 \uD3ED \uD655\uB300',
        content: `${latestYear}\uB144 \uADF8\uB8F9 \uC778\uAC74\uBE44\uB294 ${latestLabor.toLocaleString()}\uBC31\uB9CC \uC6D0\uC73C\uB85C ${prevYear}\uB144 \uB300\uBE44 ${laborDeltaPct.toFixed(1)}% \uBCC0\uB3D9\uD588\uC2B5\uB2C8\uB2E4.`,
      }),
    );
  }

  const latestAAbove = data.aAbove?.[latestYear] || 0;
  if (latestAAbove >= 0.35) {
    insights.push(
      makeRuleInsight({
        id: `rule-aabove-${latestYear}`,
        traceId: `a_above_rate:${latestYear}`,
        badges: ['a_above_rate'],
        trace: {
          metric: 'a_above_rate',
          latest_year: latestYear,
          latest_rate_pct: Number(toPercentPoint(latestAAbove)),
          threshold_pct: 35,
          exceeds_threshold: true,
        },
        date: latestDate,
        cat: '\uC8FC\uC694 \uBCF4\uACE0',
        tab: '\uC131\uACFC\u00B7\uBCF4\uC0C1',
        imp: '\uC911',
        title: 'A \uC774\uC0C1 \uBE44\uC728 \uC0C1\uD68C \uC5EC\uBD80 \uC810\uAC80',
        content: `${latestYear}\uB144 A \uC774\uC0C1 \uBE44\uC728\uC740 ${toPercentPoint(latestAAbove)}%\uB85C \uAD00\uB9AC \uAE30\uC900(35%)\uC744 \uC0C1\uD68C\uD588\uC2B5\uB2C8\uB2E4.`,
      }),
    );
  }

  const awtaPossible = (data.awta || []).reduce((sum, item) => sum + (item.possible || 0), 0);
  const awtaStarted = (data.awta || []).reduce((sum, item) => sum + (item.started || 0), 0);
  const awtaRate = awtaPossible > 0 ? (awtaStarted / awtaPossible) * 100 : 0;
  if (awtaPossible > 0 && awtaRate < 30) {
    insights.push(
      makeRuleInsight({
        id: `rule-awta-${latestYear}`,
        traceId: `awta_start_rate:${latestYear}`,
        badges: ['awta_start_rate'],
        trace: {
          metric: 'awta_start_rate',
          latest_year: latestYear,
          started_tasks: awtaStarted,
          possible_tasks: awtaPossible,
          start_rate_pct: Number(awtaRate.toFixed(1)),
          target_pct: 30,
        },
        date: latestDate,
        cat: 'AI \uC804\uD658',
        tab: 'AI \uC804\uD658',
        imp: '\uC911',
        title: 'AI \uACFC\uC81C \uCC29\uC218\uC728 \uAC1C\uC120 \uD544\uC694',
        content: `AI \uAC00\uB2A5 \uACFC\uC81C \uB300\uBE44 \uCC29\uC218\uC728\uC740 ${awtaRate.toFixed(1)}%\uC785\uB2C8\uB2E4. \uBAA9\uD45C \uB300\uBE44 \uACA9\uCC28 \uCD95\uC18C\uB97C \uC704\uD55C \uC6B0\uC120 \uACFC\uC81C \uAD00\uB9AC\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.`,
      }),
    );
  }

  return insights;
}

function sortByDateDesc(items = []) {
  return [...items].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
}

export function buildInsightsFeed(data) {
  const base = (data.insights || []).map((item, index) => ({
    ...item,
    id: item.id || `base-${index}`,
    source: item.source || 'manual',
    trace_id: item.trace_id || null,
    badges: item.badges || [],
    trace: item.trace || null,
  }));
  const generated = generateRuleInsights(data);
  return sortByDateDesc([...generated, ...base]);
}

export function buildInsightTraceMap(insights = []) {
  return insights.reduce((acc, insight) => {
    if (!insight.trace_id) return acc;
    acc[insight.trace_id] = {
      id: insight.id,
      date: insight.date,
      cat: insight.cat,
      imp: insight.imp,
      title: insight.title,
      badges: insight.badges || [],
      trace: insight.trace || null,
      source: insight.source || 'unknown',
    };
    return acc;
  }, {});
}

