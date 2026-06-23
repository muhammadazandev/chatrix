import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";

export function registerNewMessage(io, socket) {
  socket.on("new_message", async (data, callback) => {
    try {
      const { message } = data;
      const senderId = socket.user.userId;

      // Verify conversation exist
      const conversation = await Conversation.findOne({
        _id: message.conversationId,
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
        conversationId: message.conversationId,
        senderId,
        text: message.text,
        replyTo: message.replyTo,
      });

      const atDate = Date.now();

      // Set the message as latest message in Conversation
      await Conversation.updateOne(
        { _id: message.conversationId },
        {
          lastMessageText: message.text,
          lastMessageAt: atDate,
        },
      );

      // get sender info to show on frontend in group chats
      const populatedMessage = await Message.findById(newMessage._id)
        .populate("senderId", "username profilePicture")
        .populate({
          path: "replyTo",
          select: "text senderId",
          populate: {
            path: "senderId",
            select: "username profilePicture",
          },
        });

      const messageDoc = populatedMessage.toObject();

      // Format reply to message
      let formattedReplyTo = null;
      if (messageDoc.replyTo) {
        formattedReplyTo = {
          _id: messageDoc.replyTo._id,
          text: messageDoc.replyTo.text,
          sender: messageDoc.replyTo.senderId || null,
        };
      }

      const messageToSend = {
        ...messageDoc,
        conversationType: conversation.type,
        senderId: senderId,
        sender: {
          _id: messageDoc.senderId._id,
          username: messageDoc.senderId.username,
          profilePicture: messageDoc.senderId.profilePicture,
        },
        replyTo: formattedReplyTo,
      };

      // Send the messages to all connected sockets on this conversation
      io.to(`conversation:${message.conversationId}`).emit("new_message", {
        message: messageToSend,
        conversationId: message.conversationId,
      });

      conversation.participants.forEach((id) => {
        io.to(`user:${id}`).emit("conversation_updated", {
          conversationId: message.conversationId,
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
