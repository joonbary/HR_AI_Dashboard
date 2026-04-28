import { create } from 'zustand';

const useCopilotStore = create((set) => ({
  copilotOpen: false,
  messages: [],

  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),
  setCopilotOpen: (open) => set({ copilotOpen: open }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
}));

export default useCopilotStore;
