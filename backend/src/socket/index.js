import { registerHandlers } from "./handlers/register.js";
import { socketAuth } from "./socket.middleware.js";
import { onlineUsers, typingUsers } from "./socket.store.js";

export const registerSocket = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user.userId.toString();

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    socket.join(`user:${userId}`);

    onlineUsers.get(userId).add(socket.id);

    registerHandlers(io, socket)

    socket.on("disconnect", (reason) => {
      // clean up any typing entries for this socket and notify rooms
      for (const key of typingUsers) {
        if (key.startsWith(`${socket.id}:`)) {
          const parts = key.split(":");
          const conversationId = parts.slice(1).join(":");

          typingUsers.delete(key);

          io.to(`conversation:${conversationId}`).emit("update_typing", {
            conversationId,
            userId: socket.user.userId,
            isTyping: false,
          });
        }
      }

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
