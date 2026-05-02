import cloudinary from "../config/cloudinary.js";
const result = await cloudinary.uploader.upload(req.file.path);
const express    = require("express");
const multer     = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const protect    = require("../middleware/authMiddleware");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "dermai/uploads",
    allowed_formats: ["jpg","jpeg","png","webp"],
    transformation:  [{ width:1024, height:1024, crop:"limit", quality:"auto" }],
  },
});

const upload = multer({ storage, limits: { fileSize: 10*1024*1024 } });

const router = express.Router();

router.post("/image", protect, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  res.json({ imageUrl: req.file.path }); // Cloudinary URL
});

module.exports = router;