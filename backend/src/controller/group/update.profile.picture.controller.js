import { getIo } from "../../socket/socket.instance.js";
import Message from "../../models/message.model.js"

async function updateProfilePicture(req, res) {
  try {
    const group = req.group;
    const userId = req.user.id;

    group.avatar = req.file.path;
    await group.save();

    const systemMessage = await Message.create({
      conversationId: group._id,
      messageType: "system",
      systemAction: "group_photo_changed",
      metadata: {
        actor: userId,
      },
    });

    await systemMessage.populate([
      { path: "metadata.actor", select: "username" },
    ]);

    const ioInstance = getIo();

    ioInstance.to(`conversation:${group._id}`).emit("group_updated", {
      avatar: group.avatar,
      groupId: group._id,
      systemMessage
    });

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      avatar: group.avatar,
      groupId: group._id,
      systemMessage
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export { updateProfilePicture };
