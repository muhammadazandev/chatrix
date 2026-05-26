import Conversation from "../../models/conversation.model.js";
import Relationship from "../../models/relationship.model.js";
import verifyParticipant from "../../utils/verifyConversationParticipant.js";

async function accessConversationController(req, res) {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Target user ID is required",
      });
    }

    if (userId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot start a conversation with yourself.",
      });
    }

    const isFriends = await Relationship.findOne({
      status: "friends",

      $or: [
        { user1: userId, user2: targetUserId },
        { user1: targetUserId, user2: userId },
      ],
    });

    if (!isFriends) {
      return res.status(400).json({
        success: false,
        message: "Can only start conversation with friends",
      });
    }

    const ids = [userId, targetUserId];

    const isExist = await Conversation.findOne({
      type: "direct",
      participants: { $all: ids, $size: 2 },
    });

    if (!isExist) {
      const newConversation = await Conversation.create({
        type: "direct",
        participants: ids,
      });

      return res.status(201).json({
        success: true,
        message: "Conversation created successfully",
        conversation: newConversation,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation",
      conversation: isExist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

async function getConversations(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const conversations = await Conversation.find({
      participants: userId,
    }).sort({
      lastMessageAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "All Conversations",
      conversations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

async function verifyConversation(req, res) {
  try {
    const userId = req.user.id;
    const conversationId = req.params.conversationId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!conversationId) {
      return res.status(401).json({
        success: false,
        message: "Conversation ID are required",
      });
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
        message: "You are not the participant of this conversation",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verified",
      conversation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export { accessConversationController, getConversations, verifyConversation };
