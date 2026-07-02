import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export function registerConversationListener(socket) {
  socket.on(SOCKET_EVENTS.CONVERSATION_UPDATED, (data) => {
    useChatStore.setState((state) => ({
      conversations: state.conversations.map((con) => {
        if (con._id !== data.conversationId) return con;

        return {
          ...con,
          lastMessageAt: data.lastMessageAt,
          lastMessageText: data.lastMessage,
        };
      }),
    }));
  });
}
