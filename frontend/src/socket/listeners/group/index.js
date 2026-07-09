import { registerDeleteListener } from "./deleteListener";
import { registerLeaveListener } from "./leaveListener";
import { registerParticipantListener } from "./praticipantListener";
import { registerUpdateProfile } from "./updateProfileListener";

export function registerGroupListeners(socket) {
  registerParticipantListener(socket);
  registerUpdateProfile(socket);
  registerLeaveListener(socket);
  registerDeleteListener(socket);
}
