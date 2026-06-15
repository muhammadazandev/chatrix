import toast from "react-hot-toast";
import { authApi } from "../../../utils/api";
import handleError from "../../../utils/handleError";

export const createUiSlice = (set, get) => ({
  isLoading: false,
  openedUserProfile: null,
  searchResults: [],

  updateOpenedUserProfile: (user) => set({ openedUserProfile: user }),

  updateOpenedUserRelationship: (newRelation) => {
    set((state) => ({
      openedUserProfile: {
        ...state.openedUserProfile,
        relationshipStatus: newRelation,
      },
    }));
  },

  setSearchResults: (newResults) => set({ searchResults: newResults }),

  getUserProfileInfo: async (userId) => {
    try {
      const res = await authApi.get(`/user/${userId}/profile`);
      set({ openedUserProfile: res?.data?.user });
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
