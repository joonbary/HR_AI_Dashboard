import { GRADE_NUM } from '../data/personnelData';

export const ELIGIBILITY_BASE_DATE = '2026-07-01';

export const PROMOTION_CRITERIA = {
  'Lv.1_to_Lv.2': { minTenure: 1, minGrade: 'B', note: '\uCCB4\uB958 1\uB144 \uC774\uC0C1, B \uB4F1\uAE09 \uC774\uC0C1' },
  'Lv.2_to_Lv.3': { minTenure: 1, minGrade: 'A', note: '\uCCB4\uB958 1\uB144 \uC774\uC0C1, A \uB4F1\uAE09 \uC774\uC0C1 + \uC5ED\uB7C9 \uC2EC\uC758' },
  'Lv.3_to_Lv.4': { minTenure: 1, minGrade: 'A', note: '\uCCB4\uB958 1\uB144 \uC774\uC0C1, A \uB4F1\uAE09 \uC774\uC0C1 + \uC870\uC9C1 \uAE30\uC5EC \uC2EC\uC758' },
};

export const DISCIPLINE_RESTRICTION = {
  suspension: 18,
  payCut: 12,
  warning: 6,
};

export function calculateTenureYears(levelDate, today = ELIGIBILITY_BASE_DATE) {
  if (!levelDate) return null;

  const todayDate = new Date(today);
  const levelStartDate = new Date(levelDate);
  return Math.round(((todayDate - levelStartDate) / (365.25 * 24 * 60 * 60 * 1000)) * 10) / 10;
}

export function checkEligibility(candidate, today = ELIGIBILITY_BASE_DATE) {
  const reasons = [];
  const todayDate = new Date(today);
  const levelDate = candidate.levelDate ? new Date(candidate.levelDate) : null;

  if (!levelDate) {
    reasons.push('\uC9C1\uAE09 \uC2DC\uC791\uC77C \uB204\uB77D');
  } else {
    const tenureYears = (todayDate - levelDate) / (365.25 * 24 * 60 * 60 * 1000);
    if (tenureYears < 1) {
      reasons.push(`\uCCB4\uB958\uC5F0\uD55C \uBD80\uC871: ${tenureYears.toFixed(1)}\uB144 (\uCD5C\uC18C 1\uB144)`);
    }
  }

  const { level, finalGrade: grade } = candidate;
  const gradeNum = GRADE_NUM[grade] || 0;

  if (level === 'Lv.1' && gradeNum < GRADE_NUM.B) {
    reasons.push(`\uB4F1\uAE09 \uAE30\uC900 \uBBF8\uB2EC: ${grade} (Lv.1 \u2192 Lv.2 \uCD5C\uC18C B)`);
  } else if (level === 'Lv.2' && gradeNum < GRADE_NUM.A) {
    reasons.push(`\uB4F1\uAE09 \uAE30\uC900 \uBBF8\uB2EC: ${grade} (Lv.2 \u2192 Lv.3 \uCD5C\uC18C A)`);
  } else if (level === 'Lv.3' && gradeNum < GRADE_NUM.A) {
    reasons.push(`\uB4F1\uAE09 \uAE30\uC900 \uBBF8\uB2EC: ${grade} (Lv.3 \u2192 Lv.4 \uCD5C\uC18C A)`);
  }

  if (candidate.discipline) {
    const restrictUntil = new Date(candidate.discipline.restrictUntil);
    if (todayDate < restrictUntil) {
      reasons.push(`\uC9D5\uACC4 \uC81C\uD55C \uAE30\uAC04: ${candidate.discipline.restrictUntil}\uAE4C\uC9C0`);
    }
  }

  if (level === 'Lv.3' && candidate.jobFamily === 'PL') {
    reasons.push('PL \uC9C1\uAD70\uC740 Lv.4 \uC2B9\uC9C4 \uACBD\uB85C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4');
  }

  if (!['PL', 'Non-PL'].includes(candidate.jobFamily)) {
    reasons.push('\uD604 \uC9C1\uAD70\uC740 \uC2B9\uC9C4 \uD2B8\uB799 \uB300\uC0C1\uC774 \uC544\uB2D9\uB2C8\uB2E4');
  }

  if (level === 'Lv.4') {
    reasons.push('Lv.4\uB294 \uCD5C\uC0C1\uC704 \uC131\uC7A5 \uB808\uBCA8\uB85C \uBCC4\uB3C4 \uC2EC\uC758 \uB300\uC0C1\uC785\uB2C8\uB2E4');
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    tenureYears: calculateTenureYears(candidate.levelDate, today),
  };
}
