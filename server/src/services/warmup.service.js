import Warmup from "../models/Warmup.js";

export const createWarmupService = async (payload, userId) => {
  return await Warmup.create({
    ...payload,
    createdBy: userId,
  });
};

export const getWarmupsService = async (filter, page = 1, limit = 10) => {
  const total = await Warmup.countDocuments(filter);

  const warmups = await Warmup.find(filter)
    .populate("smtp", "host username")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    warmups,
  };
};

export const getWarmupByIdService = async (id) => {
  return await Warmup.findById(id)
    .populate("smtp")
    .populate("createdBy", "name email");
};

export const updateWarmupService = async (id, payload) => {
  const warmup = await Warmup.findById(id);

  if (!warmup) return null;

  Object.assign(warmup, payload);

  return await warmup.save();
};

export const deleteWarmupService = async (id) => {
  const warmup = await Warmup.findById(id);

  if (!warmup) return null;

  await warmup.deleteOne();

  return warmup;
};

export const changeWarmupStatusService = async (id, status) => {
  const warmup = await Warmup.findById(id);

  if (!warmup) return null;

  warmup.status = status;

  if (status === "running") {
    warmup.startedAt = new Date();
  }

  return await warmup.save();
};

export const getWarmupStatsService = async () => {
  return {
    total: await Warmup.countDocuments(),
    running: await Warmup.countDocuments({ status: "running" }),
    paused: await Warmup.countDocuments({ status: "paused" }),
    stopped: await Warmup.countDocuments({ status: "stopped" }),
  };
};
