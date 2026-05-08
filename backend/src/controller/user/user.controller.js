import User from "../../models/user.model.js";
import Relationship from "../../models/relationship.model.js";
import makeKey from "../../utils/makeKey.js";

// Helper functions
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Controllers functions

async function searchController(req, res) {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    if (q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Query length must be at least 2 characters",
      });
    }

    const escapedQuery = escapeRegex(q);
    const query = {
      username: {
        $regex: escapedQuery,
        $options: "i",
      },
    };

    if (req.user?.username) {
      query.username.$ne = req.user.username;
    }

    const findUsers = await User.find(query).limit(20).sort({ username: 1 });

    // Get relationship statuses
    const currentUserId = req.user.id;
    const searchedUserIds = findUsers.map((user) => user._id);

    const relationships = await Relationship.find({
      $or: [
        { user1: currentUserId, user2: { $in: searchedUserIds } },
        { user1: { $in: searchedUserIds }, user2: currentUserId },
      ],
    });

    // Map relationships by the other user's ID
    const relationshipMap = {};
    relationships.forEach((rel) => {
      const otherUserId =
        rel.user1.toString() === currentUserId
          ? rel.user2.toString()
          : rel.user1.toString();
      relationshipMap[otherUserId] = rel;
    });

    // Add relationship status to each user
    const usersWithStatus = findUsers.map((user) => {
      const userIdStr = user._id.toString();
      const rel = relationshipMap[userIdStr];

      let status = "none";
      let requestId = null;
      if (rel) {
        if (rel.status === "friends") {
          status = "friends";
        } else if (rel.status === "blocked") {
          status = "blocked";
        } else if (rel.status === "pending") {
          requestId = rel._id;
          if (rel.requestedBy.toString() === currentUserId) {
            status = "outgoing";
          } else {
            status = "incoming";
          }
        }
      }

      return {
        ...user.toObject(),
        relationshipStatus: status,
        requestId: requestId,
      };
    });

    return res.json({
      success: true,
      users: usersWithStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export { searchController };
