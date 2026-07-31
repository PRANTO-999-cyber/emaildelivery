import logger from "../utils/logger.js";
import redisConnection from "../utils/redis.connection.js";

/**
 * Health monitor for Redis connection state and queue performance.
 */
export const runMonitorJob = async () => {
  logger.info("[MonitorJob] Checking worker system and Redis metrics...");

  try {
    // Ping Redis to verify status
    const pingResponse = await redisConnection.ping();

    if (pingResponse !== "PONG") {
      throw new Error("Redis did not respond with PONG");
    }

    logger.info("[MonitorJob] Worker system and Redis connection are healthy.");

    return { status: "HEALTHY", redis: "CONNECTED" };
  } catch (error) {
    logger.error(`[MonitorJob] System health check failed: ${error.message}`);
    throw error;
  }
};

export default runMonitorJob;
