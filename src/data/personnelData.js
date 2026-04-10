/**
 * 정기인사 포탈 — 데이터 모델 v2
 * 실제 OK금융그룹 인사 구조 반영
 *
 * 평가 프로세스:
 *   1차 자기평가 → 관리자 1차 조정 (기초등급 A/B/C)
 *   → Calibration Session → 최종 7등급 (S/A+/A/B+/B/C/D) 분화
 *
 * CEI 3축: 기여도(C)·전문성(E)·영향력(I) 각 0~2점
 * 인사 5유형: 승진·승급·승격·이동·직책해제
 * 직군: PL(영업) / Non-PL(일반) / 매니저
 */

// ── 등급 체계 ──────────────────────────────────────────
export const GRADE_ORDER = ['S', 'A+', 'A', 'B+', 'B', 'C', 'D'];

export const GRADE_COLORS = {
  S: '#7C3AED', 'A+': '#2563EB', A: '#3B82F6',
  'B+': '#22C55E', B: '#84CC16', C: '#F59E0B', D: '#EF4444',
};

export const GRADE_NUM = { S: 7, 'A+': 6, A: 5, 'B+': 4, B: 3, C: 2, D: 1 };

/** 기초등급 (Calibration 전) */
export const BASE_GRADES = ['A', 'B', 'C'];

/** 기초등급 → 7등급 분화 매핑 (Calibration 가능 범위) */
export const BASE_TO_FINAL_MAP = {
  A: ['S', 'A+', 'A'],        // A 기초 → S, A+, A 중 분화
  B: ['B+', 'B'],              // B 기초 → B+, B 중 분화
  C: ['C', 'D'],               // C 기초 → C, D 중 분화
};

// ── 조직평가 연동 상한 (권고 기준, 의무 아님) ──────────
export const ORG_EVAL_LIMITS = {
  S:    { label: '탁월',  aPlus: 20, aAbove: 40, adjust: '+5%p' },
  'A+': { label: '우수+', aPlus: 18, aAbove: 38, adjust: '+3%p' },
  A:    { label: '우수',  aPlus: 15, aAbove: 35, adjust: '±0' },
  'B+': { label: '양호+', aPlus: 13, aAbove: 33, adjust: '-2%p' },
  B:    { label: '양호',  aPlus: 12, aAbove: 32, adjust: '-3%p' },
  C:    { label: '보통',  aPlus: 10, aAbove: 30, adjust: '-5%p' },
  D:    { label: '미흡',  aPlus:  8, aAbove: 28, adjust: '-7%p' },
};

/** 참고 분포 가이드 (강제 할당 아님) */
export const REF_DISTRIBUTION = {
  S: 5, 'A+': 10, A: 20, 'B+': 25, B: 25, C: 10, D: 5,
};

// ── 직군·직급 체계 ─────────────────────────────────────
export const JOB_FAMILIES = ['Non-PL', 'PL', '매니저'];

export const LEVEL_SYSTEM = {
  'Non-PL': [
    { level: 'Lv.1', title: '사원', paySteps: 4 },
    { level: 'Lv.2', title: '대리', paySteps: 4 },
    { level: 'Lv.3', title: '차장', paySteps: 1 },
    { level: 'Lv.4', title: '부장', paySteps: 1 },
  ],
  PL: [
    { level: 'Lv.1', titles: ['사원(P)', '주임', '전임'], paySteps: 10 },
    { level: 'Lv.2', titles: ['선임', '책임'], paySteps: 10 },
    { level: 'Lv.3', titles: ['프로'], paySteps: 10 },
  ],
};

// ── 승진 자격 판정 기준 ───────────────────────────────
export const PROMOTION_CRITERIA = {
  'Lv.1→Lv.2': { minTenure: 1, minGrade: 'B', note: '재직기간 기준 + B 이상' },
  'Lv.2→Lv.3': { minTenure: 1, minGrade: 'A', note: '재직기간 + A 이상 + 직무역량 검증' },
  'Lv.3→Lv.4': { minTenure: 1, minGrade: 'A', note: '재직기간 + A 이상 + 조직기여 입증' },
};

