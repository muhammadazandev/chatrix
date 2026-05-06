import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../utils/api";
import toast from "react-hot-toast";
import handleError from "../utils/handleError";

const useFriendshipStore = create(
  persist(
    (set, get) => ({
      isLoading: false,
      pendingSentRequests: [],
      pendingReceivedRequests: [],
      friends: [],
      blocked: [],

      sendFriendRequest: async (receiverId) => {
        set({ isLoading: true });

        try {
          const res = await authApi.post(`/friend/request/${receiverId}`);

          res.data?.message && toast.success(res?.data?.message);
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getFriendRequests: async () => {
        set({ isLoading: true });

        try {
          const res = await authApi.get(`/friend/list/pending`);

          res.data?.data?.sent &&
            set({ pendingSentRequests: res.data?.data?.sent });

          res.data?.data?.received &&
            set({ pendingReceivedRequests: res.data?.data?.received });
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
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

          res.data?.message && toast.success(res?.data?.message);
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
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

          res.data?.message && toast.success(res?.data?.message);
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
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

          res.data?.message && toast.success(res?.data?.message);
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getAllFriends: async () => {
        set({ isLoading: true });

        try {
          const res = await authApi.get(`/friend/list/all`);

          res.data?.friends && set({ friends: res.data?.friends });
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
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

          res.data?.message && toast.success(res?.data?.message);
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getAllBlockedUsers: async () => {
        set({ isLoading: true });

        try {
          const res = await authApi.get(`/friend/list/blocked`);

          set({
            blocked: res?.data?.data,
          });
        } catch (error) {
          console.log(error);
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      blockUser: async (userId) => {
        set({ isLoading: true });

        try {
          const res = await authApi.post(`/friend/block/${userId}`);

          await get().getAllFriends();
          await get().getFriendRequests();

          res.data?.message && toast.success(res?.data?.message);
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      unblockUser: async (userId) => {
        set({ isLoading: true });

        try {
          const res = await authApi.delete(`/friend/unblock/${userId}`);

          await get().getAllBlockedUsers();

          res.data?.message && toast.success(res?.data?.message);
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "friendship-storage",

      partialize: (state) => ({
        pendingSentRequests: state.pendingSentRequests,
        pendingReceivedRequests: state.pendingReceivedRequests,
        friends: state.friends,
        blocked: state.blocked,
      }),
    },
  ),
);

export const friendshipStore = {
  getState: useFriendshipStore.getState,
  setState: useFriendshipStore.setState,
};

export default useFriendshipStore;
