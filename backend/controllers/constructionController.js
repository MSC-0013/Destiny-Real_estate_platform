import ConstructionProject from "../models/ConstructionProject.js";
import RepairRequest from "../models/RepairRequest.js";

// -------------------- Construction --------------------
export const getProjects = async (req, res) => {
  try {
    const projects = await ConstructionProject.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addProject = async (req, res) => {
  try {
    const project = new ConstructionProject(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await ConstructionProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await ConstructionProject.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const request = new RepairRequest(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveRepairRequest = async (req, res) => {
  try {
    const request = await RepairRequest.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectRepairRequest = async (req, res) => {
  try {
    const request = await RepairRequest.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
