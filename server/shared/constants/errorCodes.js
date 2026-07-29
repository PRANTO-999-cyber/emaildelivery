/**
 * ==========================================================
 * Error Codes
 * ==========================================================
 */

const ERROR_CODES = {
  // ======================================================
  // General
  // ======================================================

  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",

  // ======================================================
  // Authentication
  // ======================================================

  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",

  // ======================================================
  // Authorization
  // ======================================================

  FORBIDDEN: "FORBIDDEN",
  ACCESS_DENIED: "ACCESS_DENIED",
  ROLE_REQUIRED: "ROLE_REQUIRED",
  PERMISSION_REQUIRED: "PERMISSION_REQUIRED",

  // ======================================================
  // User
  // ======================================================

  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",

  // ======================================================
  // Campaign
  // ======================================================

  CAMPAIGN_NOT_FOUND: "CAMPAIGN_NOT_FOUND",
  CAMPAIGN_ALREADY_RUNNING: "CAMPAIGN_ALREADY_RUNNING",
  CAMPAIGN_ALREADY_COMPLETED: "CAMPAIGN_ALREADY_COMPLETED",
  CAMPAIGN_PAUSED: "CAMPAIGN_PAUSED",

  // ======================================================
  // Contact
  // ======================================================

  CONTACT_NOT_FOUND: "CONTACT_NOT_FOUND",
  DUPLICATE_CONTACT: "DUPLICATE_CONTACT",

  // ======================================================
  // SMTP
  // ======================================================

  SMTP_NOT_FOUND: "SMTP_NOT_FOUND",
  SMTP_DISABLED: "SMTP_DISABLED",
  SMTP_CONNECTION_FAILED: "SMTP_CONNECTION_FAILED",
  SMTP_AUTH_FAILED: "SMTP_AUTH_FAILED",
  SMTP_RATE_LIMIT_EXCEEDED: "SMTP_RATE_LIMIT_EXCEEDED",
  SMTP_QUOTA_EXCEEDED: "SMTP_QUOTA_EXCEEDED",

  // ======================================================
  // Domain
  // ======================================================

  DOMAIN_NOT_FOUND: "DOMAIN_NOT_FOUND",
  DOMAIN_NOT_VERIFIED: "DOMAIN_NOT_VERIFIED",
  SPF_FAILED: "SPF_FAILED",
  DKIM_FAILED: "DKIM_FAILED",
  DMARC_FAILED: "DMARC_FAILED",

  // ======================================================
  // Queue
  // ======================================================

  QUEUE_NOT_FOUND: "QUEUE_NOT_FOUND",
  JOB_NOT_FOUND: "JOB_NOT_FOUND",
  JOB_FAILED: "JOB_FAILED",

  // ======================================================
  // Warmup
  // ======================================================

  WARMUP_NOT_FOUND: "WARMUP_NOT_FOUND",
  WARMUP_ALREADY_RUNNING: "WARMUP_ALREADY_RUNNING",
  WARMUP_ALREADY_STOPPED: "WARMUP_ALREADY_STOPPED",

  // ======================================================
  // Template
  // ======================================================

  TEMPLATE_NOT_FOUND: "TEMPLATE_NOT_FOUND",

  // ======================================================
  // Tracking
  // ======================================================

  TRACKING_NOT_FOUND: "TRACKING_NOT_FOUND",

  // ======================================================
  // Analytics
  // ======================================================

  ANALYTICS_NOT_FOUND: "ANALYTICS_NOT_FOUND",

  // ======================================================
  // Reports
  // ======================================================

  REPORT_NOT_FOUND: "REPORT_NOT_FOUND",

  // ======================================================
  // File Upload
  // ======================================================

  FILE_REQUIRED: "FILE_REQUIRED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",

  // ======================================================
  // Email
  // ======================================================

  EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED",
  EMAIL_BOUNCED: "EMAIL_BOUNCED",
  EMAIL_REJECTED: "EMAIL_REJECTED",
  EMAIL_SPAM_COMPLAINT: "EMAIL_SPAM_COMPLAINT",

  // ======================================================
  // Validation
  // ======================================================

  INVALID_INPUT: "INVALID_INPUT",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_PASSWORD: "INVALID_PASSWORD",

  // ======================================================
  // Database
  // ======================================================

  DATABASE_ERROR: "DATABASE_ERROR",

  // ======================================================
  // Redis
  // ======================================================

  REDIS_CONNECTION_FAILED: "REDIS_CONNECTION_FAILED",

  // ======================================================
  // BullMQ
  // ======================================================

  QUEUE_CONNECTION_FAILED: "QUEUE_CONNECTION_FAILED",

  // ======================================================
  // Webhook
  // ======================================================

  INVALID_WEBHOOK_SIGNATURE: "INVALID_WEBHOOK_SIGNATURE",
  WEBHOOK_PROCESSING_FAILED: "WEBHOOK_PROCESSING_FAILED",

  // ======================================================
  // Rate Limit
  // ======================================================

  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
};

export default ERROR_CODES;
