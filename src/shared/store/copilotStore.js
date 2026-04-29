import { create } from 'zustand';

const useCopilotStore = create((set) => ({
  copilotOpen: false,
  messages: [],
  selectedInsightTraceId: null,

  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),
  setCopilotOpen: (open) => set({ copilotOpen: open }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setSelectedInsightTraceId: (traceId) => set({ selectedInsightTraceId: traceId }),
  clearMessages: () => set({ messages: [] }),
}));

export default useCopilotStore;
