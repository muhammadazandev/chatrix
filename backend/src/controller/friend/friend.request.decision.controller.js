import mongoose from "mongoose";
import Relationship from "../../models/relationship.model.js";

// Helper functions

async function resolveFriendRequest(action, requestId, currentUserId) {
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Invalid request ID",
      },
    };
  }

  if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Invalid user ID",
      },
    };
  }

  const request = await Relationship.findById(requestId);

  if (!request) {
    return {
      status: 404,
      body: {
        success: false,
        message: "Relationship not found",
      },
    };
  }

  const isParticipant =
    request.user1.toString() === currentUserId ||
    request.user2.toString() === currentUserId;

  if (!isParticipant) {
    return {
      status: 403,
      body: {
        success: false,
        message: `Unauthorized to ${action} this request`,
      },
    };
  }

  // Only pending requests can be cancelled/rejected
  if (request.status !== "pending") {
    return {
      status: 409,
      body: {
        success: false,
        message: "Request is not pending anymore",
      },
    };
  }

  const requesterId = request.requestedBy?.toString();

  if (action === "cancel" && requesterId !== currentUserId) {
    return {
      status: 403,
      body: {
        success: false,
        message: "Only sender can cancel request",
      },
    };
  }

  if (action === "reject" && requesterId === currentUserId) {
    return {
      status: 403,
      body: {
        success: false,
        message: "You cannot reject your own request",
      },
    };
  }

  await Relationship.deleteOne({ _id: requestId });

  return true;
}

async function unfriendUser(userId, targetUserId) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(targetUserId)
  ) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Invalid user ID",
      },
    };
  }

  const relationship = await Relationship.findOne({
    $or: [
      { user1: userId, user2: targetUserId },
      { user1: targetUserId, user2: userId },
    ],
  });

  if (!relationship) {
    return {
      status: 404,
      body: {
        success: false,
        message: "No relationship found",
      },
    };
  }

  if (relationship.status !== "friends") {
    return {
      status: 409,
      body: {
        success: false,
        message: "Users are not friends",
      },
    };
  }

  await Relationship.deleteOne({ _id: relationship._id });

  return true;
}

// Main controllers

async function rejectFriendRequest(req, res) {
  try {
    const result = await resolveFriendRequest(
      "reject",
      req.params.requestId,
      req.user.id,
    );

    if (result !== true) {
      return res.status(result.status).json(result.body);
    }

    return res.status(200).json({
      success: true,
      message: "Friend request rejected successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function cancelFriendRequest(req, res) {
  try {
    const result = await resolveFriendRequest(
      "cancel",
      req.params.requestId,
      req.user.id,
    );

    if (result !== true) {
      return res.status(result.status).json(result.body);
    }

    return res.status(200).json({
      success: true,
      message: "Friend request canceled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function unfriend(req, res) {
  try {
    const result = await unfriendUser(req.user.id, req.params.userId);

    if (result !== true) {
      return res.status(result.status).json(result.body);
    }

    return res.status(200).json({
      success: true,
      message: "Unfriended successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { rejectFriendRequest, cancelFriendRequest, unfriend };
