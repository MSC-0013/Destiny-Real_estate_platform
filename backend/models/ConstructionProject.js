import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: String,
  assigneeName: String,
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  startDate: Date,
  endDate: Date,
  completedAt: Date,
});

const MaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: String,
  unitCost: Number,
  totalCost: Number,
  supplier: String,
  purchasedAt: Date,
});

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["advance", "milestone", "final"], required: true },
  status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
  dueDate: Date,
  paidAt: Date,
  description: String,
});

const ApprovalRequestSchema = new mongoose.Schema({
  type: { type: String, enum: ["project", "task", "material", "payment"], required: true },
  targetId: { type: String, required: true },
  requestedBy: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const ConstructionProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  clientId: String,
  clientName: String,
  location: String,
  address: String,
  projectType: { type: String, enum: ["residential", "commercial", "renovation", "interior"], required: true },
  status: { type: String, enum: ["pending", "approved", "in-progress", "completed", "cancelled"], default: "pending" },
  phase: { type: String, enum: ["planning", "foundation", "structure", "interior", "finishing", "completed"], default: "planning" },
  startDate: Date,
  endDate: Date,
  estimatedCost: Number,
  actualCost: Number,
  contractorId: String,
  contractorName: String,
  designerId: String,
  designerName: String,
  workers: [String],
  blueprints: [String],
  progressImages: [String],
  tasks: [TaskSchema],
  materials: [MaterialSchema],
  payments: [PaymentSchema],
  requests: [ApprovalRequestSchema],
  adminId: String,
}, { timestamps: true });

export default mongoose.model("ConstructionProject", ConstructionProjectSchema);
