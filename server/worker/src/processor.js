import { Worker } from "bullmq";
import nodemailer from "nodemailer";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Process background queue jobs
const worker = new Worker(
  "email-delivery-queue",
  async (job) => {
    const { to, subject, body } = job.data;

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"My Service" <noreply@example.com>',
      to,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    return { messageId: info.messageId };
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT || 6379,
    },
    concurrency: 5, // Processes 5 emails simultaneously
  },
);

worker.on("completed", (job) => {
  console.log(`[Job ${job.id}] Email successfully sent to ${job.data.to}`);
});

worker.on("failed", (job, err) => {
  console.error(`[Job ${job?.id}] Email delivery failed: ${err.message}`);
});
