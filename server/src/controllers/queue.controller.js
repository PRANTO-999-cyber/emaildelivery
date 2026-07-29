import Queue from "../models/Queue.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Create Queue Job
 * POST /api/queue
 */
export const createQueueJob = asyncHandler(async (req, res) => {
  const job = await Queue.create({
    ...req.body,
    createdBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, job, "Queue job created successfully"));
});

/**
 * Get Queue Jobs
 * GET /api/queue
 */
export const getQueueJobs = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const status = req.query.status;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  const total = await Queue.countDocuments(filter);

  const jobs = await Queue.find(filter)
    .populate("campaign", "name")
    .populate("smtp", "name provider")
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
        jobs,
      },
      "Queue fetched successfully",
    ),
  );
});

/**
 * Get Single Queue Job
 * GET /api/queue/:id
 */
export const getQueueJob = asyncHandler(async (req, res) => {
  const job = await Queue.findById(req.params.id)
    .populate("campaign")
    .populate("smtp")
    .populate("createdBy", "firstName lastName email");

  if (!job) {
    throw new ApiError(404, "Queue job not found");
  }

  return res.json(new ApiResponse(200, job, "Queue job fetched successfully"));
});

/**
 * Update Queue Job
 * PUT /api/queue/:id
 */
export const updateQueueJob = asyncHandler(async (req, res) => {
  const job = await Queue.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Queue job not found");
  }

  Object.assign(job, req.body);

  await job.save();

  return res.json(new ApiResponse(200, job, "Queue job updated successfully"));
});

/**
 * Delete Queue Job
 * DELETE /api/queue/:id
 */
export const deleteQueueJob = asyncHandler(async (req, res) => {
  const job = await Queue.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Queue job not found");
  }

  await job.deleteOne();

  return res.json(new ApiResponse(200, null, "Queue job deleted successfully"));
});

/**
 * Retry Queue Job
 * POST /api/queue/:id/retry
 */
export const retryQueueJob = asyncHandler(async (req, res) => {
  const job = await Queue.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Queue job not found");
  }

  job.status = "pending";
  job.retryCount = (job.retryCount || 0) + 1;
  job.lastError = "";
  job.processedAt = null;

  await job.save();

  return res.json(new ApiResponse(200, job, "Queue job scheduled for retry"));
});

/**
 * Cancel Queue Job
 * POST /api/queue/:id/cancel
 */
export const cancelQueueJob = asyncHandler(async (req, res) => {
  const job = await Queue.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Queue job not found");
  }

  job.status = "cancelled";

  await job.save();

  return res.json(new ApiResponse(200, job, "Queue job cancelled"));
});

/**
 * Queue Statistics
 * GET /api/queue/stats
 */
export const queueStats = asyncHandler(async (req, res) => {
  const [total, pending, processing, completed, failed, cancelled] =
    await Promise.all([
      Queue.countDocuments(),
      Queue.countDocuments({ status: "pending" }),
      Queue.countDocuments({ status: "processing" }),
      Queue.countDocuments({ status: "completed" }),
      Queue.countDocuments({ status: "failed" }),
      Queue.countDocuments({ status: "cancelled" }),
    ]);

  return res.json(
    new ApiResponse(
      200,
      {
        total,
        pending,
        processing,
        completed,
        failed,
        cancelled,
      },
      "Queue statistics",
    ),
  );
});

/**
 * Clear Completed Jobs
 * DELETE /api/queue/completed
 */
export const clearCompletedJobs = asyncHandler(async (req, res) => {
  const result = await Queue.deleteMany({
    status: "completed",
  });

  return res.json(
    new ApiResponse(
      200,
      {
        deletedCount: result.deletedCount,
      },
      "Completed jobs removed",
    ),
  );
});
