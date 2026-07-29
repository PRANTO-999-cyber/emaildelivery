import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    /**
     * Role Name
     * admin
     * manager
     * sender
     * support
     * user
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
      maxlength: 100,
    },

    /**
     * Description
     */

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    /**
     * Permissions
     */

    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],

    /**
     * Default Role
     */

    isDefault: {
      type: Boolean,
      default: false,
    },

    /**
     * System Role
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
     * Priority
     * Higher priority = more privileges
     */

    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
      index: true,
    },

    /**
     * Color (UI)
     */

    color: {
      type: String,
      default: "#2563EB",
    },

    /**
     * Icon (UI)
     */

    icon: {
      type: String,
      default: "Shield",
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
 * ===========================================
 * Indexes
 * ===========================================
 */

roleSchema.index({
  name: 1,
});

roleSchema.index({
  isActive: 1,
});

roleSchema.index({
  priority: -1,
});

roleSchema.index({
  displayName: "text",
  description: "text",
});

/**
 * ===========================================
 * Instance Methods
 * ===========================================
 */

roleSchema.methods.hasPermission = function (permissionId) {
  return this.permissions.some(
    (permission) => permission.toString() === permissionId.toString(),
  );
};

roleSchema.methods.addPermission = async function (permissionId) {
  const exists = this.permissions.some(
    (permission) => permission.toString() === permissionId.toString(),
  );

  if (!exists) {
    this.permissions.push(permissionId);
    await this.save();
  }

  return this;
};

roleSchema.methods.removePermission = async function (permissionId) {
  this.permissions = this.permissions.filter(
    (permission) => permission.toString() !== permissionId.toString(),
  );

  await this.save();

  return this;
};

roleSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();

  await this.save();

  return this;
};

roleSchema.methods.restore = async function () {
  this.isDeleted = false;
  this.deletedAt = null;

  await this.save();

  return this;
};

/**
 * ===========================================
 * Static Methods
 * ===========================================
 */

roleSchema.statics.getDefaultRole = function () {
  return this.findOne({
    isDefault: true,
    isDeleted: false,
    isActive: true,
  }).populate("permissions");
};

roleSchema.statics.getSystemRoles = function () {
  return this.find({
    isSystem: true,
    isDeleted: false,
  }).populate("permissions");
};

roleSchema.statics.getActiveRoles = function () {
  return this.find({
    isActive: true,
    isDeleted: false,
  }).populate("permissions");
};

const Role = mongoose.model("Role", roleSchema);

export default Role;
