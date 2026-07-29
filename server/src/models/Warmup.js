import mongoose from "mongoose";

const warmupSchema = new mongoose.Schema(
  {
    /**
     * Multi Tenant
     */

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

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
     * SMTP Account
     */

    smtp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SMTP",
      required: true,
      unique: true,
      index: true,
    },

    /**
     * Name
     */

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    /**
     * Status
     */

    status: {
      type: String,
      enum: ["draft", "running", "paused", "completed", "stopped"],
      default: "draft",
      index: true,
    },

    /**
     * Schedule
     */

    startDate: {
      type: Date,
      default: Date.now,
    },

    completedAt: Date,

    /**
     * Limits
     */

    startDailyLimit: {
      type: Number,
      default: 20,
      min: 1,
    },

    currentDailyLimit: {
      type: Number,
      default: 20,
    },

    maxDailyLimit: {
      type: Number,
      default: 100,
    },

    increasePerDay: {
      type: Number,
      default: 10,
    },

    /**
     * Sending
     */

    sentToday: {
      type: Number,
      default: 0,
    },

    totalSent: {
      type: Number,
      default: 0,
    },

    /**
     * Engagement
     */

    delivered: {
      type: Number,
      default: 0,
    },

    opened: {
      type: Number,
      default: 0,
    },

    replied: {
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
     * Reputation
     */

    reputation: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    /**
     * Health
     */

    health: {
      type: String,
      enum: ["excellent", "good", "warning", "critical"],
      default: "good",
    },

    /**
     * Auto Pause
     */

    autoPauseOnBounce: {
      type: Boolean,
      default: true,
    },

    autoPauseOnComplaint: {
      type: Boolean,
      default: true,
    },

    /**
     * Statistics
     */

    lastWarmupSentAt: Date,

    lastLimitIncreaseAt: Date,

    /**
     * Notes
     */

    notes: {
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
 * ===========================
 * Indexes
 * ===========================
 */

warmupSchema.index({
  tenant: 1,
  status: 1,
});

warmupSchema.index({
  smtp: 1,
});

warmupSchema.index({
  user: 1,
});

warmupSchema.index({
  createdAt: -1,
});

/**
 * ===========================
 * Instance Methods
 * ===========================
 */

warmupSchema.methods.start = async function () {
  this.status = "running";
  return this.save();
};

warmupSchema.methods.pause = async function () {
  this.status = "paused";
  return this.save();
};

warmupSchema.methods.stop = async function () {
  this.status = "stopped";
  return this.save();
};

warmupSchema.methods.complete = async function () {
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

warmupSchema.methods.increaseLimit = async function () {
  if (this.currentDailyLimit < this.maxDailyLimit) {
    this.currentDailyLimit = Math.min(
      this.currentDailyLimit + this.increasePerDay,
      this.maxDailyLimit,
    );

    this.lastLimitIncreaseAt = new Date();
  }

  return this.save();
};

warmupSchema.methods.incrementSent = async function () {
  this.sentToday += 1;
  this.totalSent += 1;
  this.lastWarmupSentAt = new Date();

  return this.save();
};

warmupSchema.methods.resetDailyCounter = async function () {
  this.sentToday = 0;
  return this.save();
};

/**
 * ===========================
 * Static Methods
 * ===========================
 */

warmupSchema.statics.getRunningWarmups = function () {
  return this.find({
    status: "running",
    isDeleted: false,
  }).populate("smtp");
};

warmupSchema.statics.getBySMTP = function (smtpId) {
  return this.findOne({
    smtp: smtpId,
    isDeleted: false,
  });
};

warmupSchema.statics.getCompletedWarmups = function () {
  return this.find({
    status: "completed",
    isDeleted: false,
  });
};

const Warmup = mongoose.model("Warmup", warmupSchema);

export default Warmup;
