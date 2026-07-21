import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();
const server = http.createServer(app);

// Socket.IO
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  },
});

// Online users
export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User Connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middlewares
app.use(express.json({ limit: "4mb" }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "Server is Live",
  });
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Start Server
const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
} catch (err) {
  console.error("MongoDB Connection Error:", err);
  process.exit(1);
}
