import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/AuthRoute.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
connectDB();

app.use(
  cors({
    origin: "http://54.165.233.20", // Replace with your frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.send("Skill Exchange API is running...");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(` Server running on http://54.165.233.20:${PORT}`)
);
