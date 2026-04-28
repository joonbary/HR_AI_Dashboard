export const CHART_COLORS = {
  primary: '#E8572A',
  primarySoft: 'rgba(232, 87, 42, 0.14)',
  primaryFaint: 'rgba(232, 87, 42, 0.08)',
  navy: '#2F4A5C',
  navySoft: 'rgba(47, 74, 92, 0.14)',
  gold: '#D7A13B',
  goldSoft: 'rgba(215, 161, 59, 0.16)',
  teal: '#4C8A81',
  tealSoft: 'rgba(76, 138, 129, 0.14)',
  plum: '#806A7A',
  slate: '#7B8790',
  neutral: '#B8C0C6',
  neutralSoft: '#E8ECEF',
  positive: '#4C8A68',
  positiveSoft: 'rgba(76, 138, 104, 0.14)',
  warning: '#D7A13B',
  warningSoft: 'rgba(215, 161, 59, 0.16)',
  danger: '#C95C54',
  dangerSoft: 'rgba(201, 92, 84, 0.14)',
  blue: '#5C7895',
  blueSoft: 'rgba(92, 120, 149, 0.14)',
};

export const CATEGORY_PALETTE = [
  '#E8572A',
  '#2F4A5C',
  '#D7A13B',
  '#4C8A81',
  '#806A7A',
  '#7B8790',
  '#B8C0C6',
];

export const NEUTRAL_PALETTE = [
  '#2F4A5C',
  '#5C7895',
  '#7B8790',
  '#9AA4AA',
  '#B8C0C6',
  '#D2D8DC',
];

export const BINARY_PALETTE = {
  primary: '#D85A2A',
  secondary: '#2F4A5C',
};

export const GRADE_COLORS = {
  S: '#B94B2A',
  'A+': '#D85A2A',
  A: '#C99536',
  'B+': '#7D8A73',
  B: '#6E879D',
  C: '#A8AFB6',
  D: '#C95C54',
};

export function getPaletteColor(index, palette = CATEGORY_PALETTE) {
  return palette[index % palette.length];
}
