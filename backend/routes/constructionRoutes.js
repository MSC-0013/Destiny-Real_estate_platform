const express = require("express");
const router = express.Router();
const controller = require("../controllers/constructionController");

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

module.exports = router;
