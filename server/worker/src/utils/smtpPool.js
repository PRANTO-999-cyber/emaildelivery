import nodemailer from "nodemailer";
import logger from "./logger.js";

/**
 * Dispatches email using nodemailer transport pool.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body content
 * @param {string} options.tenantId - Associated tenant ID
 */
export const sendEmailViaPool = async ({ to, subject, html, tenantId }) => {
  logger.info(
    `[SMTPPool] Simulating/Sending email to ${to} for tenant ${tenantId}`,
  );

  // Example Nodemailer test transport (Replace with your actual SMTP transport configuration/pool)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: Number(process.env.SMTP_PORT) || 2525,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });

  const mailOptions = {
    from:
      process.env.SMTP_FROM || '"Email Service" <no-reply@emaildelivery.com>',
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId || `msg_${Date.now()}` };
};

export default sendEmailViaPool;
