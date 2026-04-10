/**
 * 정기인사 포탈 — 모의 데이터
 * Phase 1: 더미 데이터로 UI 검증 → Phase 2+에서 Excel 파이프라인 연동
 */

export const GRADE_ORDER = ['S', 'A+', 'A', 'B+', 'B', 'C', 'D'];

export const GRADE_COLORS = {
  S: '#7C3AED', 'A+': '#2563EB', A: '#3B82F6',
  'B+': '#22C55E', B: '#84CC16', C: '#F59E0B', D: '#EF4444',
};

export const GRADE_NUM = { S: 7, 'A+': 6, A: 5, 'B+': 4, B: 3, C: 2, D: 1 };

/** 허용 상한 (조직평가 등급 연동) — 추후 동적으로 교체 */
export const UPPER_LIMIT = { S: 10, 'A+': 20, A: 30, 'B+': 25, B: 10, C: 5, D: 0 };

export const CANDIDATES = [
  { id:'E001',name:'김민수',entity:'OK저축은행',dept:'리테일금융본부',division:'여신파트',jobType:'리테일금융',level:'Lv.2',title:'과장',grade:'A+',cei:{c:88,e:82,i:79},years:4,eligible:true,discipline:false,aiScore:4,evalHistory:[{y:2022,g:'B+'},{y:2023,g:'A'},{y:2024,g:'A'},{y:2025,g:'A+'}],keywords:['대출심사 AI 도입','부실채권 30% 감축','파트 리더십'] },
  { id:'E002',name:'이서연',entity:'OK저축은행',dept:'디지털혁신본부',division:'AI개발파트',jobType:'IT운영·개발·기획',level:'Lv.2',title:'대리',grade:'S',cei:{c:95,e:91,i:85},years:3,eligible:true,discipline:false,aiScore:5,evalHistory:[{y:2022,g:'A'},{y:2023,g:'A+'},{y:2024,g:'S'},{y:2025,g:'S'}],keywords:['AIRISS v4 핵심 개발','sLLM 전사 오픈 리드','특허 2건'] },
  { id:'E003',name:'박준혁',entity:'OK캐피탈',dept:'기업금융본부',division:'심사파트',jobType:'기업금융',level:'Lv.3',title:'차장',grade:'A',cei:{c:80,e:85,i:77},years:5,eligible:true,discipline:false,aiScore:2,evalHistory:[{y:2022,g:'B+'},{y:2023,g:'A'},{y:2024,g:'B+'},{y:2025,g:'A'}],keywords:['기업심사 프로세스 개선','NPL 관리','후배 육성'] },
  { id:'E004',name:'정하윤',entity:'OK홀딩스',dept:'경영관리본부',division:'인사파트',jobType:'경영관리',level:'Lv.1',title:'사원',grade:'A',cei:{c:78,e:74,i:70},years:2,eligible:false,discipline:false,aiScore:3,evalHistory:[{y:2024,g:'B+'},{y:2025,g:'A'}],keywords:['인사제도 기획 보조','데이터 분석','신입 교육'] },
  { id:'E005',name:'최영진',entity:'OK저축은행',dept:'리테일금융본부',division:'수신파트',jobType:'리테일금융',level:'Lv.2',title:'과장',grade:'B+',cei:{c:72,e:70,i:68},years:6,eligible:true,discipline:false,aiScore:1,evalHistory:[{y:2022,g:'B+'},{y:2023,g:'B'},{y:2024,g:'B+'},{y:2025,g:'B+'}],keywords:['수신영업','고객 관리','안정적 실적'] },
  { id:'E006',name:'한소희',entity:'OKAX',dept:'IT서비스본부',division:'인프라파트',jobType:'IT운영·개발·기획',level:'Lv.2',title:'대리',grade:'A+',cei:{c:86,e:88,i:80},years:3,eligible:true,discipline:false,aiScore:4,evalHistory:[{y:2023,g:'A'},{y:2024,g:'A'},{y:2025,g:'A+'}],keywords:['클라우드 전환','GPU 인프라 구축','보안 강화'] },
  { id:'E007',name:'오태현',entity:'OK저축은행',dept:'기업영업본부',division:'법인영업파트',jobType:'기업영업',level:'Lv.3',title:'부장',grade:'B',cei:{c:65,e:72,i:60},years:8,eligible:false,discipline:false,aiScore:1,evalHistory:[{y:2022,g:'B+'},{y:2023,g:'B'},{y:2024,g:'B'},{y:2025,g:'B'}],keywords:['법인영업','거래처 유지'],flagged:'저성과' },
  { id:'E008',name:'윤지은',entity:'OK캐피탈',dept:'리스크관리본부',division:'준법파트',jobType:'경영관리',level:'Lv.2',title:'과장',grade:'A',cei:{c:82,e:80,i:76},years:4,eligible:true,discipline:false,aiScore:3,evalHistory:[{y:2022,g:'B+'},{y:2023,g:'A'},{y:2024,g:'A'},{y:2025,g:'A'}],keywords:['내부통제 체계 구축','규정 제개정','감사 대응'] },
];

export const INITIAL_DECISIONS = [
  { id:1,time:'10:32',type:'승진확정',subject:'이서연',detail:'대리→과장 승진 추천',status:'confirmed',by:'인사파트' },
  { id:2,time:'10:45',type:'등급조정',subject:'박준혁',detail:'A→A+ (본부장 추천)',status:'pending',by:'기업금융본부장' },
  { id:3,time:'11:02',type:'직책해제',subject:'오태현',detail:'부장 직책해제 검토',status:'pending',by:'인사파트' },
  { id:4,time:'11:15',type:'이동확정',subject:'한소희',detail:'OKAX→OK저축 디지털혁신본부 이동',status:'confirmed',by:'인사부장' },
  { id:5,time:'11:30',type:'승진보류',subject:'최영진',detail:'B+ 등급 — 승진 기준 미달',status:'confirmed',by:'Calibration 위원회' },
];

export const SCENARIOS = [
  { name: '원안', promotions: ['E002','E001','E006'], transfers: ['E006'], demotions: ['E007'] },
  { name: '대안1', promotions: ['E002','E006'], transfers: [], demotions: [] },
];

export const COPILOT_PRESETS = {
  explore: ['이 사람의 승진 적격성은?', '유사 프로파일 대상자 비교', 'AI 활용도 상위 5명은?'],
  calibration: ['이 본부의 등급 분포 이상 여부', '관대화 경향 평가자는?', '등급 조정 시 영향 분석'],
  plan: ['이 안으로 진행하면 리스크는?', '작년 대비 승진율 변화', '인건비 영향 시뮬레이션'],
  report: ['이번 인사의 핵심 포인트 3가지', '대상자 인사기록 요약', '전년 대비 주요 변화점'],
  ceremony: ['축사 멘트 작성해줘', '대상자별 소개 문구 수정', '참석자 안내 메일 초안'],
};
