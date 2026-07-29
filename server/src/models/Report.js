import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    /**
     * Owner
     */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /**
     * Report Information
     */

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Report Type
     */

    type: {
      type: String,
      enum: [
        "campaign",
        "smtp",
        "domain",
        "warmup",
        "analytics",
        "contacts",
        "bounce",
        "tracking",
        "custom",
      ],
      required: true,
      index: true,
    },

    /**
     * Related Resources
     */

    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      index: true,
    },

    smtp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SMTP",
      index: true,
    },

    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
      index: true,
    },

    /**
     * Report Period
     */

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    /**
     * Status
     */

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },

    /**
     * Output Format
     */

    format: {
      type: String,
      enum: ["json", "csv", "xlsx", "pdf"],
      default: "json",
    },

    /**
     * Statistics
     */

    totalEmails: {
      type: Number,
      default: 0,
    },

    sent: {
      type: Number,
      default: 0,
    },

    delivered: {
      type: Number,
      default: 0,
    },

    opened: {
      type: Number,
      default: 0,
    },

    clicked: {
      type: Number,
      default: 0,
    },

    bounced: {
      type: Number,
      default: 0,
    },

    failedEmails: {
      type: Number,
      default: 0,
    },

    complaints: {
      type: Number,
      default: 0,
    },

    unsubscribed: {
      type: Number,
      default: 0,
    },

    /**
     * Rates
     */

    deliveryRate: {
      type: Number,
      default: 0,
    },

    openRate: {
      type: Number,
      default: 0,
    },

    clickRate: {
      type: Number,
      default: 0,
    },

    bounceRate: {
      type: Number,
      default: 0,
    },

    complaintRate: {
      type: Number,
      default: 0,
    },

    unsubscribeRate: {
      type: Number,
      default: 0,
    },

    /**
     * File
     */

    fileName: {
      type: String,
      default: "",
    },

    filePath: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    /**
     * Filters
     */

    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /**
     * Report Data
     */

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /**
     * Execution
     */

    generatedAt: Date,

    expiresAt: Date,

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
 * =====================================
 * Calculate Rates
 * =====================================
 */

reportSchema.pre("save", function (next) {
  const total = this.totalEmails || 1;

  this.deliveryRate = Number(((this.delivered / total) * 100).toFixed(2));

  this.openRate = Number(((this.opened / total) * 100).toFixed(2));

  this.clickRate = Number(((this.clicked / total) * 100).toFixed(2));

  this.bounceRate = Number(((this.bounced / total) * 100).toFixed(2));

  this.complaintRate = Number(((this.complaints / total) * 100).toFixed(2));

  this.unsubscribeRate = Number(((this.unsubscribed / total) * 100).toFixed(2));

  next();
});

/**
 * =====================================
 * Indexes
 * =====================================
 */

reportSchema.index({ user: 1, createdAt: -1 });

reportSchema.index({ type: 1 });

reportSchema.index({ status: 1 });

reportSchema.index({ campaign: 1 });

reportSchema.index({ smtp: 1 });

reportSchema.index({ domain: 1 });

reportSchema.index({
  name: "text",
  description: "text",
});

/**
 * =====================================
 * Instance Methods
 * =====================================
 */

reportSchema.methods.markProcessing = async function () {
  this.status = "processing";
  return this.save();
};

reportSchema.methods.markCompleted = async function (filePath) {
  this.status = "completed";
  this.generatedAt = new Date();

  if (filePath) {
    this.filePath = filePath;
  }

  return this.save();
};

reportSchema.methods.markFailed = async function (message) {
  this.status = "failed";
  this.error = message;

  return this.save();
};

/**
 * =====================================
 * Static Methods
 * =====================================
 */

reportSchema.statics.getRecentReports = function (userId, limit = 10) {
  return this.find({
    user: userId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

reportSchema.statics.getCompletedReports = function (userId) {
  return this.find({
    user: userId,
    status: "completed",
    isDeleted: false,
  }).sort({
    createdAt: -1,
  });
};

const Report = mongoose.model("Report", reportSchema);

export default Report;
