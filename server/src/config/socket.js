import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ Socket Connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`❌ Socket Disconnected: ${socket.id}`);
    });
  });

  console.log("=========================================");
  console.log("✅ Socket.IO Initialized");
  console.log("=========================================");

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

export default initSocket;
