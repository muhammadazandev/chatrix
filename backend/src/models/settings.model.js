import mongoose from "mongoose";

const settingsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },

  theme: {
    type: String,
    enum: ["light", "dark", "system"],
    default: "system",
  },

  accentColor: {
    type: String,
    default: "#1073ef",
  },

  isAnimations: {
    type: Boolean,
    default: true,
  },

  transition: {
    type: String,
    enum: ["subtle", "smooth", "energetic"],
    default: "smooth",
  },
});

const Settings = mongoose.model("settings", settingsSchema);

export default Settings;
