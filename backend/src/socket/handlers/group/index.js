import { registerParticipants } from "./participants.handler.js";
import { registerUpdateName } from "./update.username.handler.js";

export function registerGroupHandlers(io, socket) {
    registerParticipants(io, socket);
    registerUpdateName(io, socket);
}