# HR Dashboard - 프로젝트 룸

## 프로젝트 개요

OK금융그룹 인사부 전용 HR 대시보드 + AI Copilot 시스템
React (Vite) 풀스택 전환 프로젝트

- **GitHub**: https://github.com/joonbary/HR_AI_Dashboard
- **배포**: https://joonbary.github.io/HR_AI_Dashboard/ (v5 HTML 버전)
- **상태**: React 전환 진행 중 (P9)

---

## 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| Frontend | React 19 + Vite 8 | SPA, CSR |
| 상태관리 | Zustand | 경량 스토어 |
| 차트 | Chart.js 4 + react-chartjs-2 | 15개 차트 |
| 조직도 | D3.js 7 | SVG 트리 렌더링 |
| PPT 생성 | PptxGenJS | 클라이언트 사이드 |
| 스타일 | CSS Variables + 커스텀 CSS | 다크모드 대비 |
| Backend (예정) | Python FastAPI | Claude API 프록시 |
| DB (예정) | SQLite → PostgreSQL | 인력 데이터 저장 |

---

## 디렉토리 구조

```
src/
├── components/
│   ├── layout/          TopBar, FilterBar
│   ├── tabs/            WorkforceTab, PerformanceTab, AITab, RiskTab,
│   │                    InsightsTab, ExecTab, OrgTab
│   ├── charts/          ChartCard (범용 Chart.js 래퍼)
│   ├── common/          KpiCard, DataTable
│   └── copilot/         CopilotPanel
├── data/
│   ├── dashboardData.js   D 객체 (인력·성과·인건비·AWTA 시계열)
│   ├── orgTreeData.js     조직도 트리 (7개 법인)
│   └── riskData.js        리스크 매트릭스 계산
├── store/
│   └── useStore.js        Zustand 글로벌 스토어
├── hooks/
│   └── useFilteredData.js 필터 적용 데이터 훅
├── styles/
│   └── theme.css          디자인 토큰 + 전체 스타일
├── api/                   (예정) API 클라이언트
├── App.jsx                루트 컴포넌트
└── main.jsx               엔트리포인트
```

---

## 7개 탭 구성

| Tab | 컴포넌트 | 차트 수 | 핵심 데이터 |
|-----|---------|---------|------------|
| 인력현황 | WorkforceTab | 10 | headcount, jobtype, jobgroup, gender, entry/resign |
| 성과·보상 | PerformanceTab | 4 | evalDist, aAbove, laborCost |
| AI전환 | AITab | 2 | awta, shift |
| 리스크 | RiskTab | 2 | calcRiskData() 동적 계산 |
| HR인사이트 | InsightsTab | 0 | insights 배열 (카테고리 필터) |
| 임원요약 | ExecTab | 2 | 집계 KPI + Action Items |
| 조직도 | OrgTab | 0 | ORG_TREE_DATA (트리 컴포넌트) |

---

## 데이터 흐름

```
D (dashboardData.js) ─── 정적 JSON (사원명부 기반)
  │
  ├── useStore (Zustand) ─── company, year 필터 상태
  │
  ├── useFilteredData() ─── 필터 적용된 집계 데이터
  │
  └── 각 Tab 컴포넌트 ─── useMemo로 Chart.js config 생성
                            └── ChartCard가 canvas에 렌더링
```

---

## OK금융그룹 CI

| 항목 | 값 |
|------|-----|
| OK Orange | `#F77310` |
| Accent | `#E8572A` |
| OK Gold | `#FCAF17` |
| Dark Gray | `#353C41` |
| 폰트 | Pretendard > 맑은 고딕 |

---

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (HMR)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
```

---

## 향후 로드맵

### Phase 2 (현재)
- [ ] React 전환 완료 (모든 탭 기능 동등성 확보)
- [ ] D3.js 조직도 → React 통합 (useRef + useEffect)
- [ ] PptxGenJS PPT 다운로드 React 연동
- [ ] 다크모드 구현

### Phase 3
- [ ] FastAPI 백엔드 구축
- [ ] Claude API Copilot 실제 연동
- [ ] SQLite → 실시간 데이터 연동
- [ ] 사원명부 Excel 업로드 → 자동 파싱

### Phase 4
- [ ] 인증/권한 (RBAC: CEO/부서장/실무)
- [ ] GitHub Actions CI/CD
- [ ] 5개년 트렌드 데이터 보강
- [ ] 모바일 최적화

---

## 주의사항

- 법인명: OK홀딩스 (OK금융지주 ✕), OKAX (OK아이에스 ✕)
- 하위 조직 명칭: "파트" (팀 ✕)
- 데이터 기준일: 2026-03-04 사원명부
- 개인정보 포함 데이터는 커밋하지 않음
