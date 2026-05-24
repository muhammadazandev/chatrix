import useFriendshipStore from "../../store/useFriendshipStore";
import { socket } from "../socket";
import { registerFriendsListener } from "./friendsPresenceListener";

export const initSocketListeners = () => {
  const updateFriendStatus = useFriendshipStore.getState().updateFriendStatus;

  registerFriendsListener(socket, updateFriendStatus);
};
