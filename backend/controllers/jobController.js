const mongoose = require("mongoose");
const JobApplication = require("../models/JobApplication");

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

// Apply job
exports.applyJob = async (req, res) => {
  try {
    const jobData = req.body;

    if (!jobData.applicantId) return res.status(400).json({ error: "Applicant ID required" });
    jobData.applicantId = mongoose.Types.ObjectId(jobData.applicantId);

    // Convert all dates in workerDetails
    if (jobData.workerDetails) {
      if (jobData.workerDetails.dateOfBirth)
        jobData.workerDetails.dateOfBirth = new Date(jobData.workerDetails.dateOfBirth);

      if (jobData.workerDetails.employmentPreferences?.startDate)
        jobData.workerDetails.employmentPreferences.startDate = new Date(jobData.workerDetails.employmentPreferences.startDate);

      if (jobData.workerDetails.employmentHistory?.length) {
        jobData.workerDetails.employmentHistory = jobData.workerDetails.employmentHistory.map(job => ({
          ...job,
          startDate: job.startDate ? new Date(job.startDate) : undefined,
          endDate: job.endDate ? new Date(job.endDate) : undefined,
        }));
      }
    }

    // Add similar conversion for contractorDetails and designerDetails if needed

    const newJob = new JobApplication(jobData);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error("Error applying job:", err);
    res.status(500).json({ error: "Failed to apply for job", details: err.message });
  }
};

// Approve job
exports.approveJob = async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve job" });
  }
};

// Reject job
exports.rejectJob = async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject job" });
  }
};

// Assign job
exports.assignJob = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: "Project ID required" });
    const job = await JobApplication.findByIdAndUpdate(req.params.id, { assignedProjectId: projectId, status: "assigned" }, { new: true });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign job" });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ success: true, message: "Job deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete job" });
  }
};
