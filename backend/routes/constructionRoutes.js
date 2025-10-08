// backend/routes/constructionRoutes.js
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

// --- Construction routes ---
router.get("/projects", getProjects);
router.post("/projects", addProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// --- Repair Requests routes (updated to match frontend URL) ---
router.get("/repair-requests", getRepairRequests);              // GET all repair requests
router.post("/repair-requests", addRepairRequest);             // POST new repair request
router.put("/repair-requests/approve/:id", approveRepairRequest);
router.put("/repair-requests/reject/:id", rejectRepairRequest);

export default router;
