import mongoose from "mongoose";

const repairRequestSchema = new mongoose.Schema({
  title: String,
  description: String,
  clientId: String,
  clientName: String,
  location: String,
  address: String,
  projectType: { type: String, enum: ['residential','commercial','renovation','interior'] },
  urgency: { type: String, enum: ['low','medium','high'], default: 'medium' },
  attachments: [String],
  estimatedCost: Number,
  status: { type: String, enum: ['pending','approved','in-progress','completed','rejected'], default: 'pending' },
  adminId: String
}, { timestamps: true });

export default mongoose.model("RepairRequest", repairRequestSchema);
