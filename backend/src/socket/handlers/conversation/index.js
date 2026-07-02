import { registerConversationConnections } from "./conversation.connection.handler.js";
import { registerTyping } from "./typing.handler.js";

export function registerConversationHandler(io, socket) {
  registerConversationConnections(io, socket);
  registerTyping(socket);
}
