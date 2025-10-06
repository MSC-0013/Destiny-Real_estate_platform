// models/User.js
import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  images: { type: [String], default: [] },
  completedDate: { type: String, default: "" },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "" },
  email: { type: String, required: true, unique: true, default: "" },
  phone: { type: String, default: "" },
  role: { type: String, enum: ["tenant", "landlord", "admin", "contractor", "worker", "designer"], required: true, default: "tenant" },
  avatar: { type: String, default: "" },
  address: { type: String, default: "" },
  dateOfBirth: { type: String, default: "" },
  occupation: { type: String, default: "" },
  bio: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  documents: { type: [String], default: [] },
  portfolio: { type: [PortfolioSchema], default: [] },
  earnings: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  password: { type: String, required: true, default: "" },
}, { timestamps: true });

export default mongoose.model("User", UserSchema); // ✅ ESM default export
