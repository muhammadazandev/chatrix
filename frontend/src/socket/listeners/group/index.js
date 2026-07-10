import { registerDeleteListener } from "./deleteListener";
import { registerLeaveListener } from "./leaveListener";
import { registerParticipantListener } from "./praticipantListener";
import { registerRolesListener } from "./roleListener";
import { registerUpdateProfileListener } from "./updateProfileListener";

export function registerGroupListeners(socket) {
  registerParticipantListener(socket);
  registerUpdateProfileListener(socket);
  registerLeaveListener(socket);
  registerDeleteListener(socket);
  registerRolesListener(socket);
}
