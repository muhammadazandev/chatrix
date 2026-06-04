import { io } from "socket.io-client";
import useChatStore from "../store/useChatStore";
import { SOCKET_EVENTS } from "./events";

export const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  autoConnect: false,
});

let lastJoinedConversation = null;

socket.on("connect", () => {
  const conId = useChatStore.getState().currentConversationId;

  if (conId) {
    lastJoinedConversation = conId;

    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conId);
  }
});

socket.on("disconnect", () => {
  
  lastJoinedConversation = null;
});
