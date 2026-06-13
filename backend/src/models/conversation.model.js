import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Group fields
    name: { type: String, maxLength: 50, trim: true, default: null },

    avatar: {
      type: String,
    },

    participantRoles: {
      type: Map,
      of: String,
      default: {},
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Last message fields
    lastMessageText: { type: String },

    lastMessageAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  participants: 1,
});
conversationSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
