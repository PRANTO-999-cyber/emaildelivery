import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
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
     * Campaign
     */
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },

    /**
     * Contact
     */
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
      index: true,
    },

    /**
     * SMTP
     */
    smtp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SMTP",
      required: true,
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
     * Email
     */
    to: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    from: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    html: {
      type: String,
      default: "",
    },

    text: {
      type: String,
      default: "",
    },

    /**
     * Queue Status
     */
    status: {
      type: String,
      enum: [
        "waiting",
        "scheduled",
        "processing",
        "sent",
        "failed",
        "cancelled",
      ],
      default: "waiting",
      index: true,
    },

    /**
     * Priority
     */
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
      index: true,
    },

    /**
     * Retry
     */
    retryCount: {
      type: Number,
      default: 0,
    },

    maxRetries: {
      type: Number,
      default: 3,
    },

    nextRetryAt: Date,

    /**
     * Schedule
     */
    scheduledAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    /**
     * Worker
     */
    workerId: {
      type: String,
      default: "",
    },

    bullJobId: {
      type: String,
      default: "",
      index: true,
    },

    /**
     * Processing
     */
    startedAt: Date,

    finishedAt: Date,

    /**
     * SMTP Response
     */
    response: {
      type: String,
      default: "",
    },

    error: {
      type: String,
      default: "",
    },

    /**
     * Attachments
     */
    attachments: [
      {
        filename: String,
        path: String,
        mimeType: String,
        size: Number,
      },
    ],

    /**
     * Metadata
     */
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
 * Indexes
 */

queueSchema.index({
  campaign: 1,
  status: 1,
});

queueSchema.index({
  smtp: 1,
  status: 1,
});

queueSchema.index({
  scheduledAt: 1,
  status: 1,
});

queueSchema.index({
  priority: -1,
  scheduledAt: 1,
});

queueSchema.index({
  createdAt: -1,
});

/**
 * Instance Methods
 */

queueSchema.methods.start = async function () {
  this.status = "processing";
  this.startedAt = new Date();
  return this.save();
};

queueSchema.methods.complete = async function () {
  this.status = "sent";
  this.finishedAt = new Date();
  return this.save();
};

queueSchema.methods.fail = async function (message) {
  this.status = "failed";
  this.error = message;
  this.finishedAt = new Date();
  this.retryCount += 1;

  if (this.retryCount < this.maxRetries) {
    this.status = "waiting";
    this.nextRetryAt = new Date(Date.now() + this.retryCount * 60000);
  }

  return this.save();
};

queueSchema.methods.cancel = async function () {
  this.status = "cancelled";
  this.finishedAt = new Date();
  return this.save();
};

/**
 * Static Methods
 */

queueSchema.statics.getWaitingJobs = function () {
  return this.find({
    status: "waiting",
    scheduledAt: {
      $lte: new Date(),
    },
  }).sort({
    priority: -1,
    scheduledAt: 1,
  });
};

queueSchema.statics.getQueueStats = async function () {
  const [waiting, processing, sent, failed, cancelled] = await Promise.all([
    this.countDocuments({ status: "waiting" }),
    this.countDocuments({ status: "processing" }),
    this.countDocuments({ status: "sent" }),
    this.countDocuments({ status: "failed" }),
    this.countDocuments({ status: "cancelled" }),
  ]);

  return {
    waiting,
    processing,
    sent,
    failed,
    cancelled,
  };
};

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;
