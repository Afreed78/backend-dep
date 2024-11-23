import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

const app = express();

// Resolve the directory path for serving static files


// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow requests from frontend
    credentials: true, // Allow sending cookies with cross-origin requests
  })
);

// Serve frontend static files


// Import routes
import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";

// Routes
app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
