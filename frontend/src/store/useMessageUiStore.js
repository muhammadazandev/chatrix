import { create } from "zustand";

const useMessageUiStore = create((set) => ({
  messageMode: {
    type: "normal",
    payload: null,
  },
  jumpToMessageId: null,
  forwardMessageId: null,
  mediaPreviewInfo: null,

  setMessageMode: (mode) => set({ messageMode: mode }),
  clearMessageMode: () =>
    set({ messageMode: { type: "normal", payload: null } }),
  setJumpToMessageId: (msg) => set({ jumpToMessageId: msg }),
  setForwardMessageId: (id) => set({ forwardMessageId: id }),
  setMediaPreviewInfo: (data) => set({ mediaPreviewInfo: data }),
}));

export default useMessageUiStore;
