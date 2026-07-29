import Setting from "../models/Setting.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Create Settings
 * POST /api/settings
 */
export const createSettings = asyncHandler(async (req, res) => {
  const existing = await Setting.findOne({
    user: req.user._id,
  });

  if (existing) {
    throw new ApiError(400, "Settings already exist");
  }

  const setting = await Setting.create({
    ...req.body,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, setting, "Settings created successfully"));
});

/**
 * Get Current User Settings
 * GET /api/settings/me
 */
export const getMySettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findOne({
    user: req.user._id,
  });

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  return res.json(
    new ApiResponse(200, setting, "Settings fetched successfully"),
  );
});

/**
 * Get Settings By ID
 * GET /api/settings/:id
 */
export const getSetting = asyncHandler(async (req, res) => {
  const setting = await Setting.findById(req.params.id);

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  return res.json(
    new ApiResponse(200, setting, "Settings fetched successfully"),
  );
});

/**
 * Update Settings
 * PUT /api/settings/:id
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findById(req.params.id);

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  Object.assign(setting, req.body);

  await setting.save();

  return res.json(
    new ApiResponse(200, setting, "Settings updated successfully"),
  );
});

/**
 * Delete Settings
 * DELETE /api/settings/:id
 */
export const deleteSettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findById(req.params.id);

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  await setting.deleteOne();

  return res.json(new ApiResponse(200, null, "Settings deleted successfully"));
});

/**
 * Update SMTP Settings
 * PUT /api/settings/:id/smtp
 */
export const updateSMTPSettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findById(req.params.id);

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  setting.defaultSMTP = req.body.defaultSMTP ?? setting.defaultSMTP;

  await setting.save();

  return res.json(
    new ApiResponse(200, setting, "SMTP settings updated successfully"),
  );
});

/**
 * Update Warmup Settings
 * PUT /api/settings/:id/warmup
 */
export const updateWarmupSettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findById(req.params.id);

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  if (req.body.warmupEnabled !== undefined) {
    setting.warmupEnabled = req.body.warmupEnabled;
  }

  if (req.body.warmupStartLimit !== undefined) {
    setting.warmupStartLimit = req.body.warmupStartLimit;
  }

  if (req.body.warmupIncreasePerDay !== undefined) {
    setting.warmupIncreasePerDay = req.body.warmupIncreasePerDay;
  }

  await setting.save();

  return res.json(
    new ApiResponse(200, setting, "Warmup settings updated successfully"),
  );
});

/**
 * Update Tracking Settings
 * PUT /api/settings/:id/tracking
 */
export const updateTrackingSettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findById(req.params.id);

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  if (req.body.openTracking !== undefined) {
    setting.openTracking = req.body.openTracking;
  }

  if (req.body.clickTracking !== undefined) {
    setting.clickTracking = req.body.clickTracking;
  }

  if (req.body.unsubscribeTracking !== undefined) {
    setting.unsubscribeTracking = req.body.unsubscribeTracking;
  }

  await setting.save();

  return res.json(
    new ApiResponse(200, setting, "Tracking settings updated successfully"),
  );
});

/**
 * Update Queue Settings
 * PUT /api/settings/:id/queue
 */
export const updateQueueSettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findById(req.params.id);

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  if (req.body.queueEnabled !== undefined) {
    setting.queueEnabled = req.body.queueEnabled;
  }

  if (req.body.queueConcurrency !== undefined) {
    setting.queueConcurrency = req.body.queueConcurrency;
  }

  if (req.body.retryAttempts !== undefined) {
    setting.retryAttempts = req.body.retryAttempts;
  }

  if (req.body.retryDelay !== undefined) {
    setting.retryDelay = req.body.retryDelay;
  }

  await setting.save();

  return res.json(
    new ApiResponse(200, setting, "Queue settings updated successfully"),
  );
});

/**
 * Update Security Settings
 * PUT /api/settings/:id/security
 */
export const updateSecuritySettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findById(req.params.id);

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  if (req.body.twoFactorAuth !== undefined) {
    setting.twoFactorAuth = req.body.twoFactorAuth;
  }

  if (req.body.loginAlerts !== undefined) {
    setting.loginAlerts = req.body.loginAlerts;
  }

  await setting.save();

  return res.json(
    new ApiResponse(200, setting, "Security settings updated successfully"),
  );
});

/**
 * Settings Summary
 * GET /api/settings/summary
 */
export const settingsSummary = asyncHandler(async (req, res) => {
  const setting = await Setting.findOne({
    user: req.user._id,
  });

  if (!setting) {
    throw new ApiError(404, "Settings not found");
  }

  const summary = {
    appName: setting.appName,
    timezone: setting.timezone,
    language: setting.language,
    queueEnabled: setting.queueEnabled,
    warmupEnabled: setting.warmupEnabled,
    analyticsEnabled: setting.analyticsEnabled,
    apiEnabled: setting.apiEnabled,
    tracking: {
      open: setting.openTracking,
      click: setting.clickTracking,
      unsubscribe: setting.unsubscribeTracking,
    },
  };

  return res.json(
    new ApiResponse(200, summary, "Settings summary fetched successfully"),
  );
});
