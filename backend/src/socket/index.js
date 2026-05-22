import { socketAuth } from "./socket.middleware.js";
import { onlineUsers } from "./socket.store.js";

export const registerSocket = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user.userId;

    onlineUsers.set(userId, socket.id);

    console.log("User Online: ", userId);
    console.log(onlineUsers);

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      console.log("User Offline: ", userId);
    });
  });
};
