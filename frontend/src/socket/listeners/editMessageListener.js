import useChatStore from "../../store/useChatStore";
import { SOCKET_EVENTS } from "../events";

export function registerEditMessage(socket) {
  socket.on(SOCKET_EVENTS.EDIT_MESSAGE, (data) => {
    useChatStore.setState((state) => ({
      messages: state.messages.map((mes) => {
        if (mes._id !== data.messageId) return mes;

        return {
          ...mes,
          isEdited: data.patch.isEdited,
          text: data.patch.text,
          editedAt: data.patch.editedAt,
        };
      }),
    }));
  });
}
