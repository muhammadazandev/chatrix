import mongoose from "mongoose";
import User from "../../models/user.model.js";
import Relationship from "../../models/relationship.model.js";
import makeKey from "../../utils/makeKey.js";

/*
 Helper functions
*/

function validateId(senderId, receiverId) {
  if (!mongoose.Types.ObjectId.isValid(senderId)) {
    return {
      status: 400,
      body: { success: false, message: "Invalid sender ID" },
    };
  }
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return {
      status: 400,
      body: { success: false, message: "Invalid receiver ID" },
    };
  }
  if (senderId === receiverId) {
    return {
      status: 400,
      body: {
        success: false,
        message: "You cannot send a friend request to yourself",
      },
    };
  }
  return true;
}

async function resolveRelationStates(senderId, key) {
  const relation = await Relationship.findOne({ key });
  if (!relation) return true;

  if (relation.status === "friends") {
    return {
      status: 400,
      body: { success: false, message: "Already friends" },
    };
  }

  if (relation.status === "blocked") {
    const message =
      relation.blockedBy?.toString() === senderId
        ? "You blocked this user"
        : "You are blocked by this user";
    return {
      status: relation.blockedBy?.toString() === senderId ? 400 : 403,
      body: { success: false, message },
    };
  }

  if (relation.status === "pending") {
    if (relation.requestedBy?.toString() === senderId) {
      return {
        status: 400,
        body: { success: false, message: "Friend request already sent" },
      };
    }
    if (relation.requestedBy?.toString() !== senderId) {
      return {
        status: 200,
        body: {
          success: true,
          message:
            "The user has already sent you a request, do you want to accept it?",
        },
      };
    }
  }
  return true;
}

/*
 Main controller
*/

async function sendFriendRequest(req, res) {
  try {
    const { receiverId } = req.params;
    const { id: senderId } = req.user;

    // Validation
    const validationError = validateId(senderId, receiverId);
    if (validationError !== true)
      return res.status(validationError.status).json(validationError.body);

    const isReceiverExist = await User.exists({ _id: receiverId });
    if (!isReceiverExist) {
      return res
        .status(404)
        .json({ success: false, message: "Receiver not found" });
    }

    const key = makeKey(senderId, receiverId);

    const [user1, user2] = key
      .split("_")
      .map((id) => new mongoose.Types.ObjectId(id)); // Reuse key parsing

    const relationResult = await resolveRelationStates(senderId, key);
    if (relationResult !== true)
      return res.status(relationResult.status).json(relationResult.body);

    await Relationship.create({
      user1,
      user2,
      key,
      requestedBy: senderId,
      status: "pending",
    });

    return res
      .status(201)
      .json({ success: true, message: "Friend request sent successfully" });
  } catch (error) {
    const message =
      error.code === 11000
        ? "Friend request already sent"
        : "Internal server error";
    const status = error.code === 11000 ? 400 : 500;
    console.error(error);
    return res.status(status).json({ success: false, message });
  }
}

export default sendFriendRequest;