/** 징계 제한 기간 (월) */
export const DISCIPLINE_RESTRICTION = {
  '정직': 18,
  '감봉': 12,
  '견책': 6,
};

// ── 인사 유형 ──────────────────────────────────────────
export const ACTION_TYPES = [
  { id: 'promotion',  label: '승진', icon: '⬆️', color: '#22C55E', desc: '상위 성장레벨 이동' },
  { id: 'payStep',    label: '승급', icon: '💰', color: '#3B82F6', desc: '동일 레벨 내 급호 상승' },
  { id: 'elevation',  label: '승격', icon: '👑', color: '#7C3AED', desc: '상위 직책 부여' },
  { id: 'transfer',   label: '이동', icon: '🔄', color: '#F59E0B', desc: '부서·법인 간 이동' },
  { id: 'removal',    label: '직책해제', icon: '⚠️', color: '#EF4444', desc: '직책 해제' },
];

// ── 모의 대상자 데이터 (실 사원명부 구조 반영) ────────
export const CANDIDATES = [
  {
    id: 'E001', name: '김민수', entity: 'OK저축은행', dept: '리테일금융본부',
    division: '여신파트', jobFamily: 'Non-PL', jobType: '리테일금융',
    level: 'Lv.2', title: '과장', payStep: 3,
    hireDate: '2022-03-02', levelDate: '2024-08-01',
    baseGrade: 'A', finalGrade: 'A+',
    cei: { c: 2, e: 1.5, i: 1.5 }, ceiTotal: 5.0,
    eligible: true, discipline: null,
    aiScore: 4,
    evalHistory: [
      { y: 2023, base: 'B', final: 'B+' },
      { y: 2024, base: 'A', final: 'A' },
      { y: 2025, base: 'A', final: 'A+' },
    ],
    keywords: ['대출심사 AI 도입', '부실채권 30% 감축', '파트 리더십'],
  },
  {
    id: 'E002', name: '이서연', entity: 'OK저축은행', dept: '디지털혁신본부',
    division: 'AI개발파트', jobFamily: 'Non-PL', jobType: 'IT운영·개발·기획',
    level: 'Lv.2', title: '대리', payStep: 2,
    hireDate: '2023-03-02', levelDate: '2024-08-01',
    baseGrade: 'A', finalGrade: 'S',
    cei: { c: 2, e: 2, i: 1.5 }, ceiTotal: 5.5,
    eligible: true, discipline: null,
    aiScore: 5,
    evalHistory: [
      { y: 2023, base: 'A', final: 'A' },
      { y: 2024, base: 'A', final: 'S' },
      { y: 2025, base: 'A', final: 'S' },
    ],
    keywords: ['AIRISS v4 핵심 개발', 'sLLM 전사 오픈 리드', '특허 2건'],
  },
  {
    id: 'E003', name: '박준혁', entity: 'OK캐피탈', dept: '기업금융본부',
    division: '심사파트', jobFamily: 'Non-PL', jobType: '기업금융',
    level: 'Lv.3', title: '차장', payStep: 1,
    hireDate: '2019-09-01', levelDate: '2023-02-01',
    baseGrade: 'A', finalGrade: 'A',
    cei: { c: 1.5, e: 2, i: 1 }, ceiTotal: 4.5,
    eligible: true, discipline: null,
    aiScore: 2,
    evalHistory: [
      { y: 2023, base: 'B', final: 'B+' },
      { y: 2024, base: 'B', final: 'B+' },
      { y: 2025, base: 'A', final: 'A' },
    ],
    keywords: ['기업심사 프로세스 개선', 'NPL 관리', '후배 육성'],
  },
  {
    id: 'E004', name: '정하윤', entity: 'OK홀딩스', dept: '경영관리본부',
    division: '인사파트', jobFamily: 'Non-PL', jobType: '경영관리',
    level: 'Lv.1', title: '사원', payStep: 2,
    hireDate: '2024-03-04', levelDate: '2024-03-04',
    baseGrade: 'B', finalGrade: 'B+',
    cei: { c: 1.5, e: 1, i: 1 }, ceiTotal: 3.5,
    eligible: false, discipline: null,
    aiScore: 3,
    evalHistory: [
      { y: 2024, base: 'B', final: 'B' },
      { y: 2025, base: 'B', final: 'B+' },
    ],
    keywords: ['인사제도 기획 보조', '데이터 분석', '신입 교육'],
  },
  {
    id: 'E005', name: '최영진', entity: 'OK저축은행', dept: '리테일금융본부',
    division: '수신파트', jobFamily: 'PL', jobType: '리테일금융',
    level: 'Lv.2', title: '책임', payStep: 7,
    hireDate: '2018-03-05', levelDate: '2021-02-01',
    baseGrade: 'B', finalGrade: 'B+',
    cei: { c: 1.5, e: 1, i: 1 }, ceiTotal: 3.5,
    eligible: true, discipline: null,
    aiScore: 1,
    evalHistory: [
      { y: 2023, base: 'B', final: 'B' },
      { y: 2024, base: 'B', final: 'B+' },
      { y: 2025, base: 'B', final: 'B+' },
    ],
    keywords: ['수신영업', '고객 관리', '안정적 실적'],
  },
  {
    id: 'E006', name: '한소희', entity: 'OKAX', dept: 'IT서비스본부',
    division: '인프라파트', jobFamily: 'Non-PL', jobType: 'IT운영·개발·기획',
    level: 'Lv.2', title: '대리', payStep: 3,
    hireDate: '2022-09-01', levelDate: '2024-02-01',
    baseGrade: 'A', finalGrade: 'A+',
    cei: { c: 1.5, e: 2, i: 1.5 }, ceiTotal: 5.0,
    eligible: true, discipline: null,
    aiScore: 4,
    evalHistory: [
      { y: 2023, base: 'A', final: 'A' },
      { y: 2024, base: 'A', final: 'A' },
      { y: 2025, base: 'A', final: 'A+' },
    ],
    keywords: ['클라우드 전환', 'GPU 인프라 구축', '보안 강화'],
  },
  {
    id: 'E007', name: '오태현', entity: 'OK저축은행', dept: '기업영업본부',
    division: '법인영업파트', jobFamily: 'PL', jobType: '기업영업',
    level: 'Lv.3', title: '프로', payStep: 8,
    hireDate: '2016-03-07', levelDate: '2020-08-01',
    baseGrade: 'C', finalGrade: 'C',
    cei: { c: 0.5, e: 1, i: 0.5 }, ceiTotal: 2.0,
    eligible: false, discipline: null,
    aiScore: 1,
    evalHistory: [
      { y: 2023, base: 'B', final: 'B' },
      { y: 2024, base: 'C', final: 'C' },
      { y: 2025, base: 'C', final: 'C' },
    ],
    keywords: ['법인영업', '거래처 유지'],
    flagged: '저성과',
  },
  {
    id: 'E008', name: '윤지은', entity: 'OK캐피탈', dept: '리스크관리본부',
    division: '준법파트', jobFamily: 'Non-PL', jobType: '경영관리',
    level: 'Lv.2', title: '과장', payStep: 4,
    hireDate: '2020-09-01', levelDate: '2023-08-01',
    baseGrade: 'A', finalGrade: 'A',
    cei: { c: 1.5, e: 1.5, i: 1.5 }, ceiTotal: 4.5,
    eligible: true, discipline: null,
    aiScore: 3,
    evalHistory: [
      { y: 2023, base: 'B', final: 'B+' },
      { y: 2024, base: 'A', final: 'A' },
      { y: 2025, base: 'A', final: 'A' },
    ],
    keywords: ['내부통제 체계 구축', '규정 제개정', '감사 대응'],
  },
  // ── 추가 PL 직군 대상자 ──
  {
    id: 'E009', name: '강태호', entity: 'OK저축은행', dept: '리테일금융본부',
    division: '부산1파트', jobFamily: 'PL', jobType: '리테일금융',
    level: 'Lv.2', title: '선임', payStep: 5,
    hireDate: '2019-06-03', levelDate: '2022-02-01',
    baseGrade: 'A', finalGrade: 'A',
    cei: { c: 2, e: 1, i: 1 }, ceiTotal: 4.0,
    eligible: true, discipline: null,
    aiScore: 2,
    evalHistory: [
      { y: 2023, base: 'B', final: 'B+' },
      { y: 2024, base: 'A', final: 'A' },
      { y: 2025, base: 'A', final: 'A' },
    ],
    keywords: ['개인대출 실적 상위 10%', '고객만족 우수', '지점 내 멘토'],
  },
  {
    id: 'E010', name: '서윤아', entity: 'OK저축은행', dept: '리테일금융본부',
    division: '서울2파트', jobFamily: 'PL', jobType: '리테일금융',
    level: 'Lv.1', title: '전임', payStep: 8,
    hireDate: '2021-09-06', levelDate: '2021-09-06',
    baseGrade: 'B', finalGrade: 'B',
    cei: { c: 1, e: 1, i: 0.5 }, ceiTotal: 2.5,
    eligible: false, discipline: null,
    aiScore: 1,
    evalHistory: [
      { y: 2023, base: 'B', final: 'B' },
      { y: 2024, base: 'B', final: 'B' },
      { y: 2025, base: 'B', final: 'B' },
    ],
    keywords: ['신규 고객 개척', '학습 의지'],
  },
  // ── 매니저 직군 ──
  {
    id: 'E011', name: '임재원', entity: 'OK저축은행', dept: '리테일금융본부',
    division: '인천파트', jobFamily: '매니저', jobType: '리테일금융',
    level: 'Lv.3', title: '매니저', payStep: 3,
    hireDate: '2023-08-01', levelDate: '2023-08-01',
    baseGrade: 'B', finalGrade: 'B+',
    cei: { c: 1.5, e: 1, i: 1 }, ceiTotal: 3.5,
    eligible: false, discipline: null,
    aiScore: 1,
    evalHistory: [
      { y: 2024, base: 'B', final: 'B' },
      { y: 2025, base: 'B', final: 'B+' },
    ],
    keywords: ['PL 출신 재고용', '현장 경험 풍부'],
  },
  // ── 징계 이력 보유자 ──
  {
    id: 'E012', name: '조현우', entity: 'OK캐피탈', dept: '기업금융본부',
    division: '영업파트', jobFamily: 'Non-PL', jobType: '기업금융',
    level: 'Lv.2', title: '대리', payStep: 3,
    hireDate: '2021-03-08', levelDate: '2023-08-01',
    baseGrade: 'B', finalGrade: 'B+',
    cei: { c: 1.5, e: 1.5, i: 1 }, ceiTotal: 4.0,
    eligible: false,
    discipline: { type: '견책', date: '2025-10-15', restrictUntil: '2026-04-15' },
    aiScore: 2,
    evalHistory: [
      { y: 2023, base: 'A', final: 'A' },
      { y: 2024, base: 'B', final: 'B+' },
      { y: 2025, base: 'B', final: 'B+' },
    ],
    keywords: ['기업여신 심사', '고객 확대'],
  },
];

