import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
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
     * Contact Lists
     */

    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContactList",
      },
    ],

    /**
     * Basic Information
     */

    firstName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    jobTitle: {
      type: String,
      trim: true,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    /**
     * Address
     */

    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    /**
     * Tags
     */

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    /**
     * Status
     */

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "unsubscribed",
        "bounced",
        "complained",
        "blocked",
      ],
      default: "active",
      index: true,
    },

    /**
     * Subscription
     */

    subscribed: {
      type: Boolean,
      default: true,
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },

    unsubscribedAt: Date,

    /**
     * Bounce
     */

    bounceCount: {
      type: Number,
      default: 0,
    },

    hardBounce: {
      type: Boolean,
      default: false,
    },

    complaintCount: {
      type: Number,
      default: 0,
    },

    /**
     * Engagement
     */

    totalSent: {
      type: Number,
      default: 0,
    },

    totalOpened: {
      type: Number,
      default: 0,
    },

    totalClicked: {
      type: Number,
      default: 0,
    },

    lastSentAt: Date,

    lastOpenedAt: Date,

    lastClickedAt: Date,

    /**
     * Source
     */

    source: {
      type: String,
      enum: ["manual", "csv", "api", "form", "import"],
      default: "manual",
    },

    /**
     * Custom Fields
     */

    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /**
     * Notes
     */

    notes: {
      type: String,
      default: "",
    },

    /**
     * Verification
     */

    emailVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["unknown", "valid", "invalid", "catch-all", "risky"],
      default: "unknown",
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
 * Virtual
 */

contactSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

/**
 * Compound Indexes
 */

contactSchema.index({ user: 1, email: 1 }, { unique: true });

contactSchema.index({ user: 1, status: 1 });

contactSchema.index({ tags: 1 });

contactSchema.index({ createdAt: -1 });

contactSchema.index({
  firstName: "text",
  lastName: "text",
  email: "text",
  company: "text",
});

/**
 * Instance Methods
 */

contactSchema.methods.incrementSent = async function () {
  this.totalSent += 1;
  this.lastSentAt = new Date();
  return this.save();
};

contactSchema.methods.incrementOpen = async function () {
  this.totalOpened += 1;
  this.lastOpenedAt = new Date();
  return this.save();
};

contactSchema.methods.incrementClick = async function () {
  this.totalClicked += 1;
  this.lastClickedAt = new Date();
  return this.save();
};

contactSchema.methods.markBounce = async function (hard = false) {
  this.bounceCount += 1;

  if (hard) {
    this.hardBounce = true;
    this.status = "bounced";
  }

  return this.save();
};

contactSchema.methods.unsubscribe = async function () {
  this.subscribed = false;
  this.status = "unsubscribed";
  this.unsubscribedAt = new Date();

  return this.save();
};

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
