import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";

export function registerNewMessage(io, socket) {
  socket.on("new_message", async (data, callback) => {
    try {
      const { conversationId, message } = data;
      const senderId = socket.user.userId;

      // Verify conversation exist
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: senderId,
      });

      if (!conversation) {
        return callback({
          success: false,
          message: "No conversation found",
        });
      }

      // Store the message in database
      const newMessage = await Message.create({
        conversationId,
        senderId,
        text: message,
      });

      const atDate = Date.now();

      // Set the message as latest message in Conversation
      await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessageText: data.message,
        lastMessageAt: atDate,
      });

      // Send the messages to all connected sockets on this conversation
      io.to(`conversation:${conversationId}`).emit("new_message", {
        message: newMessage,
        conversationId,
      });

      conversation.participants.forEach((id) => {
        io.to(`user:${id}`).emit("conversation_updated", {
          conversationId,
          lastMessage: newMessage.text,
          lastMessageAt: atDate,
        });
      });

      callback({
        success: true,
        message: newMessage,
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
