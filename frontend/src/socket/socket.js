import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events";

export const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  autoConnect: false,
});

let lastJoinedConversation = null;

socket.on("connect", () => {
  const params = new URLSearchParams(window.location.search);
  const conId = params.get("conversationId") || lastJoinedConversation;

  if (conId) {
    lastJoinedConversation = conId;
    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conId);
  }
});

socket.on("disconnect", (reason) => {
  console.log(`Disconnected due to: ${reason}`);

  if (reason === "io client disconnect") {
    lastJoinedConversation = null;
  }
});
