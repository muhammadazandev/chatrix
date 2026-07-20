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
  mediaViewer: {
    isOpen: false,
    items: [],
    activeIndex: 0,
  },

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

  openMediaViewer: (items, index) =>
    set({
      mediaViewer: {
        isOpen: true,
        items,
        activeIndex: index,
      },
    }),

  closeMediaViewer: () =>
    set((state) => ({
      mediaViewer: {
        ...state.mediaViewer,
        isOpen: false,
      },
    })),

  updateMediaViewerIndex: (newIndex) =>
    set((state) => ({
      mediaViewer: { ...state.mediaViewer, activeIndex: newIndex },
    })),

  clearMediaViewer: () =>
    set({
      mediaViewer: {
        isOpen: false,
        items: [],
        activeIndex: 0,
      },
    }),
}));

export default useMessageUiStore;
