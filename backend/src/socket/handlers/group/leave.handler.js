import mongoose from "mongoose";
import Conversation from "../../../models/conversation.model.js";

export function registerLeaveGroup(io, socket) {
  socket.on("leave_group", async (data, callback) => {
    try {
      const { groupId } = data;
      const userId = socket.user.userId.toString();

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
          message: "No group found",
        });
      }

      if (group.participantRoles.get(userId) === "owner") {
        if (group.participants.length === 1) {
          await group.deleteOne();

          socket.leave(`conversation:${group._id}`);

          return callback({
            success: true,
            message: "Group deleted because no participants remained",
            groupDeleted: true,
          });
        }

        let newOwner = null;

        for (const participant of group.participants) {
          if (group.participantRoles.get(participant.toString()) === "admin") {
            newOwner = participant;
            break;
          }
        }

        if (!newOwner) {
          newOwner = group.participants.find(
            (participant) => participant.toString() !== userId,
          );
        }

        group.participantRoles.set(newOwner.toString(), "owner");
      }

      group.participants.pull(userId);
      group.participantRoles.delete(userId);
      await group.save();

      socket.leave(`conversation:${group._id}`);

      io.to(`conversation:${group._id}`).emit("leave_group", {
        groupId: group._id,
        userId,
      });

      return callback({
        success: true,
        message: "Successfully left the group",
        groupId: group._id,
        userId,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to leave group",
      });
    }
  });
}
