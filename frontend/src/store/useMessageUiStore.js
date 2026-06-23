import { create } from "zustand";

const useMessageUiStore = create((set) => ({
  messageMode: {
    type: "normal",
    payload: null,
  },

  setMessageMode: (mode) => set({ messageMode: mode }),
  clearMessageMode: () =>
    set({ messageMode: { type: "normal", payload: null } }),
}));

export default useMessageUiStore;
