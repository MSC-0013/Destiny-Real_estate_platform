const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  applyJob,
  approveJob,
  rejectJob,
  assignJob,
  deleteJob
} = require("../controllers/jobController");

// CRUD
router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", applyJob);
router.put("/:id/approve", approveJob);
router.put("/:id/reject", rejectJob);
router.put("/:id/assign", assignJob);
router.delete("/:id", deleteJob);

module.exports = router;
