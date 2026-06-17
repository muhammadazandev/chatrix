import useChatStore from "../../store/useChatStore";
import { SOCKET_EVENTS } from "../events";

export const registerNewMessage = (socket) => {
  socket.on(SOCKET_EVENTS["NEW_MESSAGE"], (data) => {
    try {
      const message = data?.message ?? data;

      if (!message) {
        return;
      }

      useChatStore.setState((state) => {
        const alreadyExists = state.messages.some((m) => m._id === message._id);

        if (alreadyExists) {
          return state;
        }

        return {
          messages: [...(state.messages || []), message],
        };
      });
    } catch (err) {
      console.error("registerNewMessage handler error:", err);
    }
  });
};
