import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "friends", "blocked"],
      default: "pending",
    },

    key: {
      type: String,
      unique: true,
      required: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    blockedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

relationshipSchema.index({ user1: 1 });
relationshipSchema.index({ user2: 1 });
relationshipSchema.index({ status: 1 });

const Relationship = mongoose.model("Relationship", relationshipSchema);

export default Relationship;
