import useChatStore from "../../store/useChatStore";
import { SOCKET_EVENTS } from "../events";

export async function registerDeleteMessage(socket) {
  socket.on(SOCKET_EVENTS.DELETE_MESSAGE, (data) => {
    useChatStore.setState((state) => ({
      messages: state.messages.map((mes) => {
        if (mes._id !== data.messageId) return mes;

        return {
          ...mes,
          isDeleted: data.patch.isDeleted,
          isEdited: data.patch.isEdited,
          editedAt: data.patch.editedAt,
          editedAt: data.patch.editedAt,
          mediaUrl: data.patch.mediaUrl,
        };
      }),
    }));
  });
}
