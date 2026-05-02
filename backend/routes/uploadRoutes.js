const express = require("express");
const multer  = require("multer");
const path    = require("path");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    ["image/jpeg","image/jpg","image/png","image/webp"].includes(file.mimetype)
      ? cb(null, true) : cb(new Error("Only JPG/PNG/WEBP allowed"));
  },
});

router.post("/image", protect, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

module.exports = router;
