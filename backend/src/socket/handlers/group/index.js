import { registerDeleteGroup } from "./delete.group.handler.js";
import { registerLeaveGroup } from "./leave.handler.js";
import { registerParticipants } from "./participants.handler.js";
import { registerUpdateName } from "./update.username.handler.js";

export function registerGroupHandlers(io, socket) {
  registerParticipants(io, socket);
  registerUpdateName(io, socket);
  registerLeaveGroup(io, socket);
  registerDeleteGroup(io, socket);
}
