import mongoose from "mongoose";
import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";
import verifyParticipant from "../../utils/verifyConversationParticipant.js";

async function getOldMessages(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const conversationId = req.params.conversationId;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = verifyParticipant(conversation, userId);

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const messages = await Message.find({
      conversationId,
    })
      .sort({
        createdAt: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export { getOldMessages };
