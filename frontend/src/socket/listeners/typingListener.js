import useChatStore from "../../store/useChatStore";
import { SOCKET_EVENTS } from "../events";

export function registerTyping(socket) {
  const addTypingUser = useChatStore.getState().addTypingUser;
  const removeTypingUser = useChatStore.getState().removeTypingUser;

  socket.on(
    SOCKET_EVENTS.UPDATE_TYPING,
    ({ conversationId, userId, isTyping, username }) => {
    isTyping
        ? addTypingUser(conversationId, userId, username)
        : removeTypingUser(conversationId, userId, username);
    },
  );
}
