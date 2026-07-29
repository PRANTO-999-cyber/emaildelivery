import { Server } from "socket.io";

let io = null;

/**
 * Initialize Socket.IO
 */
export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    /**
     * Join Campaign Room
     * Client:
     * socket.emit("join-campaign", campaignId)
     */
    socket.on("join-campaign", (campaignId) => {
      socket.join(`campaign:${campaignId}`);
    });

    /**
     * Leave Campaign Room
     */
    socket.on("leave-campaign", (campaignId) => {
      socket.leave(`campaign:${campaignId}`);
    });

    /**
     * Join Queue Room
     */
    socket.on("join-queue", () => {
      socket.join("queue");
    });

    /**
     * Leave Queue Room
     */
    socket.on("leave-queue", () => {
      socket.leave("queue");
    });

    socket.on("disconnect", () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Return socket instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized.");
  }

  return io;
};

/**
 * Broadcast Queue Status
 */
export const emitQueueStatus = (data) => {
  if (!io) return;

  io.to("queue").emit("queue-status", data);
};

/**
 * Queue Progress
 */
export const emitQueueProgress = (campaignId, data) => {
  if (!io) return;

  io.to(`campaign:${campaignId}`).emit("queue-progress", data);
};

/**
 * Campaign Started
 */
export const emitCampaignStarted = (campaignId, campaign) => {
  if (!io) return;

  io.to(`campaign:${campaignId}`).emit("campaign-started", campaign);
};

/**
 * Campaign Completed
 */
export const emitCampaignCompleted = (campaignId, campaign) => {
  if (!io) return;

  io.to(`campaign:${campaignId}`).emit("campaign-completed", campaign);
};

/**
 * Campaign Failed
 */
export const emitCampaignFailed = (campaignId, error) => {
  if (!io) return;

  io.to(`campaign:${campaignId}`).emit("campaign-failed", error);
};

/**
 * Email Sent
 */
export const emitEmailSent = (campaignId, email) => {
  if (!io) return;

  io.to(`campaign:${campaignId}`).emit("email-sent", email);
};

/**
 * Email Failed
 */
export const emitEmailFailed = (campaignId, email) => {
  if (!io) return;

  io.to(`campaign:${campaignId}`).emit("email-failed", email);
};

/**
 * SMTP Health
 */
export const emitSMTPHealth = (smtp) => {
  if (!io) return;

  io.emit("smtp-health", smtp);
};

/**
 * Dashboard Stats
 */
export const emitDashboardStats = (stats) => {
  if (!io) return;

  io.emit("dashboard-stats", stats);
};

/**
 * Analytics Update
 */
export const emitAnalytics = (analytics) => {
  if (!io) return;

  io.emit("analytics-update", analytics);
};

/**
 * Notification
 */
export const emitNotification = (userId, notification) => {
  if (!io) return;

  io.to(`user:${userId}`).emit("notification", notification);
};

/**
 * Join User Room
 */
export const joinUserRoom = (socket, userId) => {
  socket.join(`user:${userId}`);
};
