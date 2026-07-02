import { registerDeleteMessage } from "./delete.message.handler.js";
import { registerEditMessage } from "./edit.message.handler.js";
import { registerForwardMessage } from "./forward.message.handler.js";
import { registerNewMessage } from "./new.message.handler.js";
import { registerPinMessage } from "./pin.message.handler.js";

export function registerMessageHandlers(io, socket) {
  registerNewMessage(io, socket);
  registerEditMessage(io, socket);
  registerDeleteMessage(io, socket);
  registerForwardMessage(io, socket);
  registerPinMessage(io, socket);
}
