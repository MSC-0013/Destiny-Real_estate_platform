import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import constructionRoutes from "./routes/constructionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// CORS Middleware
// --------------------
app.use(cors({
  origin: "http://localhost:8080", // frontend origin
  credentials: true, // allow cookies / JWT
}));

// --------------------
// Body Parser
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// --------------------
// Test Route
// --------------------
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is working!" });
});

// --------------------
// Routes
// --------------------
app.use("/api/users", userRoutes);
app.use("/api/construction", constructionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/jobs", jobRoutes);

// --------------------
// MongoDB Connection
// --------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // modern connection
    console.log("✅ MongoDB connected");

    // Start server only after DB is connected
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

// --------------------
// Global Error Handling
// --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
