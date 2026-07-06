import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events";

export const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  autoConnect: false,
});

let lastJoinedConversation = null;

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  const params = new URLSearchParams(window.location.search);
  const conId = params.get("conversationId") || lastJoinedConversation;

  if (conId) {
    console.log("Rejoining:", conId);

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

socket.on("connect", () => {
  console.log("CONNECTED", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("DISCONNECTED", reason);
});

socket.io.on("reconnect", (attempt) => {
  console.log("RECONNECTED", attempt);
});

socket.io.on("reconnect_attempt", () => {
  console.log("Trying reconnect...");
});

socket.io.on("reconnect_error", (err) => {
  console.log("Reconnect error", err);
});

socket.io.on("reconnect_failed", () => {
  console.log("Reconnect failed");
});

window.socket = socket;
