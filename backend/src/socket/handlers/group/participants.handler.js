import Message from "../../../models/message.model.js";
import processParticipants from "../../helpers/participants.helper.js";

export function registerParticipants(io, socket) {
  socket.on("add_participant", async (data, callback) => {
    try {
      const { groupId, participants: newParticipants } = data;
      const userId = socket.user.userId;

      const { group, formattedParticipants, newlyAdded, error } =
        await processParticipants(groupId, userId, newParticipants, "add");

      if (error) return callback(error);

      const systemMessage = await Message.create({
        conversationId: groupId,
        messageType: "system",
        systemAction: "member_added",
        metadata: {
          actor: userId,
          targets: newParticipants,
        },
      });

      await systemMessage.populate([
        { path: "metadata.actor", select: "username" },
        { path: "metadata.targets", select: "username" },
      ]);

      io.to(`conversation:${group._id}`).emit("add_participant", {
        participants: formattedParticipants,
        groupId: group._id,
        newlyAdded,
        newParticipantRoles: newParticipants.map((id) => ({
          _id: id,
          role: "member",
        })),
        systemMessage,
      });

      return callback({
        success: true,
        message: "Participants added successfully",
        participants: formattedParticipants,
        groupId: group._id,
        newlyAdded,
        newParticipantRoles: newParticipants.map((id) => ({
          _id: id,
          role: "member",
        })),
        systemMessage,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to add participants",
      });
    }
  });
  socket.on("remove_participant", async (data, callback) => {
    try {
      const { groupId, participants: removeParticipants } = data;
      const userId = socket.user.userId;

      const { group, formattedParticipants, error } = await processParticipants(
        groupId,
        userId,
        removeParticipants,
        "remove",
      );

      if (error) return callback(error);

      const systemMessage = await Message.create({
        conversationId: groupId,
        messageType: "system",
        systemAction: "member_removed",
        metadata: {
          actor: userId,
          targets: removeParticipants,
        },
      });

      await systemMessage.populate([
        { path: "metadata.actor", select: "username" },
        { path: "metadata.targets", select: "username" },
      ]);

      io.to(`conversation:${group._id}`).emit("remove_participant", {
        participants: formattedParticipants,
        removedParticipantsId: removeParticipants,
        groupId: group._id,
        systemMessage,
      });

      return callback({
        success: true,
        message: "Participants removed successfully",
        participants: formattedParticipants,
        removedParticipantsId: removeParticipants,
        groupId: group._id,
        systemMessage,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to remove participants",
      });
    }
  });
}
