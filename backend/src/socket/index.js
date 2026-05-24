import { registerFriendsPresence } from "./handlers/friends.presence.handler.js";
import { socketAuth } from "./socket.middleware.js";
import { onlineUsers } from "./socket.store.js";

export const registerSocket = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user.userId.toString();

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    registerFriendsPresence(io, socket);

    socket.on("disconnect", () => {
      const userSockets = onlineUsers.get(userId);

      if (userSockets) {
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
    });
  });
};
