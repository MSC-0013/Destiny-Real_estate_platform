import express from "express";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getRepairRequests,
  addRepairRequest,
  approveRepairRequest,
  rejectRepairRequest
} from "../controllers/constructionController.js";

const router = express.Router();

// Construction routes
router.get("/projects", getProjects);
router.post("/projects", addProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// Repair routes
router.get("/repairs", getRepairRequests);
router.post("/repairs", addRepairRequest);
router.put("/repairs/approve/:id", approveRepairRequest);
router.put("/repairs/reject/:id", rejectRepairRequest);

export default router;
