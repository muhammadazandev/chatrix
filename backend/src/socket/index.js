import { registerConversationConnections } from "./handlers/conversation.connection.handler.js";
import { registerFriendsPresence } from "./handlers/friends.presence.handler.js";
import { registerNewMessage } from "./handlers/new.message.handler.js";
import { registerTyping } from "./handlers/typing.handler.js";
import { socketAuth } from "./socket.middleware.js";
import { onlineUsers, typingUsers } from "./socket.store.js";

export const registerSocket = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user.userId.toString();

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    registerFriendsPresence(io, socket);

    registerConversationConnections(io, socket);

    registerNewMessage(io, socket);

    registerTyping(socket);

    socket.on("disconnect", (reason) => {
      // clean up any typing entries for this socket and notify rooms
      for (const key of typingUsers) {
        if (key.startsWith(`${socket.id}:`)) {
          const parts = key.split(":");
          const conversationId = parts.slice(1).join(":");

          typingUsers.delete(key);

          io.to(conversationId).emit("update_typing", {
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
