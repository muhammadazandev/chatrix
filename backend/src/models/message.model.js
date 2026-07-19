import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "file", "system", "audio"],
      default: "text",
    },

    text: { type: String, default: "" },

    media: {
      url: String,
      thumbnailUrl: String,
      duration: Number,
      originalName: String,
      publicId: String,
      mimeType: String,
      size: Number,
    },

    isEdited: { type: Boolean, default: false },

    editedAt: { type: Date },

    isDeleted: { type: Boolean, default: false },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    isForwarded: { type: Boolean, default: false },

    // System Action messages info
    systemAction: {
      type: String,
      enum: [
        "member_added",
        "member_removed",
        "member_left",
        "member_promoted",
        "member_demoted",
        "group_renamed",
        "group_photo_changed",
      ],
    },

    metadata: {
      actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      targets: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      oldValue: String,
      newValue: String,
    },
  },
  { timestamps: true },
);

messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
