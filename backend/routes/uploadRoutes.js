// backend/routes/uploadRoutes.js
import express from "express";
import upload from "../utils/multer.js"; // ✅ make sure this path points to your multer config file

const router = express.Router();

// ✅ Cloudinary Upload Route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: req.file.path, // Cloudinary URL
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
