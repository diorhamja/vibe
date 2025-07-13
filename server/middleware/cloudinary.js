const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile-pictures",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const eventStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "event-images",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = {
  cloudinary,
  profileUpload: multer({ storage: profileStorage }),
  eventUpload: multer({ storage: eventStorage }),
};
