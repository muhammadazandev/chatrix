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

      message.isDeleted = true;
      message.isEdited = false;
      message.editedAt = null;
      message.text = "";
      message.mediaUrl = "";
      await message.save();

      // Delete from pinned messages if pinned
      const con = await Conversation.findById(
        message.conversationId,
        "pinnedMessages",
      );
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
          mediaUrl: message.mediaUrl,
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
