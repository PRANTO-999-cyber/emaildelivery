import asyncHandler from "../middlewares/asyncHandler.js";

// ======================================================
// Generic Webhook
// ======================================================

export const receiveWebhook = asyncHandler(async (req, res) => {
  console.log("Webhook:", req.body);

  return res.status(200).json({
    success: true,
    message: "Webhook received",
  });
});

// ======================================================
// SendGrid Event Webhook
// ======================================================

export const sendgridEventWebhook = asyncHandler(async (req, res) => {
  const events = req.body;

  console.log("SendGrid Events:");
  console.log(events);

  // TODO:
  // - Update EmailLog
  // - Update Campaign stats
  // - Process bounce/spam/open/click

  return res.status(200).json({
    success: true,
    received: Array.isArray(events) ? events.length : 1,
  });
});

// ======================================================
// Mailgun Webhook
// ======================================================

export const mailgunWebhook = asyncHandler(async (req, res) => {
  console.log(req.body);

  return res.status(200).json({
    success: true,
  });
});

// ======================================================
// Amazon SES Webhook
// ======================================================

export const sesWebhook = asyncHandler(async (req, res) => {
  console.log(req.body);

  return res.status(200).json({
    success: true,
  });
});

// ======================================================
// Webhook Logs
// ======================================================

export const getWebhookLogs = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

// ======================================================
// Get Webhook
// ======================================================

export const getWebhookById = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {},
  });
});

// ======================================================
// Delete Webhook
// ======================================================

export const deleteWebhook = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Webhook deleted",
  });
});

// ======================================================
// Verify Webhook
// ======================================================

export const verifyWebhook = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    verified: true,
  });
});
