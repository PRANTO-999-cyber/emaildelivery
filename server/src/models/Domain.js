import mongoose from "mongoose";

const dnsRecordSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["TXT", "CNAME", "MX", "A", "AAAA"],
      required: true,
    },

    host: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const domainSchema = new mongoose.Schema(
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
     * Domain
     */

    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    trackingDomain: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    /**
     * Provider
     */

    provider: {
      type: String,
      enum: [
        "cloudflare",
        "godaddy",
        "namecheap",
        "route53",
        "digitalocean",
        "custom",
      ],
      default: "custom",
    },

    /**
     * DNS
     */

    dnsRecords: [dnsRecordSchema],

    /**
     * Verification
     */

    spfVerified: {
      type: Boolean,
      default: false,
    },

    dkimVerified: {
      type: Boolean,
      default: false,
    },

    dmarcVerified: {
      type: Boolean,
      default: false,
    },

    mxVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verifying", "verified", "failed"],
      default: "pending",
      index: true,
    },

    verifiedAt: Date,

    /**
     * Sending
     */

    warmupEnabled: {
      type: Boolean,
      default: true,
    },

    sendingEnabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Daily Limit
     */

    dailyLimit: {
      type: Number,
      default: 100,
    },

    sentToday: {
      type: Number,
      default: 0,
    },

    /**
     * Reputation
     */

    reputation: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    /**
     * Statistics
     */

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

    complaints: {
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

    /**
     * Status
     */

    status: {
      type: String,
      enum: ["active", "inactive", "warming", "blocked"],
      default: "inactive",
      index: true,
    },

    /**
     * Notes
     */

    notes: {
      type: String,
      default: "",
    },

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
    },

    deletedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Calculate Rates
 */

domainSchema.pre("save", function (next) {
  const total = this.totalSent || 1;

  this.deliveryRate = Number(((this.delivered / total) * 100).toFixed(2));

  this.openRate = Number(((this.opened / total) * 100).toFixed(2));

  this.clickRate = Number(((this.clicked / total) * 100).toFixed(2));

  this.bounceRate = Number(((this.bounced / total) * 100).toFixed(2));

  this.complaintRate = Number(((this.complaints / total) * 100).toFixed(2));

  next();
});

/**
 * Indexes
 */

domainSchema.index({ user: 1, status: 1 });
domainSchema.index({ createdAt: -1 });
domainSchema.index({ reputation: -1 });
domainSchema.index({ name: "text" });

/**
 * Instance Methods
 */

domainSchema.methods.isVerified = function () {
  return this.spfVerified && this.dkimVerified && this.dmarcVerified;
};

domainSchema.methods.canSend = function () {
  return (
    this.sendingEnabled &&
    this.status === "active" &&
    this.sentToday < this.dailyLimit &&
    this.isVerified()
  );
};

domainSchema.methods.incrementSent = async function () {
  this.sentToday += 1;
  this.totalSent += 1;
  return this.save();
};

domainSchema.methods.resetDailyCounter = async function () {
  this.sentToday = 0;
  return this.save();
};

const Domain = mongoose.model("Domain", domainSchema);

export default Domain;
