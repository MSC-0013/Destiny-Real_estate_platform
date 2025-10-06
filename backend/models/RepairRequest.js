import mongoose from "mongoose";

const RepairRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  clientId: String,
  clientName: String,
  location: String,
  address: String,
  projectType: { type: String, enum: ["residential", "commercial", "renovation", "interior"], required: true },
  urgency: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  attachments: [String],
  estimatedCost: Number,
  status: { type: String, enum: ["pending", "approved", "in-progress", "completed", "rejected"], default: "pending" },
  adminId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("RepairRequest", RepairRequestSchema);
