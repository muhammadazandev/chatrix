import { registerConversationConnections } from "./handlers/conversation.connection.handler.js";
import { registerFriendsPresence } from "./handlers/friends.presence.handler.js";
import { registerNewMessage } from "./handlers/new.message.handler.js";
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

    registerConversationConnections(io, socket);

    registerNewMessage(io, socket);
    
    socket.on("disconnect", (reason) => {
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
