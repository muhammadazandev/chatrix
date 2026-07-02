import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export function registerTyping(socket) {
  const addTypingUser = useChatStore.getState().addTypingUser;
  const removeTypingUser = useChatStore.getState().removeTypingUser;

  socket.on(
    SOCKET_EVENTS.UPDATE_TYPING,
    ({ conversationId, userId, isTyping, profilePicture, username }) => {
      if (isTyping) {
        addTypingUser(conversationId, userId, profilePicture, username);
      } else {
        removeTypingUser(conversationId, userId);
      }
    },
  );
}
