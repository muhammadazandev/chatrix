import { create } from "zustand";
import { authApi } from "../utils/api";
import handleError from "../utils/handleError";
import toast from "react-hot-toast";
import { SOCKET_EVENTS } from "../socket/events";
import { socket } from "../socket/socket";

const useChatStore = create((set, get) => ({
  conversations: [],
  conversationFriend: null,
  messages: [],
  typingUsersByConversation: {},
  isLoading: false,

  accessConversation: async (targetUserId, onSuccessNavigate) => {
    try {
      if (!targetUserId) return;

      const accessRes = await authApi.post("/conversation/access", {
        targetUserId: targetUserId,
      });

      const conversationId = accessRes.data.conversation._id;

      onSuccessNavigate?.(conversationId);

      socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversationId);

      const verifyRes = await authApi.get(`/conversation/${conversationId}`);

      set({ conversationFriend: verifyRes?.data?.friend });
    } catch (error) {
      const message = handleError(error);
      if (message) {
        toast.error(message);
      }
    }
  },

  getConversations: async () => {
    try {
      const res = await authApi.get("/conversation/");

      set({ conversations: res.data.conversations });
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

  createGroup: async (formData, updateParams) => {
    set({ isLoading: true });

    try {
      const res = await authApi.post("/group/create-group", formData);

      toast.success(res.data?.message);

      updateParams({ view: null, conversationId: res.data?.group._id });
      navigate();
    } catch (error) {
      const message = handleError(error);
      if (message) {
        toast.error(message);
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const getChatState = useChatStore.getState;

export default useChatStore;
