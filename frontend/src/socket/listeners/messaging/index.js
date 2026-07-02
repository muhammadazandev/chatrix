import { socket } from "../../socket";
import { registerDeleteMessage } from "./deleteMessageListener";
import { registerEditMessage } from "./editMessageListener";
import { registerNewMessage } from "./newMessageListener";
import { registerPinMessage } from "./pinMessageListener";

export function registerMessageListeners(socket) {
  registerNewMessage(socket);
  registerEditMessage(socket);
  registerDeleteMessage(socket);
  registerPinMessage(socket);
}
