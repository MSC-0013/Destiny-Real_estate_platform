import mongoose from "mongoose";

const InstallmentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
});

const PaymentSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["emi", "salary", "material", "contractor", "designer"], 
    required: true 
  },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
  recipient: { type: String },
  installments: [InstallmentSchema],
}, { timestamps: true });

const ProjectPoolSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  totalCost: { type: Number, required: true },
  remainingPool: { type: Number, required: true },
  materialCost: { type: Number, default: 0 },
  salariesCost: { type: Number, default: 0 },
}, { timestamps: true });

export const Payment = mongoose.model("Payment", PaymentSchema);
export const ProjectPool = mongoose.model("ProjectPool", ProjectPoolSchema);
