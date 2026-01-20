const multer = require("multer");

const storage = multer.memoryStorage(); // Cloudinary ke liye best

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
