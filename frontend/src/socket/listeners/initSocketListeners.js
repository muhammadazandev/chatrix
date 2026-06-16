import useFriendshipStore from "../../store/useFriendshipStore";
import { socket } from "../socket";
import { registerFriendsListener } from "./friendsPresenceListener";
import { registerNewMessage } from "./newMessageListener";
import { registerTyping } from "./typingListener";

let isRegistered = false;

export const initSocketListeners = () => {
  if (isRegistered) return;
  isRegistered = true;
  
  const updateFriendStatus = useFriendshipStore.getState().updateFriendStatus;

  registerFriendsListener(socket, updateFriendStatus);
  registerNewMessage(socket);
  registerTyping(socket);
};
