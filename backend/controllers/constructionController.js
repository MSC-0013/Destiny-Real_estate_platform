const ConstructionProject = require("../models/ConstructionProject");
const RepairRequest = require("../models/RepairRequest");

// Projects
exports.getProjects = async (req, res) => {
  const projects = await ConstructionProject.find();
  res.json(projects);
};

exports.getProjectById = async (req, res) => {
  const project = await ConstructionProject.findById(req.params.id);
  res.json(project);
};

exports.addProject = async (req, res) => {
  const newProject = new ConstructionProject(req.body);
  await newProject.save();
  res.json(newProject);
};

exports.updateProject = async (req, res) => {
  const project = await ConstructionProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
};

exports.deleteProject = async (req, res) => {
  await ConstructionProject.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// Repair Requests
exports.getRepairRequests = async (req, res) => {
  const requests = await RepairRequest.find();
  res.json(requests);
};

exports.addRepairRequest = async (req, res) => {
  const newRequest = new RepairRequest(req.body);
  await newRequest.save();
  res.json(newRequest);
};

exports.updateRepairRequest = async (req, res) => {
  const request = await RepairRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(request);
};

exports.deleteRepairRequest = async (req, res) => {
  await RepairRequest.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
