import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  company: 'ALL',
  year: 'ALL',
  viewMode: 'standard',
  activeTab: 'workforce',

  setCompany: (company) => set({ company }),
  setYear: (year) => set({ year }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  showSnapshot: false,
  snapshotYears: [2024, 2025],
  showSimulation: false,
  simParams: { turnoverDelta: 0, costDelta: 0, hireDelta: 0 },

  toggleSnapshot: () => set((s) => ({ showSnapshot: !s.showSnapshot })),
  setSnapshotYears: (years) => set({ snapshotYears: years }),
  toggleSimulation: () => set((s) => ({ showSimulation: !s.showSimulation })),
  setSimParams: (params) => set((s) => ({ simParams: { ...s.simParams, ...params } })),
  resetSimParams: () => set({ simParams: { turnoverDelta: 0, costDelta: 0, hireDelta: 0 } }),
}));

export default useDashboardStore;
