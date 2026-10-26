
import express from "express";
import cors from "cors";
import issueRoutes from "./routes/issue.routes";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Issue routes
app.use("/api/issues", issueRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to CampusPulse API"
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusPulse server is running"
  });
});

export default app;
