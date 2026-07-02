import { registerFriendsListener } from "./friendsPresenceListener";

export function registerPresenceListener(socket) {
    registerFriendsListener(socket);
}