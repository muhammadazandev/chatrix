import mongoose from "mongoose";
import Conversation from "../../../models/conversation.model.js";
import Message from "../../../models/message.model.js";

export function registerDeleteGroup(io, socket) {
  socket.on("delete_group", async (data, callback) => {
    try {
      const { groupId } = data;
      const userId = socket.user.userId.toString();
      const roomName = `conversation:${groupId}`;

      if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
        return callback({
          success: false,
          message: "Invalid group ID",
        });
      }

      const group = await Conversation.findOne({
        _id: groupId,
        participants: userId,
        type: "group",
      });

      if (!group) {
        return callback({
          success: false,
          message: "No group present",
        });
      }

      const isOwner = group.participantRoles.get(userId) === "owner";

      if (!isOwner) {
        return callback({
          success: false,
          message: "Only owner can delete group",
        });
      }

      //  Broadcast to each user so, client can update conversation list too
      for (const participantId of group.participants) {
        io.to(`user:${participantId}`).emit("delete_group", {
          groupId,
        });
      }

      // delete group
      await group.deleteOne();

      // delete all messages of the conversation
      await Message.deleteMany({
        conversationId: groupId,
      });

      io.to(roomName).emit("delete_group", { groupId });

      // Force all users in connected room to leave and this automatically deletes socket room
      io.in(roomName).socketsLeave(roomName);

      return callback({
        success: true,
        message: "Group deleted successfully",
        groupId,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to delete group",
      });
    }
  });
}
