import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema(
  {
    /**
     * Tenant
     */

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    /**
     * User
     */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /**
     * Provider
     */

    provider: {
      type: String,
      enum: [
        "gmail",
        "outlook",
        "hotmail",
        "yahoo",
        "amazon_ses",
        "mailgun",
        "sendgrid",
        "brevo",
        "mailjet",
        "postmark",
        "sparkpost",
        "resend",
        "custom",
      ],
      default: "custom",
      index: true,
    },

    /**
     * SMTP
     */

    smtp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SMTP",
      index: true,
    },

    /**
     * Domain
     */

    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
      index: true,
    },

    /**
     * Campaign
     */

    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      index: true,
    },

    /**
     * Contact
     */

    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      index: true,
    },

    /**
     * Email Log
     */

    emailLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailLog",
      index: true,
    },

    /**
     * Event
     */

    event: {
      type: String,
      enum: [
        "queued",
        "sent",
        "delivered",
        "opened",
        "clicked",
        "bounced",
        "deferred",
        "failed",
        "spam",
        "complaint",
        "unsubscribe",
        "dropped",
        "processed",
      ],
      required: true,
      index: true,
    },

    /**
     * Direction
     */

    direction: {
      type: String,
      enum: ["incoming", "outgoing"],
      default: "incoming",
      index: true,
    },

    /**
     * IDs
     */

    messageId: {
      type: String,
      index: true,
    },

    providerMessageId: {
      type: String,
      index: true,
    },

    trackingId: {
      type: String,
      index: true,
    },

    /**
     * Endpoint
     */

    endpoint: {
      type: String,
      default: "",
    },

    /**
     * Security
     */

    signature: {
      type: String,
      default: "",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    /**
     * Processing
     */

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },

    retryCount: {
      type: Number,
      default: 0,
    },

    maxRetries: {
      type: Number,
      default: 5,
    },

    nextRetryAt: Date,

    /**
     * Payload
     */

    headers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    response: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /**
     * Network
     */

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },

    /**
     * Error
     */

    error: {
      type: String,
      default: "",
    },

    /**
     * Metadata
     */

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /**
     * Processed Time
     */

    processedAt: Date,

    /**
     * Soft Delete
     */

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Indexes
 */

webhookSchema.index({ tenant: 1 });

webhookSchema.index({ provider: 1 });

webhookSchema.index({ event: 1 });

webhookSchema.index({ status: 1 });

webhookSchema.index({ messageId: 1 });

webhookSchema.index({ trackingId: 1 });

webhookSchema.index({ createdAt: -1 });

/**
 * Instance Methods
 */

webhookSchema.methods.markProcessing = async function () {
  this.status = "processing";
  return this.save();
};

webhookSchema.methods.markCompleted = async function () {
  this.status = "completed";
  this.processedAt = new Date();
  return this.save();
};

webhookSchema.methods.markFailed = async function (error) {
  this.status = "failed";
  this.error = error;
  this.retryCount += 1;

  if (this.retryCount < this.maxRetries) {
    this.nextRetryAt = new Date(Date.now() + this.retryCount * 60000);
  }

  return this.save();
};

/**
 * Static Methods
 */

webhookSchema.statics.getPending = function () {
  return this.find({
    status: "pending",
    isDeleted: false,
  }).sort({
    createdAt: 1,
  });
};

webhookSchema.statics.getFailed = function () {
  return this.find({
    status: "failed",
    isDeleted: false,
  });
};

webhookSchema.statics.getByProvider = function (provider) {
  return this.find({
    provider,
    isDeleted: false,
  });
};

const Webhook = mongoose.model("Webhook", webhookSchema);

export default Webhook;
