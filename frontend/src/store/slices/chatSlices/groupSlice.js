import toast from "react-hot-toast";
import handleError from "../../../utils/handleError";
import { authApi } from "../../../utils/api";

export const createGroupSlice = (set) => ({
  isLoading: false,

  createGroup: async (formData, updateParams) => {
    set({ isLoading: true });

    try {
      const res = await authApi.post("/group/create-group", formData);

      toast.success(res.data?.message);

      updateParams({ view: null, conversationId: res.data?.group._id });

      set({ currentConversation: res.data?.group });
    } catch (error) {
      const message = handleError(error);
      if (message) {
        toast.error(message);
      }
    } finally {
      set({ isLoading: false });
    }
  },
});
