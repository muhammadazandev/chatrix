import { getIo } from "../../socket/socket.instance.js";

async function updateProfilePicture(req, res) {
  try {
    const group = req.group;

    group.avatar = req.file.path;
    await group.save();

    const ioInstance = getIo();

    ioInstance
      .to(`conversation:${group._id}`)
      .emit("group_updated", {
        avatar: group.avatar,
        groupId: group._id,
      });

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      avatar: group.avatar,
      groupId: group._id,
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
