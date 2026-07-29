import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    /**
     * Permission Name
     * Example:
     * campaign.create
     * campaign.read
     * smtp.update
     */

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    /**
     * Display Name
     */

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Module
     */

    module: {
      type: String,
      required: true,
      enum: [
        "dashboard",
        "user",
        "role",
        "permission",
        "campaign",
        "contact",
        "contactGroup",
        "template",
        "smtp",
        "domain",
        "warmup",
        "tracking",
        "analytics",
        "report",
        "queue",
        "webhook",
        "setting",
      ],
      index: true,
    },

    /**
     * Action
     */

    action: {
      type: String,
      required: true,
      enum: [
        "create",
        "read",
        "update",
        "delete",
        "view",
        "import",
        "export",
        "send",
        "pause",
        "resume",
        "verify",
        "approve",
        "reject",
        "manage",
      ],
    },

    /**
     * Resource
     */

    resource: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Description
     */

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * System Permission
     */

    isSystem: {
      type: Boolean,
      default: false,
    },

    /**
     * Active
     */

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /**
     * Sort Order
     */

    sortOrder: {
      type: Number,
      default: 0,
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
 * ============================
 * Indexes
 * ============================
 */

permissionSchema.index({ module: 1, action: 1 });

permissionSchema.index({ module: 1 });

permissionSchema.index({ action: 1 });

permissionSchema.index({
  displayName: "text",
  description: "text",
});

/**
 * ============================
 * Instance Methods
 * ============================
 */

permissionSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

permissionSchema.methods.restore = async function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

/**
 * ============================
 * Static Methods
 * ============================
 */

permissionSchema.statics.findByModule = function (module) {
  return this.find({
    module,
    isDeleted: false,
    isActive: true,
  });
};

permissionSchema.statics.findByAction = function (action) {
  return this.find({
    action,
    isDeleted: false,
    isActive: true,
  });
};

permissionSchema.statics.findActive = function () {
  return this.find({
    isDeleted: false,
    isActive: true,
  });
};

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
