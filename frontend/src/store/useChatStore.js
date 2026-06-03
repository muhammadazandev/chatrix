import { create } from "zustand";
import { authApi } from "../utils/api";
import handleError from "../utils/handleError";
import toast from "react-hot-toast";

const useChatStore = create((set) => ({
  currentConversationId: null,
  allConversations: [],
  conversationFriend: null,
  messages: [],

  setCurrentConversationId: (id) => set({ currentConversationId: id }),

  accessConversation: async (targetUserId) => {
    try {
      if (!targetUserId) return;

      const res = await authApi.post("/conversation/access", {
        targetUserId: targetUserId,
      });

      set({ currentConversationId: res.data.conversation._id });
    } catch (error) {
      const message = handleError(error);
      if (message) {
        toast.error(message);
      }
    }
  },

  getAllConversations: async () => {
    try {
      const res = await authApi.get("/conversation/");

      set({ allConversations: res.data.conversations });
    } catch (error) {
      const message = handleError(error);
      if (message) {
        toast.error(message);
      }
    }
  },

  verifyConversation: async (conversationId) => {
    try {
      if (!conversationId) return;

      const res = await authApi.get(`/conversation/${conversationId}`);

      set({ conversationFriend: res?.data?.friend });
    } catch (error) {
      const message = handleError(error);
      if (message) {
        toast.error(message);
      }
    }
  },

  getMessages: async (conversationId) => {
    try {
      if (!conversationId) return;

      const res = await authApi.get(`/message/${conversationId}`);

      set({ messages: res?.data?.messages });
    } catch (error) {
      const message = handleError(error);
      if (message) {
        toast.error(message);
      }
    }
  },
}));

export const getChatState = useChatStore.getState;

export default useChatStore;
