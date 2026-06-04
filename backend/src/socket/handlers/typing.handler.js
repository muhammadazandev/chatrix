import { typingUsers } from "../socket.store.js";

export function registerTyping(socket) {
  socket.on("start_typing", ({ conversationId }) => {
    if (!conversationId) return;

    const key = `${socket.id}:${conversationId}`;

    if (typingUsers.has(key)) return;

    typingUsers.add(key);

    socket.to(conversationId).emit("update_typing", {
      conversationId,
      userId: socket.user.userId,
      username: socket.user.username,
      isTyping: true,
    });
  });

  socket.on("stop_typing", ({ conversationId }) => {
    if (!conversationId) return;

    const key = `${socket.id}:${conversationId}`;

    typingUsers.delete(key);

    socket.to(conversationId).emit("update_typing", {
      conversationId,
      userId: socket.user.userId,
      isTyping: false,
    });
  });
}
