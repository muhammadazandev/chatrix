import toast from "react-hot-toast";
import handleError from "../../../utils/handleError";
import { authApi } from "../../../utils/api";

export const createMessageSlice = (set) => ({
  messages: [],

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
});
