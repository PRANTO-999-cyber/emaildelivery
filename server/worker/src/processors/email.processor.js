import { Worker } from "bullmq";
import redisConnection from "../utils/redis.connection.js";
import { sendEmailViaPool } from "../utils/smtpPool.js";
import { renderTemplate } from "../utils/templateRenderer.js";
import logger from "../utils/logger.js";
import Campaign from "../../../src/models/Campaign.js";
import Contact from "../../../src/models/Contact.js";

/**
 * Core processing function for individual email jobs.
 *
 * @param {import('bullmq').Job} job - BullMQ job containing payload details.
 */
export const processEmailJob = async (job) => {
  const { campaignId, contactId, tenantId, subject, templateBody } = job.data;

  logger.info(
    `[EmailProcessor] Processing job ${job.id} for Campaign: ${campaignId}`,
  );

  try {
    // 1. Fetch Contact Details
    const contact = await Contact.findOne({ _id: contactId, tenantId });
    if (!contact) {
      throw new Error(
        `Contact with ID ${contactId} not found for tenant ${tenantId}`,
      );
    }

    // 2. Render HTML Template
    const htmlContent = renderTemplate(templateBody, {
      firstName: contact.firstName || "Subscriber",
      email: contact.email,
      ...contact.customAttributes,
    });

    // 3. Dispatch Email via SMTP Pool
    const sendResult = await sendEmailViaPool({
      to: contact.email,
      subject: subject,
      html: htmlContent,
      tenantId: tenantId,
    });

    // 4. Increment Delivered Count on Campaign
    await Campaign.updateOne(
      { _id: campaignId },
      { $inc: { "stats.sent": 1 } },
    );

    logger.info(
      `[EmailProcessor] Successfully sent email to ${contact.email} (MessageID: ${sendResult.messageId})`,
    );

    return { status: "DELIVERED", messageId: sendResult.messageId };
  } catch (error) {
    logger.error(`[EmailProcessor] Error in job ${job.id}: ${error.message}`);

    // Increment Failed Count on Campaign
    await Campaign.updateOne(
      { _id: campaignId },
      { $inc: { "stats.failed": 1 } },
    ).catch((err) =>
      logger.error(
        `[EmailProcessor] Failed to update campaign stats: ${err.message}`,
      ),
    );

    throw error; // Rethrowing forces BullMQ to handle retry/fail logic
  }
};

/**
 * BullMQ Worker Instance
 */
export const emailWorker = new Worker("email-queue", processEmailJob, {
  connection: redisConnection,
  concurrency: 10, // Number of simultaneous jobs to process
});

// Worker Lifecycle Events
emailWorker.on("completed", (job, result) => {
  logger.info(
    `[Worker Event] Job ${job.id} completed successfully. MessageID: ${result?.messageId}`,
  );
});

emailWorker.on("failed", (job, err) => {
  logger.error(
    `[Worker Event] Job ${job?.id} failed with error: ${err.message}`,
  );
});

export default emailWorker;
