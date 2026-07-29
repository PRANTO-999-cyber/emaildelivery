/**
 * @file smtpPool.js
 * @description Connection pool factory for outbound SMTP transports.
 */

const nodemailer = require("nodemailer");
const logger = require("./logger");

const poolCache = new Map();

/**
 * Gets or creates a pooled Nodemailer SMTP transport instance.
 * @param {Object} smtpConfig - SMTP credentials & server options
 * @returns {import('nodemailer').Transporter}
 */
function getSmtpTransport(smtpConfig) {
  const poolKey = `${smtpConfig.host}:${smtpConfig.port}:${smtpConfig.auth?.user || "anon"}`;

  if (poolCache.has(poolKey)) {
    return poolCache.get(poolKey);
  }

  logger.info(
    `[SMTP Pool] Initializing new connection pool for: ${smtpConfig.host}`,
  );

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port || 587,
    secure: smtpConfig.secure ?? false, // true for 465, false for other ports
    auth: smtpConfig.auth
      ? {
          user: smtpConfig.auth.user,
          pass: smtpConfig.auth.pass,
        }
      : undefined,
    pool: true,
    maxConnections: smtpConfig.maxConnections || 10,
    maxMessages: smtpConfig.maxMessages || 100,
    rateDelta: 1000,
    rateLimit: smtpConfig.rateLimit || 50, // max 50 emails/sec per connection
  });

  poolCache.set(poolKey, transporter);
  return transporter;
}

/**
 * Closes all cached SMTP transport pools on worker shutdown.
 */
async function closeAllPools() {
  logger.info("[SMTP Pool] Closing all cached SMTP transports...");
  for (const [key, transporter] of poolCache.entries()) {
    transporter.close();
    poolCache.delete(key);
  }
}

module.exports = {
  getSmtpTransport,
  closeAllPools,
};
