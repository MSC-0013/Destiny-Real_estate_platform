import express from "express";
import User from "../models/User.js"; // your User model
import upload from "../utils/multer.js"; // multer config

const router = express.Router();

// Update user profile (with optional file upload)
router.put("/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      // Multer already uploads to Cloudinary or local storage
      // req.file.path contains the file URL or path
      updateData.profileImage = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error("Failed to update user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
