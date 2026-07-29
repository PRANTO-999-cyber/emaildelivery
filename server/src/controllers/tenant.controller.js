import Tenant from "../models/Tenant.js";
import User from "../models/User.js";
import SMTP from "../models/SMTP.js";
import Domain from "../models/Domain.js";
import Campaign from "../models/Campaign.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Create Tenant
 * POST /api/tenants
 */
export const createTenant = asyncHandler(async (req, res) => {
  const {
    name,
    company,
    email,
    phone,
    website,
    logo,
    address,
    timezone,
    plan,
  } = req.body;

  const exists = await Tenant.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });

  if (exists) {
    throw new ApiError(409, "Tenant already exists");
  }

  const tenant = await Tenant.create({
    name,
    company,
    email,
    phone,
    website,
    logo,
    address,
    timezone,
    plan,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tenant, "Tenant created successfully"));
});

/**
 * Get All Tenants
 * GET /api/tenants
 */
export const getTenants = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status || "";

  const filter = {
    isDeleted: false,
  };

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        company: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const total = await Tenant.countDocuments(filter);

  const tenants = await Tenant.find(filter)
    .populate("createdBy", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return res.json(
    new ApiResponse(
      200,
      {
        total,
        page,
        pages: Math.ceil(total / limit),
        tenants,
      },
      "Tenants fetched successfully",
    ),
  );
});

/**
 * Get Tenant
 * GET /api/tenants/:id
 */
export const getTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).populate("createdBy", "firstName lastName email");

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  return res.json(new ApiResponse(200, tenant, "Tenant fetched successfully"));
});

/**
 * Update Tenant
 * PUT /api/tenants/:id
 */
export const updateTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  Object.assign(tenant, req.body);

  await tenant.save();

  return res.json(new ApiResponse(200, tenant, "Tenant updated successfully"));
});

/**
 * Delete Tenant (Soft Delete)
 * DELETE /api/tenants/:id
 */
export const deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  tenant.isDeleted = true;
  tenant.deletedAt = new Date();

  await tenant.save();

  return res.json(new ApiResponse(200, null, "Tenant deleted successfully"));
});

/**
 * Activate Tenant
 * POST /api/tenants/:id/activate
 */
export const activateTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  tenant.status = "active";

  await tenant.save();

  return res.json(
    new ApiResponse(200, tenant, "Tenant activated successfully"),
  );
});

/**
 * Suspend Tenant
 * POST /api/tenants/:id/suspend
 */
export const suspendTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  tenant.status = "suspended";

  await tenant.save();

  return res.json(
    new ApiResponse(200, tenant, "Tenant suspended successfully"),
  );
});

/**
 * Verify Tenant
 * POST /api/tenants/:id/verify
 */
export const verifyTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  tenant.isVerified = true;
  tenant.verifiedAt = new Date();

  await tenant.save();

  return res.json(new ApiResponse(200, tenant, "Tenant verified successfully"));
});

/**
 * Tenant Dashboard
 * GET /api/tenants/:id/dashboard
 */
export const tenantDashboard = asyncHandler(async (req, res) => {
  const tenantId = req.params.id;

  const [users, smtpAccounts, domains, campaigns] = await Promise.all([
    User.countDocuments({
      tenant: tenantId,
      isDeleted: false,
    }),
    SMTP.countDocuments({
      tenant: tenantId,
      isDeleted: false,
    }),
    Domain.countDocuments({
      tenant: tenantId,
      isDeleted: false,
    }),
    Campaign.countDocuments({
      tenant: tenantId,
      isDeleted: false,
    }),
  ]);

  return res.json(
    new ApiResponse(
      200,
      {
        users,
        smtpAccounts,
        domains,
        campaigns,
      },
      "Tenant dashboard",
    ),
  );
});

/**
 * Tenant Statistics
 * GET /api/tenants/stats
 */
export const tenantStats = asyncHandler(async (req, res) => {
  const [total, active, suspended, verified] = await Promise.all([
    Tenant.countDocuments({
      isDeleted: false,
    }),
    Tenant.countDocuments({
      status: "active",
      isDeleted: false,
    }),
    Tenant.countDocuments({
      status: "suspended",
      isDeleted: false,
    }),
    Tenant.countDocuments({
      isVerified: true,
      isDeleted: false,
    }),
  ]);

  return res.json(
    new ApiResponse(
      200,
      {
        total,
        active,
        suspended,
        verified,
      },
      "Tenant statistics fetched successfully",
    ),
  );
});
