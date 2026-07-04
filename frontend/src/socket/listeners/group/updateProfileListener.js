import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export function registerUpdateProfile(socket) {
  socket.on(SOCKET_EVENTS.GROUP_UPDATED, (data) => {
    useChatStore.setState((state) => {
      if (
        !state.currentConversation ||
        state.currentConversation._id !== data.groupId
      ) return state;

      return {
        currentConversation: {
          ...state.currentConversation,
          avatar: data.avatar,
        },
      };
    });
  });
}
