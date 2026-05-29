import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct"],
      default: "direct",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastMessageText: {
      type: String,
    },

    lastMessageAt: Date,
  },
  {
    timestamps: true,
  },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
