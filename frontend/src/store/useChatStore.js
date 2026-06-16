import { create } from "zustand";
import { createGroupSlice } from "./slices/chatSlices/groupSlice";
import { createTypingSlice } from "./slices/chatSlices/typingSlice";
import { createMessageSlice } from "./slices/chatSlices/messageSlice";
import { createConversationSlice } from "./slices/chatSlices/conversationSlice";

const useChatStore = create((...a) => ({
  ...createConversationSlice(...a),
  ...createMessageSlice(...a),
  ...createTypingSlice(...a),
  ...createGroupSlice(...a),
}));

export const getChatState = useChatStore.getState;

export default useChatStore;
