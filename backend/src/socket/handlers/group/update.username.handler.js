import Conversation from "../../../models/conversation.model.js";

export function registerUpdateName(io, socket) {
  socket.on("group_updated", async (data, callback) => {
    try {
      const { groupId, newName } = data;
      const trimmedName = newName.trim();
      const userId = socket.user.userId;

      if (!groupId || !trimmedName) {
        return callback({
          success: false,
          message: "Insufficient data",
        });
      }

      if (trimmedName.length > 50 || trimmedName.length < 3) {
        return callback({
          success: false,
          message: "Group name must be 50 characters or less than 3",
        });
      }

      const group = await Conversation.findOne({
        _id: groupId,
        participants: userId,
      });

      if (!group) {
        return callback({
          success: false,
          message: "Group not found",
        });
      }

      if (group.participantRoles.get(userId) === "member") {
        return callback({
          success: false,
          message: "Members can't update name",
        });
      }

      if (trimmedName === group.name) {
        return callback({
          success: false,
          message: "Please enter a new name first",
        });
      }

      group.name = trimmedName;
      await group.save();

      io.to(`conversation:${group._id}`).emit("group_updated", {
        groupId: group._id,
        name: group.name,
      });

      return callback({
        success: true,
        message: "Group name updated successfully",
        groupId: group._id,
        name: group.name,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to update name",
      });
    }
  });
}
