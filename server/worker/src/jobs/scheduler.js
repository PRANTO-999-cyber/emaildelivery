import cron from "node-cron";
import logger from "../utils/logger.js";

// Jobs
import { runCleanupJob } from "./cleanup.job.js";
import { runDomainHealthCheck } from "./domainHealthCheck.job.js";
import { runMonitorJob } from "./monitor.job.js";
import { runReportJob } from "./report.job.js";

export const startScheduler = () => {
  logger.info("[Scheduler] Initializing cron schedules...");

  // Example: Run domain health check every hour
  cron.schedule("0 * * * *", async () => {
    logger.info("[Cron] Running domain health check...");
    await runDomainHealthCheck();
  });

  // Example: Run database cleanup daily at midnight
  cron.schedule("0 0 * * *", async () => {
    logger.info("[Cron] Running system cleanup...");
    await runCleanupJob();
  });
};

export default startScheduler;
