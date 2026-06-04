import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

// MongoDB connection
connectDB();

const __dirname = path.resolve();
const clientPath = path.join(__dirname, "client/dist");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientPath));

// Test Route
app.get("/", (req, res) => {
  res.send("Blog API is running...");
});

app.get((req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});
// Auth Routes
app.use("/api/auth", authRoutes);

// Post Routes
app.use("/api/posts", postRoutes);

// Post Comments
app.use("/api/comments", commentRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Enternal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
