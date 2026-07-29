import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    /**
     * Owner
     * null = Global Setting
     * userId = User Setting
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    /**
     * General
     */
    appName: {
      type: String,
      default: "Email Delivery Platform",
    },

    appLogo: {
      type: String,
      default: "",
    },

    timezone: {
      type: String,
      default: "UTC",
    },

    language: {
      type: String,
      default: "en",
    },

    /**
     * Sending
     */
    defaultSenderName: {
      type: String,
      default: "",
    },

    defaultSenderEmail: {
      type: String,
      default: "",
    },

    defaultReplyTo: {
      type: String,
      default: "",
    },

    /**
     * Queue
     */
    queueEnabled: {
      type: Boolean,
      default: true,
    },

    queueConcurrency: {
      type: Number,
      default: 5,
      min: 1,
    },

    retryAttempts: {
      type: Number,
      default: 3,
    },

    retryDelay: {
      type: Number,
      default: 60000,
    },

    /**
     * Warmup
     */
    warmupEnabled: {
      type: Boolean,
      default: true,
    },

    warmupStartLimit: {
      type: Number,
      default: 20,
    },

    warmupIncreasePerDay: {
      type: Number,
      default: 10,
    },

    /**
     * Tracking
     */
    openTracking: {
      type: Boolean,
      default: true,
    },

    clickTracking: {
      type: Boolean,
      default: true,
    },

    unsubscribeTracking: {
      type: Boolean,
      default: true,
    },

    /**
     * Analytics
     */
    analyticsEnabled: {
      type: Boolean,
      default: true,
    },

    reportRetentionDays: {
      type: Number,
      default: 90,
    },

    /**
     * Notifications
     */
    emailNotification: {
      type: Boolean,
      default: true,
    },

    pushNotification: {
      type: Boolean,
      default: true,
    },

    /**
     * Security
     */
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },

    loginAlerts: {
      type: Boolean,
      default: true,
    },

    /**
     * API
     */
    apiEnabled: {
      type: Boolean,
      default: true,
    },

    apiRateLimit: {
      type: Number,
      default: 1000,
    },

    /**
     * Branding
     */
    primaryColor: {
      type: String,
      default: "#2563EB",
    },

    secondaryColor: {
      type: String,
      default: "#1E293B",
    },

    favicon: {
      type: String,
      default: "",
    },

    /**
     * SMTP
     */
    defaultSMTP: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SMTP",
    },

    /**
     * Domain
     */
    defaultDomain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
    },

    /**
     * Metadata
     */
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /**
     * Active
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Indexes
 */

settingSchema.index({
  user: 1,
});

settingSchema.index({
  isActive: 1,
});

/**
 * Instance Methods
 */

settingSchema.methods.enableWarmup = async function () {
  this.warmupEnabled = true;
  return this.save();
};

settingSchema.methods.disableWarmup = async function () {
  this.warmupEnabled = false;
  return this.save();
};

settingSchema.methods.enableTracking = async function () {
  this.openTracking = true;
  this.clickTracking = true;
  return this.save();
};

settingSchema.methods.disableTracking = async function () {
  this.openTracking = false;
  this.clickTracking = false;
  return this.save();
};

/**
 * Static Methods
 */

settingSchema.statics.getGlobalSetting = function () {
  return this.findOne({ user: null });
};

settingSchema.statics.getUserSetting = function (userId) {
  return this.findOne({ user: userId });
};

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
