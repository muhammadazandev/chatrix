import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export async function registerDeleteMessage(socket) {
  socket.on(SOCKET_EVENTS.DELETE_MESSAGE, (data) => {
    useChatStore.setState((state) => ({
      messages: state.messages.map((mes) => {
        if (mes.replyTo?._id === data.messageId) {
          return {
            ...mes,
            replyTo: {
              ...mes.replyTo,
              isDeleted: data.patch.isDeleted,
              text: "",
            },
          };
        }

        if (mes._id !== data.messageId) return mes;

        return {
          ...mes,
          isDeleted: data.patch.isDeleted,
          isEdited: data.patch.isEdited,
          editedAt: data.patch.editedAt,
          text: data.patch.text,
          mediaUrl: data.patch.mediaUrl,
        };
      }),
    }));
  });
}