// ── 인사 시나리오 (5유형 지원) ─────────────────────────
export const SCENARIOS = [
  {
    name: '원안',
    actions: [
      { type: 'promotion', candidateId: 'E002', from: 'Lv.2 대리', to: 'Lv.3 차장', reason: 'S등급 2연속, AIRISS 핵심 기여' },
      { type: 'promotion', candidateId: 'E001', from: 'Lv.2 과장', to: 'Lv.3 차장', reason: 'A+ 등급, AI 도입 실적' },
      { type: 'promotion', candidateId: 'E009', from: 'Lv.2 선임', to: 'Lv.3 프로', reason: 'A 등급, 실적 상위 10%' },
      { type: 'payStep',   candidateId: 'E005', from: '책임 7급', to: '책임 8급', reason: 'B+ 등급 — 연차 승급' },
      { type: 'payStep',   candidateId: 'E004', from: '사원 2급', to: '사원 3급', reason: 'B+ 등급 — 연차 승급' },
      { type: 'elevation', candidateId: 'E006', from: '대리', to: 'AI개발파트장', reason: 'A+ 등급, GPU 인프라 리드' },
      { type: 'transfer',  candidateId: 'E006', from: 'OKAX 인프라파트', to: 'OK저축 디지털혁신본부', reason: 'AI 역량 집중 배치' },
      { type: 'removal',   candidateId: 'E007', from: '법인영업파트 프로', to: '직책해제', reason: 'C등급 2연속, 실적 부진' },
    ],
  },
  {
    name: '대안1 (보수)',
    actions: [
      { type: 'promotion', candidateId: 'E002', from: 'Lv.2 대리', to: 'Lv.3 차장', reason: 'S등급 확정' },
      { type: 'payStep',   candidateId: 'E001', from: '과장 3급', to: '과장 4급', reason: '승진 보류 → 승급 전환' },
      { type: 'payStep',   candidateId: 'E005', from: '책임 7급', to: '책임 8급', reason: '연차 승급' },
      { type: 'payStep',   candidateId: 'E004', from: '사원 2급', to: '사원 3급', reason: '연차 승급' },
    ],
  },
  {
    name: '대안2 (적극)',
    actions: [
      { type: 'promotion', candidateId: 'E002', from: 'Lv.2 대리', to: 'Lv.3 차장', reason: 'S등급 2연속' },
      { type: 'promotion', candidateId: 'E001', from: 'Lv.2 과장', to: 'Lv.3 차장', reason: 'A+ 등급' },
      { type: 'promotion', candidateId: 'E006', from: 'Lv.2 대리', to: 'Lv.3 차장', reason: 'A+ 등급, 전략 인재' },
      { type: 'promotion', candidateId: 'E009', from: 'Lv.2 선임', to: 'Lv.3 프로', reason: 'A 등급' },
      { type: 'elevation', candidateId: 'E003', from: '차장', to: '기업금융부장', reason: '기업심사 전문성' },
      { type: 'elevation', candidateId: 'E006', from: '차장', to: 'AI개발파트장', reason: 'GPU 인프라 리드' },
      { type: 'transfer',  candidateId: 'E006', from: 'OKAX', to: 'OK저축', reason: 'AI 역량 집중' },
      { type: 'removal',   candidateId: 'E007', from: '프로', to: '직책해제', reason: 'C등급 2연속' },
      { type: 'removal',   candidateId: 'E011', from: '매니저', to: '직책해제', reason: '계약 검토' },
    ],
  },
];

