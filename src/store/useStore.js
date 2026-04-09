import { create } from 'zustand';

const useStore = create((set, get) => ({
  // ── Filter State ──
  company: 'ALL',
  year: 'ALL',
  viewMode: 'standard', // standard | ceo | staff
  activeTab: 'workforce',
  copilotOpen: false,

  // ── Actions ──
  setCompany: (company) => set({ company }),
  setYear: (year) => set({ year }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),
  setCopilotOpen: (open) => set({ copilotOpen: open }),

  // ── Copilot Messages ──
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),

  // ── Snapshot & Simulation ──
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

export default useStore;
