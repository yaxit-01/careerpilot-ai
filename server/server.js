const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
const roadmapRoutes = require("./routes/roadmap");
const milestoneRoutes = require("./routes/milestone");

app.use("/api/roadmap", roadmapRoutes);
app.use("/api/milestone-advice", milestoneRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CareerPilot AI API is running" });
});

// Return JSON for unknown API routes.
app.use("/api", (req, res) => {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});