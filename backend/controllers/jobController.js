import mongoose from "mongoose";
import JobApplication from "../models/JobApplication.js";

// -------------------- Helpers --------------------
const convertDates = (obj) => {
  if (!obj) return obj;
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    const value = newObj[key];
    if (value && typeof value === "string" && !isNaN(Date.parse(value))) {
      newObj[key] = new Date(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      newObj[key] = convertDates(value);
    } else if (Array.isArray(value)) {
      newObj[key] = value.map((item) => (typeof item === "object" ? convertDates(item) : item));
    }
  });
  return newObj;
};

// -------------------- CRUD Controllers --------------------

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

// Apply for job
export const applyJob = async (req, res) => {
  try {
    const {
      role,
      type,
      applicantId,
      applicantName,
      workerDetails,
      contractorDetails,
      designerDetails,
      title,
      description,
      assignedProjectId,
    } = req.body;

    if (!role || !type || !applicantId || !applicantName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const jobData = {
      role,
      type,
      applicantId: new mongoose.Types.ObjectId(applicantId),
      applicantName,
      workerDetails: convertDates(workerDetails),
      contractorDetails: convertDates(contractorDetails),
      designerDetails: convertDates(designerDetails),
      title,
      description,
      assignedProjectId: assignedProjectId ? new mongoose.Types.ObjectId(assignedProjectId) : null,
    };

    const newJob = new JobApplication(jobData);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error("Error applying job:", err);
    res.status(500).json({ error: "Failed to apply for job", details: err.message });
  }
};

// Approve job
export const approveJob = async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve job" });
  }
};

// Reject job
export const rejectJob = async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject job" });
  }
};

// Assign job
export const assignJob = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: "Project ID required" });

    const job = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { assignedProjectId: new mongoose.Types.ObjectId(projectId), status: "assigned" },
      { new: true }
    );

    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign job" });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true, message: "Job deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete job" });
  }
};
