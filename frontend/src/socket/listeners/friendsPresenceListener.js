import { SOCKET_EVENTS } from "../events";

export const registerFriendsListener = (socket, updateFriendStatus) => {
  socket.on(SOCKET_EVENTS["FRIEND_ONLINE"], ({ userId }) => {
    console.log(userId);

    updateFriendStatus(userId, true);
  });

  socket.on(SOCKET_EVENTS["FRIEND_OFFLINE"], ({ userId }) => {
    console.log(userId);

    updateFriendStatus(userId, false);
  });
};
