import { registerParticipantListener } from "./praticipantListener";

export function registerGroupListeners(socket) {
  registerParticipantListener(socket);
}
