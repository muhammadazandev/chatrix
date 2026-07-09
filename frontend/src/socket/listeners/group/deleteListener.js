import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export function registerDeleteListener(socket) {
  socket.on(SOCKET_EVENTS.DELETE_GROUP, (data) => {
    useChatStore.setState((state) => {
      if (data.groupId === state.currentConversation?._id) {
        return {
          currentConversation: null,
          conversations: state.conversations.filter(
            (con) => con._id !== data.groupId,
          ),
          messages: [],
        };
      }

      return {
        conversations: state.conversations.filter(
          (con) => con._id !== data.groupId,
        ),
      };
    });
  });
}
