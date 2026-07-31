import dotenv from "dotenv";
dotenv.config();

// Utils
import logger from "./utils/logger.js";
import redisConnection from "./utils/redis.connection.js";
import delay from "./utils/delay.js";

// Processors
import { emailProcessor } from "./processors/email.processor.js";
import { analyticsProcessor } from "./processors/analytics.processor.js";
import { bounceProcessor } from "./processors/bounce.processor.js";
import { warmupProcessor } from "./processors/warmup.processor.js";

// Jobs & Scheduler
import { startScheduler } from "./jobs/scheduler.js";
