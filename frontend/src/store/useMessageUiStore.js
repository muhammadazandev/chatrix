import { create } from "zustand";

const useMessageUiStore = create((set) => ({
  messageMode: {
    type: "normal",
    payload: null,
  },
  jumpToMessageId: null,
  forwardMessageId: null,
  mediaPreviewInfo: null,
  pendingMessages: [],

  setMessageMode: (mode) => set({ messageMode: mode }),
  clearMessageMode: () =>
    set({ messageMode: { type: "normal", payload: null } }),
  setJumpToMessageId: (msg) => set({ jumpToMessageId: msg }),
  setForwardMessageId: (id) => set({ forwardMessageId: id }),
  setMediaPreviewInfo: (data) => set({ mediaPreviewInfo: data }),

  addPendingMessage: (msg) =>
    set((state) => ({ pendingMessages: [...state.pendingMessages, msg] })),

  updatePendingMessage: (tempId, updates) =>
    set((state) => ({
      pendingMessages: state.pendingMessages.map((msg) =>
        msg.tempId === tempId ? { ...msg, ...updates } : msg,
      ),
    })),

  removePendingMessage: (tempId) =>
    set((state) => ({
      pendingMessages: state.pendingMessages.filter(
        (msg) => msg.tempId !== tempId,
      ),
    })),
}));

export default useMessageUiStore;
