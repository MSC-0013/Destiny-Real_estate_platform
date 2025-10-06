import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["worker", "contractor", "designer"], required: true },
    applicantId: { type: String, required: true },
    applicantName: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "assigned", "rejected"], default: "pending" },
    assignedProjectId: { type: String, default: null },

    // Worker-specific details
    workerDetails: { type: Object, default: {} },

    // Contractor-specific details
    contractorDetails: { type: Object, default: {} },

    // Designer-specific details
    designerDetails: { type: Object, default: {} },

    // General fields
    title: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", JobApplicationSchema);
