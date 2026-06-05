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

    name: { type: String },

    avatar: { type: String },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

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

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
