import express from "express";
import {
  createInvestment,
  getInvestmentsByUser,
  deleteInvestment,
  getAllInvestorDetails,
} from "../controllers/investmentController.js";

const router = express.Router();

router.post("/", createInvestment);
router.get("/:userId", getInvestmentsByUser);
router.delete("/:id", deleteInvestment);

// ✅ Admin route for full investor overview
router.get("/all-details", getAllInvestorDetails);

export default router;
