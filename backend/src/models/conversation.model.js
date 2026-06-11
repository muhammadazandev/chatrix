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

    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dbzdwitoa/image/upload/q_auto/f_auto/v1778327421/contact-dark-mode-glyph-ui-icon-address-book-profile-page-user-interface-design-white-silhouette-symbol-on-black-space-solid-pictogram-for-web-mobile-isolated-illustration-vector_sjfa4p.jpg",
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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
