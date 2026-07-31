import express from "express";
import { emailQueue } from "../queue/email.queue.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // 1. Validation
    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: to, subject, and body are required.",
      });
    }

    // 2. Add job to BullMQ
    const job = await emailQueue.add(
      "send-email-job",
      { to, subject, body },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: true,
      },
    );

    // 3. Respond with 202 Accepted
    return res.status(202).json({
      success: true,
      message: "Email queued successfully for background delivery.",
      jobId: job.id,
    });
  } catch (error) {
    console.error("[API Error] Failed to enqueue job:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while queueing email.",
    });
  }
});

export default router;
