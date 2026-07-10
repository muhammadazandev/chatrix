import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export function registerUpdateProfileListener(socket) {
  socket.on(SOCKET_EVENTS.GROUP_UPDATED, (data) => {
    useChatStore.setState((state) => {
      if (
        !state.currentConversation ||
        state.currentConversation._id !== data.groupId
      )
        return state;

      if (data.avatar) {
        return {
          currentConversation: {
            ...state.currentConversation,
            avatar: data.avatar,
          },
          conversations: state.conversations.map((con) => {
            if (con._id !== data.groupId) return con;

            return {
              ...con,
              avatar: data.avatar,
            };
          }),
        };
      }

      if (data.name) {
        return {
          currentConversation: {
            ...state.currentConversation,
            name: data.name,
          },
          conversations: state.conversations.map((con) => {
            if (con._id !== data.groupId) return con;

            return {
              ...con,
              title: data.name,
            };
          }),
        };
      }

      return state;
    });
  });
}
