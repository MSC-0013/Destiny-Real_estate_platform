import mongoose from "mongoose";

// --------------------
// Sub-schemas
// --------------------
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
  assigneeName: String,
  status: { type: String, enum: ['pending','in-progress','completed'], default: 'pending' },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  startDate: String,
  endDate: String,
  completedAt: String,
  images: [String]
}, { timestamps: true });

const materialSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  unitCost: Number,
  totalCost: Number,
  supplier: String,
  purchasedAt: String
});

const paymentSchema = new mongoose.Schema({
  amount: Number,
  type: { type: String, enum: ['advance','milestone','final'] },
  status: { type: String, enum: ['pending','paid','overdue'], default: 'pending' },
  dueDate: String,
  paidAt: String,
  description: String
});

const approvalRequestSchema = new mongoose.Schema({
  type: { type: String, enum: ['project','task','material','payment'] },
  targetId: String,
  requestedBy: String,
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// --------------------
// Main Construction Project Schema
// --------------------
const constructionProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  clientId: String,
  clientName: String,
  location: String,
  address: String,
  projectType: { type: String, enum: ['residential','commercial','renovation','interior'] },
  status: { type: String, enum: ['pending','approved','in-progress','completed','cancelled'], default: 'pending' },
  phase: { type: String, enum: ['planning','foundation','structure','interior','finishing','completed'], default: 'planning' },
  startDate: String,
  endDate: String,
  estimatedCost: Number,
  actualCost: Number,
  contractorId: String,
  contractorName: String,
  designerId: String,
  designerName: String,
  workers: [String],
  blueprints: [String],
  progressImages: [String],
  tasks: [taskSchema],
  materials: [materialSchema],
  payments: [paymentSchema],
  adminId: String,
  requests: [approvalRequestSchema]
}, { timestamps: true });

// --------------------
// Export
// --------------------
export default mongoose.model("ConstructionProject", constructionProjectSchema);
