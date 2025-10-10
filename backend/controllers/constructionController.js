import ConstructionProject from "../models/ConstructionProject.js";
import RepairRequest from "../models/RepairRequest.js";
import ConstructionRequest from "../models/ConstructionRequest.js";

// -------------------- Construction --------------------
export const getProjects = async (req, res) => {
  try {
    const projects = await ConstructionProject.find().sort({
      createdAt: -1
    });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const addProject = async (req, res) => {
  try {
    const project = new ConstructionProject(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await ConstructionProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await ConstructionProject.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Project deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// -------------------- Repair Requests --------------------
export const getRepairRequests = async (req, res) => {
  try {
    const requests = await RepairRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addRepairRequest = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      attachments: Array.isArray(req.body.attachments) ? req.body.attachments : [],
      urgency: req.body.urgency || "medium",
      status: req.body.status || "pending",
    };
    const request = new RepairRequest(payload);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveRepairRequest = async (req, res) => {
  try {
    const request = await RepairRequest.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectRepairRequest = async (req, res) => {
  try {
    const request = await RepairRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Construction Requests --------------------
export const getConstructionRequests = async (req, res) => {
  try {
    const requests = await ConstructionRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addConstructionRequest = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
      designImages: Array.isArray(req.body.designImages) ? req.body.designImages : [],
      status: req.body.status || "pending",
    };
    const request = new ConstructionRequest(payload);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveConstructionRequest = async (req, res) => {
  try {
    const request = await ConstructionRequest.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectConstructionRequest = async (req, res) => {
  try {
    const request = await ConstructionRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a project from a construction request
export const createProjectFromConstructionRequest = async (req, res) => {
  try {
    const request = await ConstructionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    const project = new ConstructionProject({
      title: `${request.projectType} for ${request.clientName}`,
      description: request.description || "",
      clientId: request.userId || "",
      clientName: request.clientName,
      location: request.location,
      address: "",
      projectType: ["residential", "commercial", "renovation", "interior"].includes(
        (request.projectType || "").toLowerCase()
      )
        ? request.projectType.toLowerCase()
        : "residential",
      status: "in-progress",
      phase: "planning",
      estimatedCost: 0,
      tasks: [],
      materials: [],
      payments: [],
      requests: [],
      adminId: req.user?.id || "",
    });

    await project.save();

    request.projectId = project._id;
    request.status = "approved";
    await request.save();

    res.status(201).json({ project, request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};