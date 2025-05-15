const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const calculationRoutes = require("./routes/calculations");
const tileRoutes = require("./routes/tiles");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/uploads");

// Middleware
const { authenticateToken } = require("./middleware/auth");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create necessary directories
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Ensure upload folders exist
    ensureDirectoryExists(path.join(__dirname, "uploads"));
    ensureDirectoryExists(path.join(__dirname, "uploads/reports"));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// API Routes
app.use("/api/auth", authRoutes); // Public
app.use("/api/users", authenticateToken, userRoutes); // Protected
app.use("/api/calculations", authenticateToken, calculationRoutes); // ✅ Protected
app.use("/api/tiles", authenticateToken, tileRoutes); // Protected
app.use("/api/admin", authenticateToken, adminRoutes); // Protected
app.use("/api/uploads", uploadRoutes); // Assume you handle auth inside the upload route

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend (React) in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔴 Global error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
