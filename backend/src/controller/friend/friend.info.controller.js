import mongoose from "mongoose";
import Relationship from "../../models/relationship.model.js";
import makeKey from "../../utils/makeKey.js";

async function getAllFriends(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const relationships = await Relationship.find({
      status: "friends",
      $or: [{ user1: userId }, { user2: userId }],
    })
      .populate("user1", "username profilePicture bio")
      .populate("user2", "username profilePicture bio");

    const friends = relationships.map((rel) => {
      const friend =
        rel.user1._id.toString() === userId.toString() ? rel.user2 : rel.user1;

      return friend;
    });

    return res.status(200).json({
      success: true,
      message: "All friends",
      friends,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAllPendingRequests(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requests = await Relationship.find({
      status: "pending",
      $or: [{ user1: userId }, { user2: userId }],
    })
      .populate("user1", "username profilePicture bio")
      .populate("user2", "username profilePicture bio");

    let sentRequests = [];
    let receivedRequests = [];

    for (const request of requests) {
      const otherUser =
        request.user1._id.toString() === userId.toString()
          ? request.user2
          : request.user1;

      const formattedRequest = {
        _id: request._id,
        user1: otherUser,
        status: request.status,
        createdAt: request.createdAt,
      };

      if (request.requestedBy.toString() === userId.toString()) {
        sentRequests.push(formattedRequest);
      } else {
        receivedRequests.push(formattedRequest);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Pending requests",
      data: {
        sent: sentRequests,
        received: receivedRequests,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function checkRelationship(req, res) {
  try {
    const userId = req.user.id;
    const checkUserId = req.params.userId;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(checkUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (userId === checkUserId) {
      return res.status(409).json({
        success: false,
        message: "Cannot check relationship with yourself",
      });
    }

    const check = await Relationship.findOne({
      key: makeKey(userId, checkUserId),
    });

    if (!check) {
      return res.status(200).json({
        success: true,
        relation: "none",
      });
    }

    let relation;

    if (check.status === "pending") {
      relation =
        check.requestedBy.toString() === userId
          ? "pending_sent"
          : "pending_received";
    } else {
      relation = check.status;
    }

    return res.status(200).json({
      success: true,
      relation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAllBlockedUsers(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const blockedRelationships = await Relationship.find({
      status: "blocked",
      blockedBy: userId,
    })
      .populate("user1", "username profilePicture bio")
      .populate("user2", "username profilePicture bio");

    const blockedUsers = blockedRelationships.map((relationship) => {
      const blockedUser =
        relationship.user1._id.toString() === userId.toString()
          ? relationship.user2
          : relationship.user1;

      return {
        id: relationship._id,
        user: blockedUser,
        blockedAt: relationship.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Blocked users fetched successfully",
      data: blockedUsers,
    });
  } catch (error) {
    console.error("Get blocked users error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export {
  getAllFriends,
  getAllPendingRequests,
  checkRelationship,
  getAllBlockedUsers,
};
