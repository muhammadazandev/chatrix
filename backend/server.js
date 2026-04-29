import "dotenv/config";
import express from "express";
import cors from "cors";
import connectMongodb from "./src/lib/mongoose.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import friendRouter from "./src/routes/friend.routes.js";

const app = express();

// API rate limiter for whole app
// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests
//   message: "Too many requests from this IP, please try again later",
// });

// app.use(globalLimiter);

// API rate limiter for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 attempts per IP
  message: "Too many attempts, please try again later",
  standardHeaders: true,
});

app.use("/auth", authLimiter);

// connect to mongodb
connectMongodb();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/friend", friendRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "OK" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
