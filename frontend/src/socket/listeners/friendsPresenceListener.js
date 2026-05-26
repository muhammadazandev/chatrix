import { SOCKET_EVENTS } from "../events";

export const registerFriendsListener = (socket, updateFriendStatus) => {
  socket.on(SOCKET_EVENTS["FRIEND_ONLINE"], ({ userId }) => {
    updateFriendStatus(userId, true);
  });

  socket.on(SOCKET_EVENTS["FRIEND_OFFLINE"], ({ userId }) => {
    updateFriendStatus(userId, false);
  });
};
