import { create } from 'zustand';
import { CANDIDATES, INITIAL_DECISIONS, SCENARIOS } from '../data/personnelData';

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
  searchText: '',
  viewMode: 'card',
  selectedCandidate: null,

  setFilterEntity: (v) => set({ filterEntity: v }),
  setFilterGrade: (v) => set({ filterGrade: v }),
  setFilterEligible: (v) => set({ filterEligible: v }),
  setSearchText: (v) => set({ searchText: v }),
  setViewMode: (v) => set({ viewMode: v }),
  setSelectedCandidate: (id) => set({ selectedCandidate: id }),

  // ── Calibration ──
  grades: Object.fromEntries(CANDIDATES.map(c => [c.id, c.grade])),
  selectedDivision: '전체',
  setSelectedDivision: (v) => set({ selectedDivision: v }),
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
        detail: `${oldGrade}→${newGrade}`,
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
    const { filterEntity, filterGrade, filterEligible, searchText } = get();
    return CANDIDATES.filter(c => {
      if (filterEntity !== 'ALL' && c.entity !== filterEntity) return false;
      if (filterGrade !== 'ALL' && c.grade !== filterGrade) return false;
      if (filterEligible === 'eligible' && !c.eligible) return false;
      if (filterEligible === 'ineligible' && c.eligible) return false;
      if (searchText && !c.name.includes(searchText) && !c.dept.includes(searchText) && !c.division.includes(searchText)) return false;
      return true;
    });
  },
}));

export default usePersonnelStore;
