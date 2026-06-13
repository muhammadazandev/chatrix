import Conversation from "../../models/conversation.model.js";
import mongoose from "mongoose";

async function createGroup(req, res) {
  try {
    const { membersIdString, name, avatar } = req.body || {};
    const membersId = JSON.parse(membersIdString);
    const userId = req.user.id;
    const finalMembers = [userId, ...membersId];

    // Validation
    if (!membersId || !name) {
      return res.status(422).json({
        status: false,
        message: "Insufficient data",
      });
    }

    const normalizedName = name.trim().toLowerCase();

    if (membersId && finalMembers.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Not enough members to create group",
      });
    }

    if (normalizedName.length > 50 || normalizedName.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Group name must be 50 characters or less than 3",
      });
    }

    for (const id of membersId) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid member ID",
        });
      }
    }

    let avatarUrl = null;

    if (avatar === "default") {
      avatarUrl =
        "https://res.cloudinary.com/dbzdwitoa/image/upload/q_auto/f_auto/v1778327421/contact-dark-mode-glyph-ui-icon-address-book-profile-page-user-interface-design-white-silhouette-symbol-on-black-space-solid-pictogram-for-web-mobile-isolated-illustration-vector_sjfa4p.jpg";
    } else if (req.file) {
      avatarUrl = req.file.path;
    }

    const existing = await Conversation.findOne({
      name: normalizedName,
      createdBy: userId,
    });
    if (existing) return res.status(409).json({ message: "Group exists" });

    const newConversation = await Conversation.create({
      type: "group",
      participants: finalMembers,
      name: normalizedName,
      avatar: avatarUrl,
      participantRoles: {
        [userId]: "owner",
      },
      createdBy: userId,
    });

    membersId
      .filter((id) => id !== userId)
      .forEach((id) => newConversation.participantRoles.set(id, "member"));

    await newConversation.save();

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: newConversation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export { createGroup };
