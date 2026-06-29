import { socket } from "../socket";
import { registerConversationListener } from "./conversationListener";
import { registerDeleteMessage } from "./deleteMessageListener";
import { registerEditMessage } from "./editMessageListener";
import { registerFriendsListener } from "./friendsPresenceListener";
import { registerNewMessage } from "./newMessageListener";
import { registerPinMessage } from "./pinMessageListener";
import { registerTyping } from "./typingListener";

let isRegistered = false;

export const initSocketListeners = () => {
  if (isRegistered) return;
  isRegistered = true;

  registerFriendsListener(socket);
  registerNewMessage(socket);
  registerTyping(socket);
  registerConversationListener(socket);
  registerEditMessage(socket);
  registerDeleteMessage(socket);
  registerPinMessage(socket);
};
