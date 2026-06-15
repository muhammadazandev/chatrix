import toast from "react-hot-toast";
import { socket } from "../../../socket/socket";
import { SOCKET_EVENTS } from "../../../socket/events";
import handleError from "../../../utils/handleError";
import { authApi } from "../../../utils/api";

export const createConversationSlice = (set) => ({
  conversations: [],
  conversationFriend: null,

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
});
