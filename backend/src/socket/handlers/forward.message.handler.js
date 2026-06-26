import mongoose from "mongoose";
import Message from "../../models/message.model.js";
import {
  broadcastMessage,
  createAndPopulateMessage,
  formatMessage,
  validateConversationParticipant,
} from "../helpers/messageHelpers.js";

export function registerForwardMessage(io, socket) {
  socket.on("forward_message", async (data, callback) => {
    try {
      const { messageId, conversationIds } = data;
      const senderId = socket.user.userId;
      const atDate = new Date();

      if (
        !messageId ||
        !conversationIds ||
        !Array.isArray(conversationIds) ||
        conversationIds.length === 0
      ) {
        return callback({
          success: false,
          message: "Insufficient data",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return callback({
          success: false,
          message: "Invalid message Id",
        });
      }

      const message = await Message.findById(messageId);

      if (!message) {
        return callback({
          success: false,
          message: "Message not found",
        });
      }

      if (message.isDeleted) {
        return callback({
          success: false,
          message: "Deleted message cannot be forward"
        })
      }

      for (const id of conversationIds) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return callback({
            success: false,
            message: "Invalid conversation id",
          });
        }

        const { errValidate, conversation } =
          await validateConversationParticipant(id, senderId);

        if (errValidate) return callback(errValidate);

        const forwardedMessage = {
          ...message.toObject(),
          conversationId: id,
        };

        const { messageDoc, newMessage } = await createAndPopulateMessage(
          forwardedMessage,
          atDate,
          senderId,
          true,
        );

        const messageToSend = formatMessage(messageDoc, conversation.type);

        broadcastMessage(
          io,
          id,
          messageToSend,
          conversation,
          newMessage,
          atDate,
        );
      }

      return callback({
        success: true,
        message: "Message forwarded successfully",
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to forward message",
      });
    }
  });
}
