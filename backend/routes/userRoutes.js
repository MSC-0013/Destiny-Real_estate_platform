import express from "express";
import upload from "../utils/multer.js";
import { signup, login, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// Update JSON only
router.put("/:id", updateUser);

// Update profile image
router.put("/:id/image", upload.single("profileImage"), updateUser);

router.delete("/:id", deleteUser);

export default router;
