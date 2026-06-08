import mongoose from "mongoose";
import User from "../../models/user.model.js";
import Relationship from "../../models/relationship.model.js";

export async function getUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const targetUserId = req.params.userId;

    // Validation
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Target user id is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target user ID",
      });
    }

    // User info e.g. username, bio
    const userInfo = await User.findById(targetUserId)
      .select("username profilePicture bio")
      .lean();

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // All friends
    const friendsCount = await Relationship.countDocuments({
      status: "friends",
      $or: [{ user1: targetUserId }, { user2: targetUserId }],
    });

    userInfo.friendsCount = friendsCount;

    // Relationship between user and target user
    const relationship = await Relationship.findOne({
      $or: [
        {
          user1: userId,
          user2: targetUserId,
        },
        {
          user1: targetUserId,
          user2: userId,
        },
      ],
    }).lean();

    let relationshipStatus = "none";

    if (relationship) {
      if (relationship.status === "pending") {
        if (relationship.requestedBy.toString() === userId.toString()) {
          relationshipStatus = "outgoing";
        } else {
          relationshipStatus = "incoming";
        }

        userInfo.requestId = relationship._id;
      } else {
        relationshipStatus = relationship.status;
      }
    }

    userInfo.relationshipStatus = relationshipStatus;

    return res.status(200).json({ success: true, user: userInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}
