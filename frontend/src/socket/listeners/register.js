import { socket } from "../socket";
import { registerMessageListeners } from "./messaging";
import { registerConversationListeners } from "./conversation";
import { registerPresenceListener } from "./presence";
import { registerGroupListeners } from "./group";

let isRegistered = false;

export const registerListeners = () => {
  if (isRegistered) return;
  isRegistered = true;

  registerPresenceListener(socket)
  registerConversationListeners(socket)
  registerMessageListeners(socket);
  registerGroupListeners(socket);
};
