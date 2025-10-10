import mongoose from "mongoose";

const ConstructionRequestSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    userId: { type: String },

    projectType: { type: String, required: true },
    location: { type: String, required: true },

    area: { type: String },
    bedrooms: { type: String },
    bathrooms: { type: String },
    floors: { type: String },

    budgetRange: { type: String }, // e.g. "10-25", "25-50"
    timeline: { type: String }, // e.g. "3-6"

    description: { type: String },
    requirements: [{ type: String }],
    designImages: [{ type: String }],

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminId: { type: String },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "ConstructionProject" },
  },
  { timestamps: true }
);

export default mongoose.model("ConstructionRequest", ConstructionRequestSchema);
