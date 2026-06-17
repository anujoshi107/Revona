import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const STORAGE_PARAMS = {
  folder: "images",
  allowed_formats: ["jpg", "png", "jpeg"],
  resource_type: "image",
  quality: "auto:good",
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    ...STORAGE_PARAMS,
  }),
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const isValid = /^image\/(jpe?g|png)$/.test(file.mimetype);

    if (!isValid) {
      return cb(new Error("Only JPG, JPEG, and PNG images are allowed"), false);
    }

    cb(null, true);
  },
});