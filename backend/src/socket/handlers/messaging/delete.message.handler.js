import cloudinary from "../../../lib/cloudinary.js";
import Conversation from "../../../models/conversation.model.js";
import Message from "../../../models/message.model.js";

export function registerDeleteMessage(io, socket) {
  socket.on("delete_message", async (data, callback) => {
    try {
      const { messageId } = data;
      const senderId = socket.user.userId;

      if (!messageId) {
        return callback?.({
          success: false,
          message: "Message ID not present",
        });
      }

      // Find, validate, and update message
      const message = await Message.findOne({
        _id: messageId,
        senderId,
      });

      if (!message) {
        return callback?.({
          success: false,
          message: "Message not found",
        });
      }

      if (message.isDeleted) {
        return callback?.({
          success: false,
          message: "Message already deleted",
        });
      }

      if (message.media?.publicId) {
        const result = await cloudinary.uploader.destroy(
          message.media.publicId,
          {
            resource_type: message.media.resourceType,
          },
        );

        if (result.result !== "ok") {
          return callback?.({
            success: false,
            message: `Cloudinary deletion failed: ${result.result}`,
          });
        }
      }

      message.isDeleted = true;
      message.isEdited = false;
      message.text = "";
      message.editedAt = undefined;
      message.media = undefined;

      await message.save();

      // Delete from pinned messages if pinned
      const con = await Conversation.findById(
        message.conversationId,
        "pinnedMessages",
      );

      if (!con) {
        return callback?.({
          success: false,
          message: "Conversation not found",
        });
      }

      const index = con.pinnedMessages.findIndex(
        (pin) => pin.message.toString() === message._id.toString(),
      );

      if (index !== -1) {
        con.pinnedMessages.splice(index, 1);
        await con.save();
      }

      // broadcast message
      io.to(`conversation:${message.conversationId}`).emit("delete_message", {
        messageId: message._id,
        patch: {
          isDeleted: message.isDeleted,
          isEdited: message.isEdited,
          editedAt: message.editedAt,
          text: message.text,
          media: message.media
        },
      });

      return callback?.({
        success: true,
        message: {
          _id: message._id,
          isDeleted: message.isDeleted,
        },
      });
    } catch (error) {
      console.error(error);
      callback?.({ success: false, message: "Internal server error" });
    }
  });
}
