import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import constructionRoutes from "./routes/constructionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import propertyRoutes from "./routes/propertyRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";





dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// CORS Middleware (Safe + Flexible)
// --------------------
const allowedOrigins = [
  "http://localhost:8080",           // local dev
  process.env.CLIENT_URL             // deployed frontend (from .env)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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
app.use('/api/orders', orderRoutes);
app.use('/api/payments',paymentRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/investments", investmentRoutes);





// --------------------
// MongoDB Connection
// --------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
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
