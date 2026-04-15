import express from "express";
import cors from "cors";
import passport from "./config/passport";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});