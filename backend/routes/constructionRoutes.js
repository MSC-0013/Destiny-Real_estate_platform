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
  rejectRepairRequest,
  getConstructionRequests,
  addConstructionRequest,
  approveConstructionRequest,
  rejectConstructionRequest,
  createProjectFromConstructionRequest
} from "../controllers/constructionController.js";

const router = express.Router();

// --- Construction routes ---
router.get("/projects", getProjects);
router.post("/projects", addProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// --- Repair Requests routes ---
router.get("/repair-requests", getRepairRequests);              // GET all repair requests
router.post("/repair-requests", addRepairRequest);             // POST new repair request
router.put("/repair-requests/approve/:id", approveRepairRequest);
router.put("/repair-requests/reject/:id", rejectRepairRequest);

// --- Construction Requests routes ---
router.get("/construction-requests", getConstructionRequests);
router.post("/construction-requests", addConstructionRequest);
router.put("/construction-requests/approve/:id", approveConstructionRequest);
router.put("/construction-requests/reject/:id", rejectConstructionRequest);
router.post("/construction-requests/:id/create-project", createProjectFromConstructionRequest);

export default router;
