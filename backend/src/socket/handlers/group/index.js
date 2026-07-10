import { registerDeleteGroup } from "./delete.handler.js";
import { registerLeaveGroup } from "./leave.handler.js";
import { registerParticipants } from "./participants.handler.js";
import { registerRoles } from "./role.handler.js";
import { registerUpdateName } from "./update.name.handler.js";

export function registerGroupHandlers(io, socket) {
  registerParticipants(io, socket);
  registerUpdateName(io, socket);
  registerLeaveGroup(io, socket);
  registerDeleteGroup(io, socket);
  registerRoles(io, socket);
}
