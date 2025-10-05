const JobApplication = require("../models/JobApplication");

// Get all jobs
exports.getJobs = async (req, res) => {
  const jobs = await JobApplication.find();
  res.json(jobs);
};

// Get job by ID
exports.getJobById = async (req, res) => {
  const job = await JobApplication.findById(req.params.id);
  res.json(job);
};

// Apply for a job
exports.applyJob = async (req, res) => {
  const newJob = new JobApplication(req.body);
  await newJob.save();
  res.json(newJob);
};

// Approve job
exports.approveJob = async (req, res) => {
  const job = await JobApplication.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json(job);
};

// Reject job
exports.rejectJob = async (req, res) => {
  const job = await JobApplication.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );
  res.json(job);
};

// Assign job to a project
exports.assignJob = async (req, res) => {
  const { projectId } = req.body;
  const job = await JobApplication.findByIdAndUpdate(
    req.params.id,
    { assignedProjectId: projectId, status: "assigned" },
    { new: true }
  );
  res.json(job);
};

// Delete job
exports.deleteJob = async (req, res) => {
  await JobApplication.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
