import { registerConversationListener } from "./conversationListener";
import { registerTyping } from "./typingListener";

export function registerConversationListeners(socket) {
  registerTyping(socket);
  registerConversationListener(socket);
}
