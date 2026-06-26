import {
  validateConversationParticipant,
  createAndPopulateMessage,
  formatMessage,
  broadcastMessage,
} from "../helpers/messageHelpers.js";

export function registerNewMessage(io, socket) {
  socket.on("new_message", async (data, callback) => {
    try {
      const { message } = data;
      const senderId = socket.user.userId;
      const atDate = Date.now();

      // Verify conversation exist
      const { errValidate, conversation } =
        await validateConversationParticipant(message.conversationId, senderId);
      if (errValidate) return callback(errValidate);

      // Database logic
      const { messageDoc, newMessage } = await createAndPopulateMessage(
        message,
        atDate,
        senderId,
      );

      // Format reply to message
      const messageToSend = formatMessage(messageDoc, conversation.type);

      // Broadcast message
      broadcastMessage(
        io,
        message.conversationId,
        messageToSend,
        conversation,
        newMessage,
        atDate,
      );

      callback({
        success: true,
        message: messageToSend,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: "Failed to send message",
      });
    }
  });
}
