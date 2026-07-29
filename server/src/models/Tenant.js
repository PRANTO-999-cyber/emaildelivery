import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    /**
     * Workspace Name
     */

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },

    /**
     * Slug
     * Example:
     * acme-inc
     */

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    /**
     * Owner
     */

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /**
     * Members
     */

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
          required: true,
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /**
     * Logo
     */

    logo: {
      type: String,
      default: "",
    },

    /**
     * Website
     */

    website: {
      type: String,
      default: "",
    },

    /**
     * Company
     */

    companyName: {
      type: String,
      default: "",
    },

    /**
     * Billing Email
     */

    billingEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    /**
     * Plan
     */

    plan: {
      type: String,
      enum: ["free", "starter", "professional", "business", "enterprise"],
      default: "free",
      index: true,
    },

    /**
     * Subscription
     */

    subscriptionStatus: {
      type: String,
      enum: ["active", "trial", "expired", "cancelled", "suspended"],
      default: "trial",
    },

    trialEndsAt: Date,

    subscriptionEndsAt: Date,

    /**
     * Usage Limits
     */

    maxUsers: {
      type: Number,
      default: 5,
    },

    maxSMTPAccounts: {
      type: Number,
      default: 5,
    },

    maxDomains: {
      type: Number,
      default: 5,
    },

    maxCampaigns: {
      type: Number,
      default: 100,
    },

    maxContacts: {
      type: Number,
      default: 5000,
    },

    dailyEmailLimit: {
      type: Number,
      default: 1000,
    },

    /**
     * Current Usage
     */

    usersCount: {
      type: Number,
      default: 1,
    },

    smtpCount: {
      type: Number,
      default: 0,
    },

    domainCount: {
      type: Number,
      default: 0,
    },

    campaignCount: {
      type: Number,
      default: 0,
    },

    contactCount: {
      type: Number,
      default: 0,
    },

    emailsSentToday: {
      type: Number,
      default: 0,
    },

    /**
     * Status
     */

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      index: true,
    },

    /**
     * Settings
     */

    timezone: {
      type: String,
      default: "UTC",
    },

    language: {
      type: String,
      default: "en",
    },

    /**
     * Branding
     */

    primaryColor: {
      type: String,
      default: "#2563EB",
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

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * ===========================
 * Indexes
 * ===========================
 */

tenantSchema.index({
  owner: 1,
});

tenantSchema.index({
  status: 1,
});

tenantSchema.index({
  plan: 1,
});

tenantSchema.index({
  createdAt: -1,
});

tenantSchema.index({
  name: "text",
  companyName: "text",
});

/**
 * ===========================
 * Instance Methods
 * ===========================
 */

tenantSchema.methods.isTrialExpired = function () {
  if (!this.trialEndsAt) return false;
  return new Date() > this.trialEndsAt;
};

tenantSchema.methods.canSendEmail = function () {
  return (
    this.status === "active" && this.emailsSentToday < this.dailyEmailLimit
  );
};

tenantSchema.methods.incrementEmailUsage = async function () {
  this.emailsSentToday += 1;
  return this.save();
};

tenantSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

/**
 * ===========================
 * Static Methods
 * ===========================
 */

tenantSchema.statics.getActiveTenants = function () {
  return this.find({
    status: "active",
    isDeleted: false,
  });
};

tenantSchema.statics.getBySlug = function (slug) {
  return this.findOne({
    slug,
    isDeleted: false,
  });
};

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
