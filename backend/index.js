import express from "express";
const app = express();
import connectDB from "./config/db.js";
import cors from "cors";
import apiRoutes from "./routes/api/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";

connectDB();

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
