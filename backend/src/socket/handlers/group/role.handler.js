import mongoose from "mongoose";
import Conversation from "../../../models/conversation.model.js";

export function registerRoles(io, socket) {
  async function getValidatedGroup(action, targetUserId, groupId, userId) {
    if (!targetUserId || !groupId) {
      return {
        error: {
          success: false,
          message: "Insufficient data",
        },
      };
    }

    if (
      !mongoose.Types.ObjectId.isValid(targetUserId) ||
      !mongoose.Types.ObjectId.isValid(groupId)
    ) {
      return {
        error: {
          success: false,
          message: "Invalid data",
        },
      };
    }

    const group = await Conversation.findOne({
      _id: groupId,
      participants: { $all: [userId, targetUserId] },
      type: "group",
    });

    if (!group) {
      return {
        error: {
          success: false,
          message: "Group not found",
        },
      };
    }

    if (group.participantRoles.get(userId) !== "owner") {
      return {
        error: {
          success: false,
          message: `Only owner can ${action} participants`,
        },
      };
    }

    return { group };
  }

  socket.on("promote_participant", async (data, callback) => {
    try {
      const { toPromoteId, groupId } = data;
      const userId = socket.user.userId;

      const { error, group } = await getValidatedGroup(
        "promote",
        toPromoteId,
        groupId,
        userId,
      );

      if (error) return callback(error);

      if (group.participantRoles.get(toPromoteId) !== "member") {
        return callback({
          success: false,
          message: "Only member can be promoted to admin",
        });
      }

      group.participantRoles.set(toPromoteId, "admin");
      await group.save();

      io.to(`conversation:${groupId}`).emit("promote_participant", {
        groupId,
        promotedParticipant: toPromoteId,
      });

      return callback({
        success: true,
        message: "Participant promoted successfully",
        groupId,
        promotedParticipant: toPromoteId,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to promote participant",
      });
    }
  });

  socket.on("demote_participant", async (data, callback) => {
    try {
      const { toDemoteId, groupId } = data;
      const userId = socket.user.userId;

      const { error, group } = await getValidatedGroup(
        "demote",
        toDemoteId,
        groupId,
        userId,
      );

      if (error) return callback(error);

      if (group.participantRoles.get(toDemoteId) !== "admin") {
        return callback({
          success: false,
          message: "Only admin can be demoted to member",
        });
      }

      group.participantRoles.set(toDemoteId, "member");
      await group.save();

      io.to(`conversation:${groupId}`).emit("demote_participant", {
        groupId,
        demotedParticipant: toDemoteId,
      });

      return callback({
        success: true,
        message: "Participant demoted successfully",
        groupId,
        demotedParticipant: toDemoteId,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to demote participant",
      });
    }
  });
}
