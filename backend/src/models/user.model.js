import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Email is invalid",
      },
    },

    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },

    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dbzdwitoa/image/upload/q_auto/f_auto/v1778327421/contact-dark-mode-glyph-ui-icon-address-book-profile-page-user-interface-design-white-silhouette-symbol-on-black-space-solid-pictogram-for-web-mobile-isolated-illustration-vector_sjfa4p.jpg",
    },

    bio: {
      type: String,
      maxlength: [160, "Bio cannot exceed 160 characters"],
      trim: true,
      default: "Hey there! I'm using Chatrix.",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
