import mongoose from "mongoose";
import User from "../../models/user.model.js";
import Relationship from "../../models/relationship.model.js";

/*
 Helper functions
*/

function validateId(requestId, userId) {
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return {
      status: 400,
      body: { success: false, message: "Invalid request ID" },
    };
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      status: 400,
      body: { success: false, message: "Invalid user ID" },
    };
  }

  return true;
}

/*
 Main controller
*/

async function acceptFriendRequest(req, res) {
  try {
    const requestId = req.params.requestId;
    const userId = req.user.id;

    const validationError = validateId(requestId, userId);

    if (validationError !== true) {
      return res.status(validationError.status).json(validationError.body);
    }

    // Fetch request
    const findRequest = await Relationship.findById(requestId).lean();

    if (!findRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Friend request not found" });
    }

    if (findRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already handled",
      });
    }

    // Verify sender exists
    const senderUser = await User.findById(findRequest.requestedBy);
    if (!senderUser) {
      return res.status(404).json({
        success: false,
        message: "Sender not found",
      });
    }

    // Update request to accepted
    findRequest.status = "friends";
    findRequest.requestedBy = null;
    findRequest.acceptedAt = Date.now();
    await findRequest.save();

    return res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export default acceptFriendRequest;
