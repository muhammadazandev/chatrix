import mongoose from "mongoose";
import { getIo } from "../../socket/socket.instance.js";
import {
  broadcastMessage,
  createAndPopulateMessage,
  formatMessage,
  validateConversationParticipant,
} from "../../socket/helpers/new.message.helpers.js";

async function mediaMessage(req, res) {
  try {
    // const { message } = req.body || {};
    const userId = req.user.id;

    const message =
      typeof req.body.message === "string"
        ? JSON.parse(req.body.message)
        : req.body.message;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "No message data present",
      });
    }

    if (
      !message.conversationId ||
      !mongoose.Types.ObjectId.isValid(message.conversationId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Conversation ID",
      });
    }

    const { conversation, errValidate, status } =
      await validateConversationParticipant(message.conversationId, userId);

    if (errValidate && status) return res.status(status).json(errValidate);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file added",
      });
    }

    const mime = req.file.mimetype;

    let messageType = "file";

    if (mime.startsWith("image/")) {
      messageType = "image";
    } else if (mime.startsWith("video/")) {
      messageType = "video";
    } else if (mime.startsWith("audio/")) {
      messageType = "audio";
    }

    const lastMessageText =
      messageType === "image"
        ? "📷 Photo"
        : messageType === "video"
          ? "🎥 Video"
          : messageType === "audio"
            ? "🎵 Audio"
            : "📄 File";
    const atDate = Date.now();

    const messageData = {
      ...message,
      messageType,
      mime,
      lastMessageText,
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    };

    const { messageDoc, newMessage } = await createAndPopulateMessage(
      messageData,
      atDate,
      userId,
      false,
      true,
    );

    const messageToSend = formatMessage(messageDoc, conversation.type);

    const ioInstance = getIo();

    broadcastMessage(
      ioInstance,
      conversation._id,
      messageToSend,
      conversation,
      newMessage,
      atDate,
      lastMessageText,
    );

    return res.status(201).json({
      success: true,
      message: messageToSend,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export { mediaMessage };
