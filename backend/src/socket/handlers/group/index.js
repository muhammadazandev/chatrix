import { registerParticipants } from "./participants.handler.js";

export function registerGroupHandlers(io, socket) {
    registerParticipants(io, socket);
}