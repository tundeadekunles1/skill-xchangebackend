import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/AuthRoute.js";
import userRoutes from "./routes/UserRoutes.js";
import matchRoutes from "./routes/MatchRoutes.js";
import sessionRoutes from "./routes/SessionRoute.js";
import matchRequestRoutes from "./routes/MatchRequestRoutes.js";
import sessionScheduleRoutes from "./routes/sessionScheduleRoutes.js";
import calendarRoutes from "./routes/CalendarRoute.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
// const API_BASE_URL = process.env.API_BASE_URL;
connectDB();

app.use(
  cors({
    origin: "http://15.223.230.143", // Replace with your frontend URL
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
app.use("/api/users", userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/match-requests", matchRequestRoutes);
app.use("/api/session-schedules", sessionScheduleRoutes);
app.use("/api", calendarRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`Server running on http://15.223.230.143:${PORT}`)
);
