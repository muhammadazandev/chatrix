import mongoose from "mongoose";
import Conversation from "../../models/conversation.model.js";
import Relationship from "../../models/relationship.model.js";
import verifyParticipant from "../../utils/verifyConversationParticipant.js";
import User from "../../models/user.model.js";
import { onlineUsers } from "../../socket/socket.store.js";

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

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });
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
    })
      .populate("participants", "username profilePicture bio")
      .sort({
        lastMessageAt: -1,
      });

    const formatted = conversations.map((con) => {
      const friend = con.participants.find((p) => p._id.toString() !== userId);

      const isDirect = con.type === "direct";

      return {
        _id: con._id,
        type: con.type,
        lastMessageText: con.lastMessageText,
        lastMessageAt: con.lastMessageAt,

        friendId: isDirect ? friend._id : null,

        title: isDirect ? friend.username : con.name,
        avatar: isDirect ? friend.profilePicture : con.avatar,

        membersCount: isDirect ? null : con.participants.length,
      };
    });

    return res.status(200).json({
      success: true,
      conversations: formatted,
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
      return res.status(400).json({
        success: false,
        message: "Conversation ID are required",
      });
    }

    const conversation = await Conversation.findById(conversationId)
      .populate("pinnedMessages.pinnedBy", "username")
      .populate("pinnedMessages.message", "text");

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

    let currentConversationData = {};

    if (conversation.type === "direct") {
      const friendId = conversation.participants.find(
        (f) => f._id.toString() !== userId.toString(),
      );

      const friend = await User.findById(friendId).select(
        "username profilePicture bio",
      );

      const relationship = await Relationship.findOne({
        $or: [
          { user1: userId, user2: friend._id },
          { user1: friend._id, user2: userId },
        ],
      });

      const relationshipStatus = relationship?.status ?? null;

      const isOnline =
        relationship?.status !== "blocked" &&
        onlineUsers.has(friend._id.toString());

      currentConversationData = {
        _id: conversation._id,
        type: conversation.type,
        pinnedMessages: conversation.pinnedMessages,
        friendId: friend._id,
        name: friend.username,
        avatar: friend.profilePicture,
        bio: friend.bio,
        isOnline: isOnline,
        relationshipStatus,
      };
    } else {
      const participantsWithOnlineStatus = conversation.participants.map(
        (part) => {
          const status = onlineUsers.has(part.toString());
          return {
            _id: part,
            isOnline: status,
          };
        },
      );

      currentConversationData = {
        _id: conversation._id,
        type: conversation.type,
        pinnedMessages: conversation.pinnedMessages,
        name: conversation.name,
        avatar: conversation.avatar,
        participants: participantsWithOnlineStatus,
        participantRoles: conversation.participantRoles,
      };
    }

    return res.status(200).json({
      success: true,
      message: "Verified",
      currentConversation: currentConversationData,
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
