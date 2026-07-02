import { registerFriendsPresence } from "./friends.presence.handler.js";

export function registerPresenceHandler(io, socket) {
    registerFriendsPresence(io, socket)
}