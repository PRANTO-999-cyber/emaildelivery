import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    // ==================================================
    // Owner
    // ==================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==================================================
    // Basic Information
    // ==================================================

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    previewText: {
      type: String,
      default: "",
      maxlength: 255,
    },

    type: {
      type: String,
      enum: ["regular", "warmup", "automation", "transactional", "drip"],
      default: "regular",
    },

    // ==================================================
    // Email Content
    // ==================================================

    html: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      default: "",
    },

    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
    },

    // ==================================================
    // Sender
    // ==================================================

    fromName: {
      type: String,
      required: true,
    },

    fromEmail: {
      type: String,
      required: true,
      lowercase: true,
    },

    replyTo: {
      type: String,
      default: "",
      lowercase: true,
    },

    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
    },

    smtp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SMTP",
      required: true,
    },

    // ==================================================
    // Recipients
    // ==================================================

    contactLists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContactList",
      },
    ],

    totalRecipients: {
      type: Number,
      default: 0,
    },

    // ==================================================
    // Schedule
    // ==================================================

    sendImmediately: {
      type: Boolean,
      default: true,
    },

    scheduledAt: Date,

    timezone: {
      type: String,
      default: "UTC",
    },

    // ==================================================
    // Tracking
    // ==================================================

    trackOpens: {
      type: Boolean,
      default: true,
    },

    trackClicks: {
      type: Boolean,
      default: true,
    },

    trackUnsubscribes: {
      type: Boolean,
      default: true,
    },

    // ==================================================
    // Status
    // ==================================================

    status: {
      type: String,
      enum: [
        "draft",
        "scheduled",
        "queued",
        "sending",
        "paused",
        "completed",
        "cancelled",
        "failed",
      ],
      default: "draft",
      index: true,
    },

    // ==================================================
    // Statistics
    // ==================================================

    totalSent: {
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

    failed: {
      type: Number,
      default: 0,
    },

    unsubscribed: {
      type: Number,
      default: 0,
    },

    spamComplaints: {
      type: Number,
      default: 0,
    },

    // ==================================================
    // Rates
    // ==================================================

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

    // ==================================================
    // Execution
    // ==================================================

    startedAt: Date,

    completedAt: Date,

    lastSentAt: Date,

    // ==================================================
    // Options
    // ==================================================

    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    notes: {
      type: String,
      default: "",
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * ===================================
 * Calculate Rates
 * ===================================
 */

campaignSchema.pre("save", function (next) {
  const total = this.totalRecipients || 1;

  this.deliveryRate = Number(((this.delivered / total) * 100).toFixed(2));

  this.openRate = Number(((this.opened / total) * 100).toFixed(2));

  this.clickRate = Number(((this.clicked / total) * 100).toFixed(2));

  this.bounceRate = Number(((this.bounced / total) * 100).toFixed(2));

  next();
});

/**
 * ===================================
 * Indexes
 * ===================================
 */

campaignSchema.index({ user: 1, status: 1 });
campaignSchema.index({ smtp: 1 });
campaignSchema.index({ domain: 1 });
campaignSchema.index({ createdAt: -1 });
campaignSchema.index({ scheduledAt: 1 });
campaignSchema.index({ name: "text", subject: "text" });

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
