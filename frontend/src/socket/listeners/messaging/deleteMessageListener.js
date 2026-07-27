import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export async function registerDeleteMessage(socket) {
  socket.on(SOCKET_EVENTS.DELETE_MESSAGE, (data) => {
    useChatStore.setState((state) => ({
      pinnedMessages: state.pinnedMessages.filter(
        (mes) => mes.message._id !== data.messageId,
      ),

      messages: state.messages.map((mes) => {
        if (mes.replyTo?._id === data.messageId) {
          return {
            ...mes,
            replyTo: {
              ...mes.replyTo,
              isDeleted: data.patch.isDeleted,
              text: "",
              media: data.patch.media,
            },
          };
        }

        if (mes._id !== data.messageId) return mes;

        return {
          ...mes,
          ...data.patch,
        };
      }),
    }));
  });
}
