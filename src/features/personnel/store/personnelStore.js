import { create } from 'zustand';
import { CANDIDATES, INITIAL_DECISIONS } from '../data/personnelData';
import { checkEligibility } from '../rules/eligibilityRules';

const usePersonnelStore = create((set, get) => ({
  // ── 서브탭 ──
  activeSubTab: 'explore',
  setActiveSubTab: (tab) => set({ activeSubTab: tab }),

  // ── Phase ──
  phase: 'C',
  setPhase: (p) => set({ phase: p }),

  // ── 대상자 탐색 필터 ──
  filterEntity: 'ALL',
  filterGrade: 'ALL',
  filterEligible: 'ALL',
  filterJobFamily: 'ALL',
  searchText: '',
  viewMode: 'card',
  selectedCandidate: null,

  setFilterEntity: (v) => set({ filterEntity: v }),
  setFilterGrade: (v) => set({ filterGrade: v }),
  setFilterEligible: (v) => set({ filterEligible: v }),
  setFilterJobFamily: (v) => set({ filterJobFamily: v }),
  setSearchText: (v) => set({ searchText: v }),
  setViewMode: (v) => set({ viewMode: v }),
  setSelectedCandidate: (id) => set({ selectedCandidate: id }),

  // ── Calibration ──
  grades: Object.fromEntries(CANDIDATES.map(c => [c.id, c.finalGrade])),
  selectedDivision: '전체',
  orgEvalGrade: 'A',  // 조직평가 등급 (기본값 A)
  setSelectedDivision: (v) => set({ selectedDivision: v }),
  setOrgEvalGrade: (v) => set({ orgEvalGrade: v }),
  changeGrade: (id, newGrade) => {
    const { grades, addDecision } = get();
    const oldGrade = grades[id];
    const candidate = CANDIDATES.find(c => c.id === id);
    set({ grades: { ...grades, [id]: newGrade } });
    if (candidate && oldGrade !== newGrade) {
      const now = new Date();
      addDecision({
        time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
        type: '등급조정',
        subject: candidate.name,
        detail: `기초 ${candidate.baseGrade} → 최종 ${oldGrade} → ${newGrade}`,
        status: 'pending',
        by: 'Calibration 위원회',
      });
    }
  },

  // ── 인사안 (What-if) ──
  activeScenario: 0,
  setActiveScenario: (i) => set({ activeScenario: i }),

  // ── 보고 모드 ──
  reportView: 'ceo',
  setReportView: (v) => set({ reportView: v }),

  // ── 세레모니 ──
  ceremonyType: 'slides',
  setCeremonyType: (v) => set({ ceremonyType: v }),

  // ── Decision Log ──
  decisions: [...INITIAL_DECISIONS],
  logExpanded: false,
  toggleLogExpanded: () => set((s) => ({ logExpanded: !s.logExpanded })),
  addDecision: (d) => set((s) => ({
    decisions: [...s.decisions, { ...d, id: s.decisions.length + 1 }],
  })),

  // ── 필터된 후보자 계산 ──
  getFilteredCandidates: () => {
    const { filterEntity, filterGrade, filterEligible, filterJobFamily, searchText } = get();
    return CANDIDATES.filter(c => {
      if (filterEntity !== 'ALL' && c.entity !== filterEntity) return false;
      if (filterGrade !== 'ALL' && c.finalGrade !== filterGrade) return false;
      if (filterJobFamily !== 'ALL' && c.jobFamily !== filterJobFamily) return false;
      if (filterEligible !== 'ALL') {
        const elig = checkEligibility(c);
        if (filterEligible === 'eligible' && !elig.eligible) return false;
        if (filterEligible === 'ineligible' && elig.eligible) return false;
      }
      if (searchText) {
        const q = searchText.toLowerCase();
        const fields = [c.name, c.dept, c.division, c.entity, c.jobType].join(' ').toLowerCase();
        if (!fields.includes(q)) return false;
      }
      return true;
    });
  },

  // ── 자격 판정 (checkEligibility 래퍼) ──
  getEligibility: (candidateId) => {
    const candidate = CANDIDATES.find(c => c.id === candidateId);
    if (!candidate) return { eligible: false, reasons: ['대상자 미발견'] };
    return checkEligibility(candidate);
  },
}));

export default usePersonnelStore;
