import Relationship from "../../models/relationship.model.js";
import { onlineUsers } from "../socket.store.js";

const getFriendsId = async (userId) => {
  const relationships = await Relationship.find({
    status: "friends",
    $or: [{ user1: userId }, { user2: userId }],
  });

  return relationships.map((re) =>
    re.user1.toString() === userId ? re.user2 : re.user1,
  );
};

export const registerFriendsPresence = (io, socket) => {
  const userId = socket.user.userId.toString();

  const notifyIfOnline = (targetUserId, event, payload) => {
    const socketIds = onlineUsers.get(targetUserId);

    if (socketIds) {
      for (const socketId of socketIds) {
        io.to(socketId).emit(event, payload);
      }
    }
  };

  // main functions
  const handleFriendOnline = async () => {
    try {
      const friendIds = await getFriendsId(userId);

      for (const friendId of friendIds) {
        notifyIfOnline(friendId.toString(), "friend_online", { userId });
      }
    } catch (err) {
      console.error("friend_online error:", err);
    }
  };

  const handleFriendOffline = async () => {
    try {
      const friendIds = await getFriendsId(userId);

      for (const friendId of friendIds) {
        notifyIfOnline(friendId.toString(), "friend_offline", { userId });
      }
    } catch (err) {
      console.error("friend_offline error:", err);
    }
  };

  handleFriendOnline();

  socket.on("disconnect", () => {
    handleFriendOffline();
  });
};
