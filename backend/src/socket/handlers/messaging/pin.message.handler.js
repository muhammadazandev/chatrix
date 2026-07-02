import Conversation from "../../../models/conversation.model.js";
import Message from "../../../models/message.model.js";
import verifyParticipant from "../../../utils/verifyConversationParticipant.js";

export function registerPinMessage(io, socket) {
  async function validateAndGetConversation(
    messageId,
    conversationId,
    senderId,
  ) {
    if (!messageId || !conversationId) {
      return {
        error: {
          success: false,
          message: "Message ID and Conversation ID are required",
        },
      };
    }

    const message = await Message.findOne({
      _id: messageId,
      conversationId,
    });

    if (!message) {
      return {
        error: {
          success: false,
          message: "Message not found",
        },
      };
    }

    const con = await Conversation.findById(conversationId);

    if (!con) {
      return {
        error: {
          success: false,
          message: "Conversation not found",
        },
      };
    }

    const isParticipant = verifyParticipant(con, senderId);

    if (!isParticipant) {
      return {
        error: {
          success: false,
          message: "You are not the participant of the conversation",
        },
      };
    }

    return {
      error: null,
      con,
      message,
    };
  }

  socket.on("pin_message", async (data, callback) => {
    try {
      const { messageId, conversationId } = data;
      const senderId = socket.user.userId;

      const { error, con, message } = await validateAndGetConversation(
        messageId,
        conversationId,
        senderId,
      );
      if (error) return callback?.(error);

      if (con.pinnedMessages.length >= 5) {
        return callback?.({
          success: false,
          message: "You can pin up to 5 messages in a conversation",
        });
      }

      const isPinned = con.pinnedMessages.some(
        (item) => item.message.toString() === messageId.toString(),
      );

      if (isPinned) {
        return callback?.({
          success: false,
          message: "Message already pinned",
        });
      }

      con.pinnedMessages.push({
        message: messageId,
        pinnedBy: senderId,
      });
      await con.save();

      await con.populate("pinnedMessages.pinnedBy", "username");

      const pinnedMessage = con.pinnedMessages.at(-1);

      io.to(`conversation:${con._id}`).emit("pin_message", {
        conversationId: con._id,
        pinnedMessage: {
          _id: pinnedMessage._id,
          message: {
            _id: message._id,
            text: message.text,
          },
          pinnedBy: {
            _id: pinnedMessage.pinnedBy._id,
            username: pinnedMessage.pinnedBy.username,
          },
        },
      });

      return callback?.({
        success: true,
        message: "Message pinned successfully",
        conversationId: con._id,
        pinnedMessage: {
          _id: pinnedMessage._id,
          message: {
            _id: message._id,
            text: message.text,
          },
          pinnedBy: {
            _id: pinnedMessage.pinnedBy._id,
            username: pinnedMessage.pinnedBy.username,
          },
        },
      });
    } catch (error) {
      console.error(error);
      callback?.({
        success: false,
        message: "Failed to pin message",
      });
    }
  });

  socket.on("unpin_message", async (data, callback) => {
    try {
      const { messageId, conversationId } = data;
      const senderId = socket.user.userId;

      const { error, con } = await validateAndGetConversation(
        messageId,
        conversationId,
        senderId,
      );
      if (error) return callback?.(error);

      const index = con.pinnedMessages.findIndex(
        (pin) => pin.message.toString() === messageId.toString(),
      );

      if (index === -1) {
        return callback?.({
          success: false,
          message: "Pin the message first",
        });
      }

      con.pinnedMessages.splice(index, 1);
      await con.save();

      io.to(`conversation:${con._id}`).emit("unpin_message", {
        conversationId: con._id,
        messageId,
        pinnedMessages: con.pinnedMessages,
      });

      return callback?.({
        success: true,
        message: "Message unpinned successfully",
        messageId,
        pinnedMessages: con.pinnedMessages,
      });
    } catch (error) {
      console.error(error);
      callback?.({
        success: false,
        message: "Failed to unpin message",
      });
    }
  });
}

// Update delete logic for pin messages.