// ── 26상 실제 인사 실적 벤치마크 ───────────────────────
export const BENCHMARK_26H1 = {
  period: '2026 상반기',
  effectiveDate: '2026-02-01',
  summary: {
    promotion: { total: 106, nonPL: 46, pl: 60, note: 'Lv.3↑ 41명 + Lv.2↓ 65명' },
    payStep:   { total: 321, nonPL: 50, pl: 271, note: '동일 레벨 급호 상승' },
    elevation: { total: 24,  nonPL: 22, pl: 2,   note: '팀장·지점장·부장 등' },
    transfer:  { total: 57,  nonPL: 28, pl: 29,  note: '부서·법인 간 이동' },
    removal:   { total: 14,  note: '직책해제 (역량부족·실적부진)' },
  },
  grandTotal: 508,
};

// ── 의사결정 로그 초기 데이터 ──────────────────────────
export const INITIAL_DECISIONS = [
  { id: 1, time: '10:32', type: '승진확정', subject: '이서연', detail: '대리→차장 승진 추천 (S등급 2연속)', status: 'confirmed', by: '인사파트' },
  { id: 2, time: '10:45', type: '등급조정', subject: '박준혁', detail: '기초 A → 최종 A (Calibration 유지)', status: 'confirmed', by: '기업금융본부장' },
  { id: 3, time: '11:02', type: '직책해제', subject: '오태현', detail: 'C등급 2연속 — 직책해제 검토', status: 'pending', by: '인사파트' },
  { id: 4, time: '11:15', type: '이동확정', subject: '한소희', detail: 'OKAX→OK저축 디지털혁신본부', status: 'confirmed', by: '인사부장' },
  { id: 5, time: '11:30', type: '승진보류', subject: '최영진', detail: 'B+ 등급 — 승진 기준 미달(A 이상 필요)', status: 'confirmed', by: 'Calibration 위원회' },
  { id: 6, time: '11:45', type: '징계제한', subject: '조현우', detail: '견책 제한기간 2026-04-15까지 — 승진 불가', status: 'confirmed', by: 'HR 시스템' },
];

