import JobApplication from "../models/JobApplication.js";

// -------------------- CREATE / APPLY JOB --------------------
export const applyJob = async (req, res) => {
  try {
    const { role, applicantId, applicantName, workerDetails, contractorDetails, designerDetails, title, description, assignedProjectId } = req.body;

    if (!role || !applicantId || !applicantName) {
      return res.status(400).json({ error: "role, applicantId, applicantName are required" });
    }

    const newJob = new JobApplication({
      role,
      applicantId,
      applicantName,
      workerDetails: workerDetails || {},
      contractorDetails: contractorDetails || {},
      designerDetails: designerDetails || {},
      title,
      description,
      assignedProjectId: assignedProjectId || null,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to apply for job", details: err.message });
  }
};

// -------------------- GET ALL JOBS --------------------
export const getJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get jobs", details: err.message });
  }
};

// -------------------- GET SINGLE JOB --------------------
export const getJobById = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get job", details: err.message });
  }
};

// -------------------- UPDATE JOB --------------------
export const updateJob = async (req, res) => {
  try {
    const updatedJob = await JobApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(updatedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update job", details: err.message });
  }
};

// -------------------- DELETE JOB --------------------
export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await JobApplication.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ error: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete job", details: err.message });
  }
};

// -------------------- APPROVE JOB --------------------
export const approveJob = async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve job", details: err.message });
  }
};

// -------------------- REJECT JOB --------------------
export const rejectJob = async (req, res) => {
  try {
    const job = await JobApplication.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject job", details: err.message });
  }
};

// -------------------- ASSIGN JOB --------------------
export const assignJob = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: "projectId is required to assign job" });

    const job = await JobApplication.findByIdAndUpdate(req.params.id, { status: "assigned", assignedProjectId: projectId }, { new: true });
    if (!job) return res.status(404).json({ error: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign job", details: err.message });
  }
};
