import mongoose from "mongoose";
import Conversation from "../../models/conversation.model.js";
import { onlineUsers } from "../socket.store.js";
import User from "../../models/user.model.js";

function validateRemovePermission({ participantRole, userRole }) {
  if (userRole === "admin" && participantRole === "admin") {
    return {
      success: false,
      message: "Admin cannot remove admin",
    };
  }

  if (participantRole === "owner") {
    return {
      success: false,
      message: "Nobody can remove owner",
    };
  }
}

async function processParticipants(groupId, userId, participants, action) {
  if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
    return {
      error: {
        success: false,
        message: "Invalid group ID",
      },
    };
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    return {
      error: {
        success: false,
        message: `Invalid ${action} participants`,
      },
    };
  }

  const group = await Conversation.findOne({
    _id: groupId,
    participants: userId,
    type: "group",
  });

  if (!group) {
    return {
      error: {
        success: false,
        message: `Group not found`,
      },
    };
  }

  const userRole = group.participantRoles.get(userId.toString());

  if (userRole !== "admin" && userRole !== "owner") {
    return {
      error: {
        success: false,
        message: `Only admins and owner can ${action} member`,
      },
    };
  }

  const existingParticipantsSet = new Set(
    group.participants.map((id) => id.toString()),
  );

  for (const participant of participants) {
    if (!mongoose.Types.ObjectId.isValid(participant)) {
      return {
        error: {
          success: false,
          message: `Invalid ${action} participant`,
        },
      };
    }

    if (participant.toString() === userId.toString()) continue; // Prevent to add/remove ourself

    if (
      action === "add" &&
      existingParticipantsSet.has(participant.toString())
    ) {
      continue; // Skip duplicates silently
    }

    if (action === "remove") {
      if (!existingParticipantsSet.has(participant.toString())) {
        continue;
      }

      const participantRole = group.participantRoles.get(
        participant.toString(),
      );

      const error = validateRemovePermission({
        participantRole,
        userRole,
      });

      if (error) {
        return { error };
      }

      existingParticipantsSet.delete(participant.toString());

      group.participants.pull(participant);
      group.participantRoles.delete(participant.toString());

      continue;
    }

    if (action === "add") {
      existingParticipantsSet.add(participant.toString());

      group.participants.push(participant);
      group.participantRoles.set(participant.toString(), "member");
    }
  }
  await group.save();

  const formattedParticipants = group.participants.map((participant) => {
    return {
      _id: participant.toString(),
      isOnline: onlineUsers.has(participant.toString()),
    };
  });

  let newlyAddedProfiles = [];

  if (action === "add") {
    newlyAddedProfiles = await User.find(
      { _id: { $in: participants } },
      "username profilePicture bio",
    ).lean();

    newlyAddedProfiles = newlyAddedProfiles.map((user) => ({
      _id: user._id.toString(),
      username: user.username,
      profilePicture: user.profilePicture || "",
      bio: user.bio || "",
      isOnline: onlineUsers.has(user._id.toString()),
      role: "member",
    }));
  }

  return { group, formattedParticipants, newlyAdded: newlyAddedProfiles };
}

export default processParticipants;