// ── AI Copilot 프리셋 ──────────────────────────────────
export const COPILOT_PRESETS = {
  explore: [
    '이 사람의 승진 자격 요건 충족 여부 확인해줘',
    '유사 프로파일 대상자 비교',
    'AI 활용도 상위 5명은?',
    'PL 직군 승진 대상자 리스트',
  ],
  calibration: [
    '이 본부의 기초등급→최종등급 분화 현황',
    '관대화 경향 평가자 식별',
    '조직평가 연동 상한 권고치 대비 현황',
    '등급 조정 시 분포 영향 시뮬레이션',
  ],
  plan: [
    '이 안으로 진행하면 리스크는?',
    '26상 대비 승진율 변화',
    '인건비 영향 시뮬레이션',
    '직군별(PL/Non-PL) 인사 비교',
  ],
  report: [
    '이번 인사의 핵심 포인트 3가지',
    '대상자 인사기록 요약',
    '전년 대비 주요 변화점',
    'Track A/B/C별 인원 현황',
  ],
  ceremony: [
    '사령장 문안 작성해줘',
    '대상자별 소개 문구 생성',
    'MC 시나리오 전체 작성',
    '직급별 호명 순서 정리',
  ],
};

// ── 승진 자격 판정 유틸 ────────────────────────────────
/**
 * 승진 자격 자동 판정
 * @param {object} candidate - 후보자 데이터
 * @param {string} today - 판정 기준일 (YYYY-MM-DD)
 * @returns {{ eligible, reasons[] }}
 */
