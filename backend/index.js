import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import apiRoutes from "./routes/api/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    name: "sellera.sid",
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Enable CORS for all routes
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://sellera.com"
        : [
            "http://localhost:8080",
            "http://localhost:3000",
            "http://localhost:5173",
          ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

// API routes
app.use("/api", apiRoutes);

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "SellEra API Server",
    version: "1.0.0",
    documentation: "/api-docs",
  });
});

// API documentation route
app.get("/api-docs", (_req, res) => {
  res.sendFile("API_DOCUMENTATION.md", { root: "." });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  let { message = "Something went wrong", status = 500 } = err;

  // Send JSON error response
  res.status(status).json({
    success: false,
    error: message,
  });
});
// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});
