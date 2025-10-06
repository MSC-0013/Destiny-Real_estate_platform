import express from "express";
import {
  applyJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  approveJob,
  rejectJob,
  assignJob,
} from "../controllers/jobController.js";

const router = express.Router();

// CRUD routes
router.post("/", applyJob);               // Apply job
router.get("/", getJobs);                 // Get all jobs
router.get("/:id", getJobById);           // Get single job
router.put("/:id", updateJob);            // Update job
router.delete("/:id", deleteJob);         // Delete job

// Status operations
router.put("/:id/approve", approveJob);   // Approve job
router.put("/:id/reject", rejectJob);     // Reject job
router.put("/:id/assign", assignJob);     // Assign job

export default router;
