import Relationship from "../models/relationship.model.js";

async function isBlocked(user1, user2) {
  const isBlocked = await Relationship.findOne({
    status: "blocked",
    $or: [
      { user1, user2 },
      { user1: user2, user2: user1 },
    ],
  });

  return isBlocked;
}

export default isBlocked;
