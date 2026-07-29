import { addEmailToQueue } from "../queues/email.queue.js";

export const triggerEmailSend = async (req, res, next) => {
  try {
    const { to, subject, body } = req.body;

    // Quick validation
    if (!to || !subject) {
      return res.status(400).json({ error: "Missing required email fields" });
    }

    // Push job into BullMQ
    const job = await addEmailToQueue({ to, subject, body });

    // Respond immediately to frontend
    return res.status(202).json({
      message: "Email request queued successfully",
      jobId: job.id,
      status: "queued",
    });
  } catch (error) {
    next(error);
  }
};
