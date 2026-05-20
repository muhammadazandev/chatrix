import Settings from "../../models/settings.model.js";

const allowedFields = ["theme", "accentColor", "isAnimations", "transition"];

async function updateSettingController(req, res) {
  try {
    const userId = req.user.id;
    const body = req.body;

    if (!body) {
      return res
        .status(400)
        .json({ success: false, message: "No new setting available" });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updates = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid setting provided",
      });
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      { userId },
      updates,
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Setting updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function getSettingController(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const settings = await Settings.findOne({ userId });

    return res.status(200).json({
      success: true,
      message: "Settings",
      setting: settings,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export { updateSettingController, getSettingController };
