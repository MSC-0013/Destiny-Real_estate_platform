import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String],
  completedDate: String,
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  role: {
    type: String,
    enum: ["tenant", "landlord", "admin", "contractor", "worker", "designer"],
    required: true,
  },
  avatar: String,
  address: String,
  dateOfBirth: String,
  occupation: String,
  bio: String,
  profileImage: String,
  verified: { type: Boolean, default: false },
  documents: [String],
  portfolio: [PortfolioSchema],
  earnings: Number,
  rating: Number,
  completedJobs: Number,
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
