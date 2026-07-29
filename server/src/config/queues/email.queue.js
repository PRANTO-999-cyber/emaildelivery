import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const emailQueue = new Queue("email-delivery-queue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry failed emails 3 times
    backoff: {
      type: "exponential",
      delay: 5000, // Wait 5s, then 10s, etc.
    },
    removeOnComplete: true,
  },
});

export const addEmailToQueue = async (emailData) => {
  return await emailQueue.add("send-email", emailData);
};
