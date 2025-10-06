import express from "express";
import {
  getJobs,
  getJobById,
  applyJob,
  approveJob,
  rejectJob,
  assignJob,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", applyJob);
router.put("/:id/approve", approveJob);
router.put("/:id/reject", rejectJob);
router.put("/:id/assign", assignJob);
router.delete("/:id", deleteJob);

export default router;
