import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";
import isBlocked from "../../utils/isBlocked.js";

async function validateConversationParticipant(conversationId, senderId) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: senderId,
  });

  if (!conversation) {
    return {
      errValidate: {
        success: false,
        message: "No conversation found",
      },
      status: 404,
    };
  }

  if (conversation.type === "direct") {
    const [user1, user2] = conversation.participants;

    const isBlock = await isBlocked(user1, user2);

    if (isBlock) {
      return {
        errValidate: {
          success: false,
          message:
            "Cannot send messages in a conversation with a blocked user.",
        },
        status: 400,
      };
    }
  }

  return { conversation };
}

async function createAndPopulateMessage(
  message,
  atDate,
  senderId,
  isForwarding,
) {
  const isMedia = message.messageType !== "text";

  const data = {
    conversationId: message.conversationId,
    senderId,
    text: message.text?.trim() || "",
    replyTo: !isForwarding ? message.replyTo : null,
    isForwarded: !!isForwarding,
  };

  if (isMedia) {
    data.messageType = message.messageType;
    data.media = {
      url: message.url,
      publicId: message.publicId,
      mimeType: message.mime,
      originalName: message.originalName,
      size: message.size,
    };
  }

  const newMessage = await Message.create(data);

  await Conversation.updateOne(
    { _id: message.conversationId },
    {
      lastMessageText: isMedia ? message.lastMessageText : message.text,
      lastMessageAt: atDate,
    },
  );

  const populatedMessage = await Message.findById(newMessage._id)
    .populate("senderId", "username profilePicture")
    .populate({
      path: "replyTo",
      select: "text messageType senderId",
      populate: {
        path: "senderId",
        select: "username profilePicture",
      },
    });

  const messageDoc = populatedMessage.toObject();

  return { messageDoc, newMessage };
}

function formatMessage(messageDoc, conversationType) {
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
    conversationType,
    senderId: messageDoc.senderId._id,
    sender: {
      _id: messageDoc.senderId._id,
      username: messageDoc.senderId.username,
      profilePicture: messageDoc.senderId.profilePicture,
    },
    replyTo: formattedReplyTo,
  };

  return messageToSend;
}

function broadcastMessage(
  io,
  conversationId,
  messageToSend,
  conversation,
  newMessage,
  atDate,
  lastMessageText,
) {
  const text = newMessage.text?.trim() || "";

  io.to(`conversation:${conversationId}`).emit("new_message", {
    message: messageToSend,
    conversationId,
  });

  conversation.participants.forEach((id) => {
    io.to(`user:${id}`).emit("conversation_updated", {
      conversationId,
      lastMessageText: lastMessageText ?? text,
      lastMessageAt: atDate,
    });
  });
}

export {
  validateConversationParticipant,
  createAndPopulateMessage,
  formatMessage,
  broadcastMessage,
};
