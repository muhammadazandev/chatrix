import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

const ALLOWED_MESSAGE_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",

  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",

  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",

  // Documents
  "application/pdf",

  "application/msword",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.ms-excel",

  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "application/vnd.ms-powerpoint",

  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  "text/plain",

  // Archives
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
];

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "messages",
    resource_type: "auto",
  },
});

const uploadMessage = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 1,
  },

  fileFilter(req, file, cb) {
    if (ALLOWED_MESSAGE_MIME_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Unsupported file type."));
  },
});

export default uploadMessage;
