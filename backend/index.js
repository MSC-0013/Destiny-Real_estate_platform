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
// Increase payload size to handle big JSON / Base64 images
app.use(express.json({
  limit: '10mb'
})); // JSON payloads
app.use(express.urlencoded({
  limit: '10mb',
  extended: true
})); // URL-encoded payloads


// --------------------
// Test Route
// --------------------
app.get("/api/test", (req, res) => {
  res.json({
    message: "✅ Backend is working!"
  });
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
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));