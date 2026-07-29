import Report from "../models/Report.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Create Report
 * POST /api/reports
 */
export const createReport = asyncHandler(async (req, res) => {
  const report = await Report.create({
    ...req.body,
    createdBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, report, "Report created successfully"));
});

/**
 * Get All Reports
 * GET /api/reports
 */
export const getReports = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const type = req.query.type || "";
  const status = req.query.status || "";

  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (type) {
    filter.type = type;
  }

  if (status) {
    filter.status = status;
  }

  const total = await Report.countDocuments(filter);

  const reports = await Report.find(filter)
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
        reports,
      },
      "Reports fetched successfully",
    ),
  );
});

/**
 * Get Single Report
 * GET /api/reports/:id
 */
export const getReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id).populate(
    "createdBy",
    "firstName lastName email",
  );

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  return res.json(new ApiResponse(200, report, "Report fetched successfully"));
});

/**
 * Update Report
 * PUT /api/reports/:id
 */
export const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  Object.assign(report, req.body);

  await report.save();

  return res.json(new ApiResponse(200, report, "Report updated successfully"));
});

/**
 * Delete Report
 * DELETE /api/reports/:id
 */
export const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  await report.deleteOne();

  return res.json(new ApiResponse(200, null, "Report deleted successfully"));
});

/**
 * Generate Report
 * POST /api/reports/:id/generate
 */
export const generateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  report.status = "completed";
  report.generatedAt = new Date();

  await report.save();

  return res.json(
    new ApiResponse(200, report, "Report generated successfully"),
  );
});

/**
 * Download Report Metadata
 * GET /api/reports/:id/download
 */
export const downloadReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  return res.json(
    new ApiResponse(
      200,
      {
        id: report._id,
        name: report.name,
        format: report.format,
        downloadUrl: report.fileUrl || null,
      },
      "Report download information",
    ),
  );
});

/**
 * Report Statistics
 * GET /api/reports/stats
 */
export const reportStats = asyncHandler(async (req, res) => {
  const [total, pending, completed, failed] = await Promise.all([
    Report.countDocuments(),
    Report.countDocuments({
      status: "pending",
    }),
    Report.countDocuments({
      status: "completed",
    }),
    Report.countDocuments({
      status: "failed",
    }),
  ]);

  return res.json(
    new ApiResponse(
      200,
      {
        total,
        pending,
        completed,
        failed,
      },
      "Report statistics",
    ),
  );
});
