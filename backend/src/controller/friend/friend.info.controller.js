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

    const friends = await Relationship.find({
      status: "friends",
      $or: [{ user1: userId }, { user2: userId }],
    });

    return res.status(200).json({
      success: true,
      message: "All friends",
      friends: friends,
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
    });

    return res.status(200).json({
      success: true,
      message: "Pending requests",
      requests: requests,
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

export { getAllFriends, getAllPendingRequests, checkRelationship };
