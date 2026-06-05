import { create } from "zustand";
import { authApi } from "../utils/api";
import handleError from "../utils/handleError";
import toast from "react-hot-toast";

const useChatStore = create((set) => ({
  currentConversationId: null,
  allConversations: [],
  conversationFriend: null,
  messages: [],
  typingUsersByConversation: {},

  setCurrentConversationId: (id) => set({ currentConversationId: id }),

  accessConversation: async (targetUserId) => {
    try {
      if (!targetUserId) return;

      const res = await authApi.post("/conversation/access", {
        targetUserId: targetUserId,
      });

      const conversationId = res.data.conversation._id;

      set({ currentConversationId: conversationId });

      const params = new URLSearchParams(window.location.search);
      params.set("conversationId", conversationId);
      window.history.replaceState(null, "", `?${params.toString()}`);
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

  addTypingUser: (conversationId, userId, username) => {
    set((state) => {
      const current = state.typingUsersByConversation[conversationId] || [];

      if (current.some((user) => user.userId === userId)) return state;

      return {
        typingUsersByConversation: {
          ...state.typingUsersByConversation,
          [conversationId]: [...current, { userId, username }],
        },
      };
    });
  },

  removeTypingUser: (conversationId, userId) => {
    set((state) => {
      const current = state.typingUsersByConversation[conversationId] || [];

      const updated = current.filter((user) => user.userId !== userId);

      const copy = { ...state.typingUsersByConversation };

      if (updated.length === 0) {
        delete copy[conversationId];
      } else {
        copy[conversationId] = updated;
      }

      return {
        typingUsersByConversation: copy,
      };
    });
  },
}));

export const getChatState = useChatStore.getState;

export default useChatStore;
