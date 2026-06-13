import "dotenv/config";
import express from "express";
import cors from "cors";
import connectMongodb from "./src/lib/mongoose.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import friendRouter from "./src/routes/friend.routes.js";
import settingRouter from "./src/routes/setting.routes.js";
import conversationRouter from "./src/routes/conversation.routes.js";
import messageRouter from "./src/routes/message.routes.js";
import groupRouter from "./src/routes/group.routes.js";
import protect from "./src/middleware/protect.js";
import http from "http";
import { Server } from "socket.io";
import { registerSocket } from "./src/socket/index.js";
import { setIo } from "./src/socket/socket.instance.js";

const app = express();

// API rate limiter for whole app
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: "Too many requests from this IP, please try again later",
});

app.use(globalLimiter);

// connect to mongodb
connectMongodb();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", protect, userRouter);
app.use("/api/friend", protect, friendRouter);
app.use("/api/setting", protect, settingRouter);
app.use("/api/conversation", protect, conversationRouter);
app.use("/api/message", protect, messageRouter);
app.use("/api/group", protect, groupRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "OK" });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

setIo(io);

registerSocket(io);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
