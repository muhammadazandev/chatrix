import mongoose from "mongoose";
import Relationship from "../../models/relationship.model.js";
import makeKey from "../../utils/makeKey.js";

const validateIds = (userId, targetId) => {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(targetId)
  ) {
    return { valid: false, message: "Invalid user ID" };
  }
  if (userId === targetId) {
    return { valid: false, message: "Cannot block/unblock yourself" };
  }
  return { valid: true };
};

async function block(req, res) {
  try {
    const { id: userId } = req.user;
    const { userId: blockingUserId } = req.params; // Fix param name

    const validation = validateIds(userId, blockingUserId);
    if (!validation.valid) {
      return res
        .status(409)
        .json({ success: false, message: validation.message });
    }

    const key = makeKey(userId, blockingUserId);
    const existing = await Relationship.findOne({ key }).lean();

    if (existing?.status === "blocked") {
      return res
        .status(409)
        .json({ success: false, message: "User already blocked" });
    }

    await Relationship.findOneAndUpdate(
      { key },
      {
        $setOnInsert: { user1: userId, user2: blockingUserId, key },
        $set: {
          status: "blocked",
          blockedBy: userId,
          blockedAt: new Date(),
          requestedBy: null,
          acceptedAt: null,
        },
      },
      { upsert: true, returnDocument: "after" },
    );

    return res
      .status(200)
      .json({ success: true, message: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function unblock(req, res) {
  try {
    const { id: userId } = req.user;
    const { userId: blockingUserId } = req.params; // Fix param name

    const validation = validateIds(userId, blockingUserId);
    if (!validation.valid) {
      return res
        .status(409)
        .json({ success: false, message: validation.message });
    }

    const key = makeKey(userId, blockingUserId);

    const deleted = await Relationship.findOneAndDelete({
      key,
      status: "blocked",
    });
    if (!deleted) {
      return res
        .status(409)
        .json({ success: false, message: "No block relationship found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User unblocked successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export { block, unblock };
