import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export function registerPinMessage(socket) {
  socket.on(SOCKET_EVENTS.PIN_MESSAGE, (data) => {
    useChatStore.setState((state) => {
      if (state.pinnedMessages.some((m) => m._id === data.pinnedMessage._id)) {
        return state;
      }

      return {
        pinnedMessages: [...state.pinnedMessages, data.pinnedMessage],
      };
    });
  });

  socket.on(SOCKET_EVENTS.UNPIN_MESSAGE, (data) => {
    useChatStore.setState((state) => ({
      pinnedMessages: state.pinnedMessages.filter(
        (m) => m.message._id !== data.messageId,
      ),
    }));
  });
}
