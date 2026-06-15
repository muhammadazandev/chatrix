import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createUiSlice } from "./slices/friendshipSlices/uiSlice";
import { createRequestSlice } from "./slices/friendshipSlices/requestSlice";
import { createRelationshipSlice } from "./slices/friendshipSlices/relationshipSlice";

const useFriendshipStore = create(
  persist(
    (...a) => ({
      ...createUiSlice(...a),
      ...createRequestSlice(...a),
      ...createRelationshipSlice(...a),
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
