import mongoose from "mongoose";

const bounceSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },

    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
      index: true,
    },

    smtp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SMTP",
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["hard", "soft"],
      required: true,
      default: "soft",
      index: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    smtpResponse: {
      type: String,
      default: "",
      trim: true,
    },

    responseCode: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: [
        "gmail",
        "outlook",
        "hotmail",
        "yahoo",
        "zoho",
        "amazon_ses",
        "sendgrid",
        "mailgun",
        "brevo",
        "mailjet",
        "postmark",
        "custom",
      ],
      default: "custom",
    },

    status: {
      type: String,
      enum: ["pending", "processed", "retrying", "resolved"],
      default: "pending",
      index: true,
    },

    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    canRetry: {
      type: Boolean,
      default: true,
    },

    bouncedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
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
 * Compound Indexes
 */

bounceSchema.index({ campaign: 1, email: 1 });
bounceSchema.index({ smtp: 1, type: 1 });
bounceSchema.index({ user: 1, bouncedAt: -1 });
bounceSchema.index({ provider: 1, bouncedAt: -1 });

/**
 * Instance Methods
 */

bounceSchema.methods.incrementRetry = async function () {
  this.retryCount += 1;

  if (this.retryCount >= 3) {
    this.canRetry = false;
    this.status = "resolved";
  }

  return this.save();
};

/**
 * Static Methods
 */

bounceSchema.statics.getHardBounceCount = function () {
  return this.countDocuments({
    type: "hard",
  });
};

bounceSchema.statics.getSoftBounceCount = function () {
  return this.countDocuments({
    type: "soft",
  });
};

bounceSchema.statics.getBounceRate = async function (totalSent = 1) {
  const totalBounce = await this.countDocuments();

  return Number(((totalBounce / totalSent) * 100).toFixed(2));
};

const Bounce = mongoose.model("Bounce", bounceSchema);

export default Bounce;
