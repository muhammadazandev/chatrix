import toast from "react-hot-toast";
import handleError from "../../utils/handleError";
import { authApi } from "../../utils/api";

export const createRelationshipSlice = (set, get) => ({
  friends: [],
  blocked: [],

  updateFriendStatus: (userId, isOnline) =>
    set((state) => ({
      friends: state.friends.map((f) =>
        f._id.toString() === userId.toString() ? { ...f, isOnline } : f,
      ),
    })),

  getAllFriends: async () => {
    set({ isLoading: true });
    try {
      const res = await authApi.get(`/friend/list/all`);
      res.data?.friends && set({ friends: res.data?.friends || [] });
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  unfriend: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await authApi.delete(`/friend/unfriend/${userId}`);
      set((state) => ({
        friends: state.friends.filter((req) => req._id !== userId),
      }));
      res.data?.message && toast.success(res.data?.message);
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  getAllBlockedUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await authApi.get(`/friend/list/blocked`);
      set({ blocked: res.data?.data || [] });
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  blockUser: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await authApi.post(`/friend/block/${userId}`);
      set((state) => ({
        friends: state.friends.filter((f) => f._id !== userId),
        pendingSentRequests: state.pendingSentRequests.filter(
          (r) => r._id !== userId,
        ),
        pendingReceivedRequests: state.pendingReceivedRequests.filter(
          (r) => r._id !== userId,
        ),
        blocked: [...state.blocked, { _id: userId }],
      }));
      res.data?.message && toast.success(res.data?.message);
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  unblockUser: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await authApi.delete(`/friend/unblock/${userId}`);
      set((state) => ({
        blocked: state.blocked.filter((b) => b._id !== userId),
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
