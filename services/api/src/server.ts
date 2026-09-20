import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Basic room joining
  socket.on("subscribe:state", ({ stateId }) => {
    socket.join(`state:${stateId}`);
    console.log(`Socket ${socket.id} joined state:${stateId}`);
  });

  socket.on("subscribe:training", ({ trainingId }) => {
    socket.join(`training:${trainingId}`);
    console.log(`Socket ${socket.id} joined training:${trainingId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(env.API_PORT, env.API_HOST, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode`);
  console.log(`👉 API available at http://${env.API_HOST}:${env.API_PORT}/api/v1`);
  console.log(`📡 Socket.IO server ready`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
