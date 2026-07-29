import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
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

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==========================
    // Email Counters
    // ==========================

    totalEmails: {
      type: Number,
      default: 0,
      min: 0,
    },

    sent: {
      type: Number,
      default: 0,
      min: 0,
    },

    delivered: {
      type: Number,
      default: 0,
      min: 0,
    },

    opened: {
      type: Number,
      default: 0,
      min: 0,
    },

    uniqueOpened: {
      type: Number,
      default: 0,
      min: 0,
    },

    clicked: {
      type: Number,
      default: 0,
      min: 0,
    },

    uniqueClicked: {
      type: Number,
      default: 0,
      min: 0,
    },

    bounced: {
      type: Number,
      default: 0,
      min: 0,
    },

    softBounce: {
      type: Number,
      default: 0,
    },

    hardBounce: {
      type: Number,
      default: 0,
    },

    deferred: {
      type: Number,
      default: 0,
    },

    dropped: {
      type: Number,
      default: 0,
    },

    failed: {
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

    queued: {
      type: Number,
      default: 0,
    },

    rejected: {
      type: Number,
      default: 0,
    },

    // ==========================
    // Calculated Rates
    // ==========================

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

    inboxRate: {
      type: Number,
      default: 0,
    },

    spamRate: {
      type: Number,
      default: 0,
    },

    // ==========================
    // Revenue (Optional)
    // ==========================

    revenue: {
      type: Number,
      default: 0,
    },

    conversions: {
      type: Number,
      default: 0,
    },

    // ==========================
    // Tracking
    // ==========================

    lastSentAt: Date,
    lastOpenedAt: Date,
    lastClickedAt: Date,

    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * =================================
 * Calculate Rates
 * =================================
 */

analyticsSchema.pre("save", function (next) {
  const total = this.totalEmails || 1;

  this.deliveryRate = Number(((this.delivered / total) * 100).toFixed(2));

  this.openRate = Number(((this.opened / total) * 100).toFixed(2));

  this.clickRate = Number(((this.clicked / total) * 100).toFixed(2));

  this.bounceRate = Number(((this.bounced / total) * 100).toFixed(2));

  this.unsubscribeRate = Number(((this.unsubscribed / total) * 100).toFixed(2));

  this.complaintRate = Number(((this.complaints / total) * 100).toFixed(2));

  next();
});

/**
 * =================================
 * Compound Indexes
 * =================================
 */

analyticsSchema.index({ campaign: 1, date: -1 });
analyticsSchema.index({ smtp: 1, date: -1 });
analyticsSchema.index({ domain: 1, date: -1 });
analyticsSchema.index({ user: 1, date: -1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
