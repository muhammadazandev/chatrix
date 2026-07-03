import { registerConversationHandlers } from "./conversation/index.js";
import { registerGroupHandlers } from "./group/index.js";
import { registerMessageHandlers } from "./messaging/index.js";
import { registerPresenceHandler } from "./presence/index.js";

export function registerHandlers(io, socket) {
  registerConversationHandlers(io, socket);
  registerMessageHandlers(io, socket);
  registerPresenceHandler(io, socket);
  registerGroupHandlers(io, socket);
}
