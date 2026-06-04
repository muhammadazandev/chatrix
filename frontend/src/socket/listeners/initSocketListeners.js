import useFriendshipStore from "../../store/useFriendshipStore";
import { socket } from "../socket";
import { registerFriendsListener } from "./friendsPresenceListener";
import { registerNewMessage } from "./newMessageListener";
import { registerTyping } from "./typingListener";

export const initSocketListeners = () => {
  const updateFriendStatus = useFriendshipStore.getState().updateFriendStatus;

  registerFriendsListener(socket, updateFriendStatus);
  registerNewMessage(socket);
  registerTyping(socket);
};
