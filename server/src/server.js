import express from "express";
import cors from "cors";
import "dotenv/config";
import emailRoutes from "./routes/email.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vite frontend running on local ports (5173 / 5174)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use(express.json());

// Mount Routes
app.use("/api/emails", emailRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
