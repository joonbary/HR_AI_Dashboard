import { D as rawDashboardData } from '../../data/dashboardData.js';
import {
  DASHBOARD_COMPANY_CODES,
  DASHBOARD_COMPANY_LABELS,
  INSIGHT_CATEGORY_CANONICAL,
  INSIGHT_TAB_LABELS,
} from '../../shared/constants/dashboardTaxonomy.js';

const CATEGORY_ALIAS_BY_KEY = {
  '\uACBD\uC601\uC9C4\uC9C0\uC2DC': '\uACBD\uC601\uC9C4 \uC9C0\uC2DC',
  '\uC8FC\uC694\uBCF4\uACE0': '\uC8FC\uC694 \uBCF4\uACE0',
  '\uC81C\uB3C4\uBCC0\uACBD': '\uC81C\uB3C4 \uBCC0\uACBD',
  '\uC778\uB825\uBC29\uCE68': '\uC778\uB825 \uBC29\uCE68',
  '\uC678\uBD80\uD658\uACBD': '\uC678\uBD80 \uD658\uACBD',
  'AI\uC804\uD658': 'AI \uC804\uD658',
  '\uC778\uAC74\uBE44\uBCC0\uB3D9': '\uC778\uAC74\uBE44 \uBCC0\uB3D9',
};

const TAB_ALIAS_BY_KEY = {
  '\uC778\uB825\uD604\uD669': '\uC778\uB825\uD604\uD669',
  '\uC131\uACFC\uBCF4\uC0C1': '\uC131\uACFC\u00B7\uBCF4\uC0C1',
  'AI\uC804\uD658': 'AI \uC804\uD658',
  '\uB9AC\uC2A4\uD06C': '\uB9AC\uC2A4\uD06C',
  'HR\uC778\uC0AC\uC774\uD2B8': 'HR \uC778\uC0AC\uC774\uD2B8',
  '\uC784\uC6D0\uC694\uC57D': '\uC784\uC6D0 \uC694\uC57D',
  '\uC870\uC9C1\uB3C4': '\uC870\uC9C1\uB3C4',
};

function normalizeKey(value) {
  return String(value || '')
    .replace(/[·\s]/g, '')
    .trim();
}

function normalizeCategory(value) {
  const raw = String(value || '').trim();
  const normalized = CATEGORY_ALIAS_BY_KEY[normalizeKey(raw)] || raw;
  return INSIGHT_CATEGORY_CANONICAL[normalized] || '\uC8FC\uC694 \uBCF4\uACE0';
}

function normalizeTab(value) {
  const raw = String(value || '').trim();
  const normalized = TAB_ALIAS_BY_KEY[normalizeKey(raw)] || raw;
  return INSIGHT_TAB_LABELS[normalized] || normalized || 'HR \uC778\uC0AC\uC774\uD2B8';
}

function normalizeImportance(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'red' || raw === '\uC0C1') return '\uC0C1';
  if (raw === 'orange' || raw === '\uC911') return '\uC911';
  if (raw === 'yellow' || raw === '\uD558') return '\uD558';
  return '\uC911';
}

function normalizeInsights(insights = []) {
  return insights.map((item) => ({
    ...item,
    cat: normalizeCategory(item.cat),
    tab: normalizeTab(item.tab),
    imp: normalizeImportance(item.imp),
    title: String(item.title || '').trim(),
    content: String(item.content || '').trim(),
    date: String(item.date || '').trim(),
  }));
}

function normalizeCompanies(data) {
  const normalized = { ...data };
  normalized.companies = [...DASHBOARD_COMPANY_CODES];
  normalized.companyLabels = DASHBOARD_COMPANY_CODES.map((code) => DASHBOARD_COMPANY_LABELS[code]);
  normalized.companyMap = Object.fromEntries(
    DASHBOARD_COMPANY_CODES.map((code) => [code, DASHBOARD_COMPANY_LABELS[code]]),
  );

  if (Array.isArray(normalized.awta)) {
    normalized.awta = normalized.awta.map((item) => ({
      ...item,
      co: DASHBOARD_COMPANY_LABELS[item.key] || item.co,
    }));
  }

  return normalized;
}

export function normalizeDashboardData(raw) {
  const cloned = structuredClone(raw || {});
  const normalizedCompanies = normalizeCompanies(cloned);
  normalizedCompanies.insights = normalizeInsights(cloned.insights || []);
  return normalizedCompanies;
}

export function validateDashboardData(data) {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(data.companies) || data.companies.length === 0) {
    errors.push('companies is empty');
  }
  if (!Array.isArray(data.years) || data.years.length === 0) {
    errors.push('years is empty');
  }
  if (!data.headcount || typeof data.headcount !== 'object') {
    errors.push('headcount is missing');
  } else {
    data.companies.forEach((company) => {
      if (!data.headcount[company]) {
        warnings.push(`headcount missing for ${company}`);
      }
    });
  }
  if (!Array.isArray(data.insights)) {
    errors.push('insights is not an array');
  } else {
    data.insights.forEach((item, index) => {
      if (!item.date || !item.title || !item.content) {
        warnings.push(`insights[${index}] has empty fields`);
      }
    });
  }

  return { ok: errors.length === 0, errors, warnings };
}

export const dashboardData = normalizeDashboardData(rawDashboardData);
export const dashboardDataValidation = validateDashboardData(dashboardData);

if (import.meta.env?.DEV && (!dashboardDataValidation.ok || dashboardDataValidation.warnings.length > 0)) {
  console.warn('[dashboardDataModel] validation report', dashboardDataValidation);
}

