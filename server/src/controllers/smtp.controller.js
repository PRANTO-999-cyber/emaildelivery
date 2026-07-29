import nodemailer from "nodemailer";
import SMTP from "../models/SMTP.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Create SMTP
 * POST /api/smtp
 */
export const createSMTP = asyncHandler(async (req, res) => {
  const smtp = await SMTP.create({
    ...req.body,
    user: req.user._id,
    tenant: req.user.tenant,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, smtp, "SMTP created successfully"));
});

/**
 * Get SMTP List
 * GET /api/smtp
 */
export const getSMTPs = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const status = req.query.status || "";
  const provider = req.query.provider || "";
  const search = req.query.search || "";

  const filter = {
    tenant: req.user.tenant,
    isDeleted: false,
  };

  if (status) filter.status = status;
  if (provider) filter.provider = provider;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { fromEmail: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
    ];
  }

  const total = await SMTP.countDocuments(filter);

  const smtps = await SMTP.find(filter)
    .select("-password")
    .populate("domain", "domain")
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
        smtps,
      },
      "SMTP accounts fetched successfully",
    ),
  );
});

/**
 * Get Single SMTP
 * GET /api/smtp/:id
 */
export const getSMTP = asyncHandler(async (req, res) => {
  const smtp = await SMTP.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
    isDeleted: false,
  })
    .select("-password")
    .populate("domain");

  if (!smtp) {
    throw new ApiError(404, "SMTP account not found");
  }

  return res.json(
    new ApiResponse(200, smtp, "SMTP account fetched successfully"),
  );
});

/**
 * Update SMTP
 * PUT /api/smtp/:id
 */
export const updateSMTP = asyncHandler(async (req, res) => {
  const smtp = await SMTP.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
    isDeleted: false,
  }).select("+password");

  if (!smtp) {
    throw new ApiError(404, "SMTP account not found");
  }

  Object.assign(smtp, req.body);

  await smtp.save();

  smtp.password = undefined;

  return res.json(new ApiResponse(200, smtp, "SMTP updated successfully"));
});

/**
 * Delete SMTP (Soft Delete)
 * DELETE /api/smtp/:id
 */
export const deleteSMTP = asyncHandler(async (req, res) => {
  const smtp = await SMTP.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
    isDeleted: false,
  });

  if (!smtp) {
    throw new ApiError(404, "SMTP account not found");
  }

  smtp.isDeleted = true;
  smtp.deletedAt = new Date();

  await smtp.save();

  return res.json(new ApiResponse(200, null, "SMTP deleted successfully"));
});

/**
 * Test SMTP Connection
 * POST /api/smtp/:id/test
 */
export const testSMTP = asyncHandler(async (req, res) => {
  const smtp = await SMTP.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
    isDeleted: false,
  }).select("+password");

  if (!smtp) {
    throw new ApiError(404, "SMTP account not found");
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.username,
      pass: smtp.password,
    },
  });

  try {
    await transporter.verify();

    smtp.lastConnectionAt = new Date();
    await smtp.save();

    return res.json(
      new ApiResponse(
        200,
        {
          connected: true,
        },
        "SMTP connection successful",
      ),
    );
  } catch (error) {
    smtp.lastError = error.message;
    await smtp.save();

    throw new ApiError(400, "SMTP connection failed", error.message);
  }
});

/**
 * Mark SMTP Verified
 * POST /api/smtp/:id/verify
 */
export const verifySMTP = asyncHandler(async (req, res) => {
  const smtp = await SMTP.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
    isDeleted: false,
  });

  if (!smtp) {
    throw new ApiError(404, "SMTP account not found");
  }

  smtp.isVerified = true;
  smtp.verifiedAt = new Date();

  await smtp.save();

  return res.json(new ApiResponse(200, smtp, "SMTP marked as verified"));
});

/**
 * Activate SMTP
 * POST /api/smtp/:id/activate
 */
export const activateSMTP = asyncHandler(async (req, res) => {
  const smtp = await SMTP.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
    isDeleted: false,
  });

  if (!smtp) {
    throw new ApiError(404, "SMTP account not found");
  }

  smtp.status = "active";

  await smtp.save();

  return res.json(new ApiResponse(200, smtp, "SMTP activated successfully"));
});

/**
 * Deactivate SMTP
 * POST /api/smtp/:id/deactivate
 */
export const deactivateSMTP = asyncHandler(async (req, res) => {
  const smtp = await SMTP.findOne({
    _id: req.params.id,
    tenant: req.user.tenant,
    isDeleted: false,
  });

  if (!smtp) {
    throw new ApiError(404, "SMTP account not found");
  }

  smtp.status = "inactive";

  await smtp.save();

  return res.json(new ApiResponse(200, smtp, "SMTP deactivated successfully"));
});

/**
 * SMTP Statistics
 * GET /api/smtp/stats
 */
export const smtpStats = asyncHandler(async (req, res) => {
  const filter = {
    tenant: req.user.tenant,
    isDeleted: false,
  };

  const [total, active, inactive, verified, warming] = await Promise.all([
    SMTP.countDocuments(filter),
    SMTP.countDocuments({
      ...filter,
      status: "active",
    }),
    SMTP.countDocuments({
      ...filter,
      status: "inactive",
    }),
    SMTP.countDocuments({
      ...filter,
      isVerified: true,
    }),
    SMTP.countDocuments({
      ...filter,
      status: "warming",
    }),
  ]);

  return res.json(
    new ApiResponse(
      200,
      {
        total,
        active,
        inactive,
        verified,
        warming,
      },
      "SMTP statistics fetched successfully",
    ),
  );
});
