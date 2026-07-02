import { registerConversationHandler } from "./conversation/index.js";
import { registerMessageHandlers } from "./messaging/index.js";
import { registerPresenceHandler } from "./presence/index.js";

export function registerHandlers(io, socket) {
    registerConversationHandler(io, socket)
    registerMessageHandlers(io, socket);
    registerPresenceHandler(io, socket)
}