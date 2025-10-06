import ConstructionProject from "../models/ConstructionProject.js";
import RepairRequest from "../models/RepairRequest.js";

// --------------------
// Projects
// --------------------
export const getProjects = async (req, res) => {
  const projects = await ConstructionProject.find();
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await ConstructionProject.findById(req.params.id);
  res.json(project);
};

export const addProject = async (req, res) => {
  const newProject = new ConstructionProject(req.body);
  await newProject.save();
  res.json(newProject);
};

export const updateProject = async (req, res) => {
  const project = await ConstructionProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  await ConstructionProject.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// --------------------
// Repair Requests
// --------------------
export const getRepairRequests = async (req, res) => {
  const requests = await RepairRequest.find();
  res.json(requests);
};

export const addRepairRequest = async (req, res) => {
  const newRequest = new RepairRequest(req.body);
  await newRequest.save();
  res.json(newRequest);
};

export const updateRepairRequest = async (req, res) => {
  const request = await RepairRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(request);
};

export const deleteRepairRequest = async (req, res) => {
  await RepairRequest.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
