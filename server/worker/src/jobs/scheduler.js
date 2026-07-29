// server/worker/jobs/scheduler.js

import cron from "node-cron";

import cleanupJob from "./cleanup.job.js";
import domainHealthCheckJob from "./domainHealthCheck.job.js";
import monitorJob from "./monitor.job.js";
import reportJob from "./report.job.js";

import logger from "../config/logger.js";

const startScheduler = () => {
  logger.info("Starting worker scheduler...");

  // -------------------------------------
  // Monitor System
  // Every 5 Minutes
  // -------------------------------------

  cron.schedule("*/5 * * * *", async () => {
    logger.info("Running monitor job...");

    await monitorJob();
  });

  // -------------------------------------
  // Domain Health Check
  // Every 6 Hours
  // -------------------------------------

  cron.schedule("0 */6 * * *", async () => {
    logger.info("Running domain health check...");

    await domainHealthCheckJob();
  });

  // -------------------------------------
  // Daily Report
  // Every Day at 12:00 AM
  // -------------------------------------

  cron.schedule("0 0 * * *", async () => {
    logger.info("Generating daily report...");

    await reportJob();
  });

  // -------------------------------------
  // Cleanup
  // Every Day at 2:00 AM
  // -------------------------------------

  cron.schedule("0 2 * * *", async () => {
    logger.info("Running cleanup job...");

    await cleanupJob();
  });

  logger.success("All scheduled jobs registered successfully.");
};

export default startScheduler;
