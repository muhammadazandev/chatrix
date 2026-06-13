import useChatStore from "../../store/useChatStore";
import { SOCKET_EVENTS } from "../events";

export const registerNewMessage = (socket) => {
  socket.on(SOCKET_EVENTS["NEW_MESSAGE"], (data) => {
    try {
      const message = data?.message ?? data;
      const time = new Date(message.createdAt);

      if (!message) {
        return;
      }

      useChatStore.setState((state) => ({
        messages: [...(state.messages || []), message],
        conversations: state.conversations.map((con) => {
          if (con._id !== message.conversationId) return con;

          return {
            ...con,
            lastMessageAt: time,
            lastMessageText: message.text,
          };
        }),
      }));
    } catch (err) {
      console.error("registerNewMessage handler error:", err);
    }
  });
};
