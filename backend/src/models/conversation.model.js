import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // Basic fields
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

    // Messages related fields
    lastMessageText: { type: String },

    lastMessageAt: { type: Date },

    pinnedMessages: [
      {
        message: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
          required: true,
        },
        pinnedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  participants: 1,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
