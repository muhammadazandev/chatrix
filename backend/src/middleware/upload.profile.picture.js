import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "profile_picture",
    allowedFormats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadProfilePicture = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadProfilePicture;
