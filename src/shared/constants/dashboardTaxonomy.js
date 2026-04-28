export const DASHBOARD_COMPANY_CODES = [
  'OKH',
  'OK',
  'OC',
  'ACI',
  'AFI',
  'OKAX',
  'ON+\uC18C\uADDC\uBAA8',
];

export const DASHBOARD_COMPANY_LABELS = {
  OKH: 'OK\uD640\uB529\uC2A4',
  OK: 'OK\uC800\uCD95\uC740\uD589',
  OC: 'OK\uCE90\uD53C\uD0C8',
  ACI: 'ACI\uC2E0\uC6A9\uC815\uBCF4',
  AFI: 'AFI\uC5D0\uD504\uC564\uC544\uC774',
  OKAX: 'OKAX',
  'ON+\uC18C\uADDC\uBAA8': 'ON+\uC18C\uADDC\uBAA8',
};

export const INSIGHT_CATEGORY_OPTIONS = [
  { value: '\uC804\uCCB4', label: '\uC804\uCCB4' },
  { value: '\uACBD\uC601\uC9C4 \uC9C0\uC2DC', label: '\uACBD\uC601\uC9C4 \uC9C0\uC2DC' },
  { value: '\uC8FC\uC694 \uBCF4\uACE0', label: '\uC8FC\uC694 \uBCF4\uACE0' },
  { value: '\uC81C\uB3C4 \uBCC0\uACBD', label: '\uC81C\uB3C4 \uBCC0\uACBD' },
  { value: '\uC778\uB825 \uBC29\uCE68', label: '\uC778\uB825 \uBC29\uCE68' },
  { value: '\uC678\uBD80 \uD658\uACBD', label: '\uC678\uBD80 \uD658\uACBD' },
  { value: 'AI \uC804\uD658', label: 'AI \uC804\uD658' },
  { value: '\uC778\uAC74\uBE44 \uBCC0\uB3D9', label: '\uC778\uAC74\uBE44 \uBCC0\uB3D9' },
];

export const INSIGHT_CATEGORY_CANONICAL = Object.fromEntries(
  INSIGHT_CATEGORY_OPTIONS
    .filter((option) => option.value !== '\uC804\uCCB4')
    .map((option) => [option.value, option.value]),
);

export const INSIGHT_IMPORTANCE_COLORS = {
  '\uC0C1': '#E74C3C',
  '\uC911': '#F39C12',
  '\uD558': '#2ECC71',
};

export const INSIGHT_TAB_LABELS = {
  '\uC778\uB825\uD604\uD669': '\uC778\uB825\uD604\uD669',
  '\uC131\uACFC\u00B7\uBCF4\uC0C1': '\uC131\uACFC\u00B7\uBCF4\uC0C1',
  'AI \uC804\uD658': 'AI \uC804\uD658',
  '\uB9AC\uC2A4\uD06C': '\uB9AC\uC2A4\uD06C',
  'HR \uC778\uC0AC\uC774\uD2B8': 'HR \uC778\uC0AC\uC774\uD2B8',
  '\uC784\uC6D0 \uC694\uC57D': '\uC784\uC6D0 \uC694\uC57D',
  '\uC870\uC9C1\uB3C4': '\uC870\uC9C1\uB3C4',
};

