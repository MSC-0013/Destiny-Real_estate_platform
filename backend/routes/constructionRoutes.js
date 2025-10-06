import express from "express";
import * as controller from "../controllers/constructionController.js";

const router = express.Router();

// Construction Projects
router.get("/projects", controller.getProjects);
router.get("/projects/:id", controller.getProjectById);
router.post("/projects", controller.addProject);
router.put("/projects/:id", controller.updateProject);
router.delete("/projects/:id", controller.deleteProject);

// Repair Requests
router.get("/repairs", controller.getRepairRequests);
router.post("/repairs", controller.addRepairRequest);
router.put("/repairs/:id", controller.updateRepairRequest);
router.delete("/repairs/:id", controller.deleteRepairRequest);

export default router;
