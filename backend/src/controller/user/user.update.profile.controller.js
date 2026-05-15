import User from "../../models/user.model.js";

async function updateUsernameController(req, res) {
  try {
    const userId = req.user.id;
    const { newUsername } = req?.body || {};

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!newUsername) {
      return res.status(404).json({
        success: false,
        message: "No new username present",
      });
    }

    if (newUsername.length > 25) {
      return res.status(400).json({
        success: false,
        message: "Username cannot exceed 25 characters",
      });
    }

    if (/[^a-zA-Z0-9_.]/.test(newUsername)) {
      return res.status(400).json({
        success: false,
        message: "Username only consist characters: a-z, A-Z, 0-9, _, and .",
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { username: newUsername },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user: {
        email: user.email,
        username: user.username,
        id: user._id,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

async function updateBioController(req, res) {
  try {
    const userId = req.user.id;

    const { newBio } = req?.body || {};

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!newBio) {
      return res.status(404).json({
        success: false,
        message: "No new bio present",
      });
    }

    if (newBio.length > 160) {
      return res
        .status(400)
        .json({ success: false, message: "Bio cannot exceed 160 characters" });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { bio: newBio },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Bio updated successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

async function updateProfilePictureController(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { profilePicture: req?.file.path },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export {
  updateUsernameController,
  updateBioController,
  updateProfilePictureController,
};