export function checkEligibility(candidate, today = '2026-07-01') {
  const reasons = [];
  const todayDate = new Date(today);
  const levelDate = new Date(candidate.levelDate);
  const tenureYears = (todayDate - levelDate) / (365.25 * 24 * 60 * 60 * 1000);

  // 1. 체류연수 (최소 1년)
  if (tenureYears < 1) {
    reasons.push(`체류연수 부족: ${tenureYears.toFixed(1)}년 (최소 1년 필요)`);
  }

  // 2. 등급 기준
  const level = candidate.level;
  const grade = candidate.finalGrade;
  const gradeNum = GRADE_NUM[grade] || 0;

  if (level === 'Lv.1' && gradeNum < GRADE_NUM['B']) {
    reasons.push(`등급 미달: ${grade} (Lv.1→2 최소 B 이상)`);
  } else if (level === 'Lv.2' && gradeNum < GRADE_NUM['A']) {
    reasons.push(`등급 미달: ${grade} (Lv.2→3 최소 A 이상)`);
  } else if (level === 'Lv.3' && gradeNum < GRADE_NUM['A']) {
    reasons.push(`등급 미달: ${grade} (Lv.3→4 최소 A 이상)`);
  }

  // 3. 징계 제한
  if (candidate.discipline) {
    const restrictUntil = new Date(candidate.discipline.restrictUntil);
    if (todayDate < restrictUntil) {
      reasons.push(`징계 제한 중: ${candidate.discipline.type} → ${candidate.discipline.restrictUntil}까지`);
    }
  }

  // 4. Lv.4(부장)는 Non-PL만
  if (level === 'Lv.3' && candidate.jobFamily === 'PL') {
    reasons.push('PL 직군: Lv.4 없음 (Lv.3이 최고 레벨)');
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    tenureYears: Math.round(tenureYears * 10) / 10,
  };
}
