import User from "../../models/user.model.js";

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

    return res.json({
      success: true,
      users: findUsers,
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
