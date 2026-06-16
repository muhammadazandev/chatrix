import toast from "react-hot-toast";
import handleError from "../../../utils/handleError";
import { authApi } from "../../../utils/api";

export const createRequestSlice = (set, get) => ({
  pendingSentRequests: [],
  pendingReceivedRequests: [],

  sendFriendRequest: async (receiverId) => {
    set({ isLoading: true });
    try {
      const res = await authApi.post(`/friend/request/${receiverId}`);
      res.data?.message && toast.success(res.data?.message);

      get().openedUserProfile &&
        set((state) => ({
          openedUserProfile: {
            ...state.openedUserProfile,
            requestId: res.data?.relationId,
          },
        }));
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  getFriendRequests: async () => {
    set({ isLoading: true });
    try {
      const res = await authApi.get(`/friend/list/pending`);
      set({
        pendingSentRequests: res.data?.data?.sent || [],
        pendingReceivedRequests: res.data?.data?.received || [],
      });
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  acceptFriendRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const res = await authApi.put(`/friend/accept/${requestId}`);
      set((state) => ({
        pendingReceivedRequests: state.pendingReceivedRequests.filter(
          (req) => req._id !== requestId,
        ),
      }));
      res.data?.message && toast.success(res.data?.message);
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  rejectFriendRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const res = await authApi.delete(`/friend/reject/${requestId}`);
      set((state) => ({
        pendingReceivedRequests: state.pendingReceivedRequests.filter(
          (req) => req._id !== requestId,
        ),
      }));
      res.data?.message && toast.success(res.data?.message);
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  cancelFriendRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      const res = await authApi.delete(`/friend/cancel/${requestId}`);
      set((state) => ({
        pendingSentRequests: state.pendingSentRequests.filter(
          (req) => req._id !== requestId,
        ),
      }));
      res.data?.message && toast.success(res.data?.message);
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },
});
