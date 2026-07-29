import mongoose from "mongoose";

const contactGroupSchema = new mongoose.Schema(
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
     * Basic Information
     */
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    /**
     * Group Type
     */
    type: {
      type: String,
      enum: ["static", "dynamic"],
      default: "static",
      index: true,
    },

    /**
     * Contacts
     */
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
      },
    ],

    contactCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /**
     * Dynamic Filter (optional)
     */
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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
     * UI
     */
    color: {
      type: String,
      default: "#2563EB",
    },

    icon: {
      type: String,
      default: "Users",
    },

    /**
     * Statistics
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

    /**
     * Status
     */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
    },

    /**
     * Notes
     */
    notes: {
      type: String,
      default: "",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

/**
 * Virtual
 */

contactGroupSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

/**
 * Indexes
 */

contactGroupSchema.index(
  {
    user: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

contactGroupSchema.index({
  user: 1,
  createdAt: -1,
});

contactGroupSchema.index({
  tags: 1,
});

contactGroupSchema.index({
  name: "text",
  description: "text",
});

/**
 * Middleware
 */

contactGroupSchema.pre("save", function (next) {
  this.contactCount = this.contacts.length;
  next();
});

/**
 * Instance Methods
 */

contactGroupSchema.methods.addContact = async function (contactId) {
  if (!this.contacts.includes(contactId)) {
    this.contacts.push(contactId);
    this.contactCount = this.contacts.length;
    await this.save();
  }

  return this;
};

contactGroupSchema.methods.removeContact = async function (contactId) {
  this.contacts = this.contacts.filter(
    (id) => id.toString() !== contactId.toString(),
  );

  this.contactCount = this.contacts.length;

  await this.save();

  return this;
};

contactGroupSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();

  await this.save();

  return this;
};

const ContactGroup = mongoose.model("ContactGroup", contactGroupSchema);

export default ContactGroup;
