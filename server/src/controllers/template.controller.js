import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Template from "../models/Template.js";

export const createTemplate = asyncHandler(async (req, res) => {
  const template = await Template.create(req.body);
  res.status(201).json(new ApiResponse(201, template, "Template created"));
});

export const getTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, templates));
});

export const getTemplateById = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) throw new ApiError(404, "Template not found");
  res.status(200).json(new ApiResponse(200, template));
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!template) throw new ApiError(404, "Template not found");
  res.status(200).json(new ApiResponse(200, template, "Template updated"));
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findByIdAndDelete(req.params.id);
  if (!template) throw new ApiError(404, "Template not found");
  res.status(200).json(new ApiResponse(200, null, "Template deleted"));
});
