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
      await Conversation.updateOne(
        { _id: conversationId },
        {
          lastMessageText: message,
          lastMessageAt: atDate,
        },
      );

      // get sender info to show on frontend in group chats
      const populatedMessage = await Message.findById(newMessage._id).populate(
        "senderId",
        "username profilePicture",
      );

      const messageToSend = {
        _id: populatedMessage._id,
        conversationId: populatedMessage.conversationId,
        text: populatedMessage.text,
        createdAt: populatedMessage.createdAt,
        senderId: populatedMessage.senderId._id,
        conversationType: conversation.type,
        sender:
          conversation.type === "group"
            ? {
                _id: populatedMessage.senderId._id,
                username: populatedMessage.senderId.username,
                profilePicture: populatedMessage.senderId.profilePicture,
              }
            : null,
      };

      // Send the messages to all connected sockets on this conversation
      io.to(`conversation:${conversationId}`).emit("new_message", {
        message: messageToSend,
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
