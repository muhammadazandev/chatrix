import Message from "../../models/message.model.js";

export function registerEditMessage(io, socket) {
  socket.on("edit_message", async (data, callback) => {
    try {
      const { messageId, editedMessage } = data;
      const userId = socket.user.userId;

      // Get old message
      const message = await Message.findOne({
        _id: messageId,
        senderId: userId,
      });

      if (!message) {
        return callback({
          success: false,
          message: "Old message not found or you are not sender",
        });
      }

      // Check message type and return if message audio or media
      if (message.messageType !== "text") {
        return callback({
          success: false,
          message: "Only text message can be edit",
        });
      }

      // Check that a message is 15 minutes old
      if (new Date() - message.createdAt > 900000) {
        return callback({
          success: false,
          message: "Cannot edit message after 15 minutes",
        });
      }

      // Update old message
      message.text = editedMessage;
      message.isEdited = true;
      message.editedAt = new Date();
      await message.save();

      // Broadcast message
      io.to(`conversation:${message.conversationId}`).emit("edit_message", {
        messageId: message._id,
        conversationId: message.conversationId,
        patch: {
          text: message.text,
          isEdited: true,
          editedAt: message.editedAt,
        },
      });

      callback({
        success: true,
        message: {
          _id: message._id,
          text: message.text,
          isEdited: true,
          editedAt: message.editedAt,
        },
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to edit message",
      });
    }
  });
}
