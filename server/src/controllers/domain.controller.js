import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as domainService from "../services/domain.service.js";

export const createDomain = asyncHandler(async (req, res) => {
  const domain = await domainService.addDomain(req.body);
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        domain,
        "Domain added. Please configure DNS records and verify.",
      ),
    );
});

export const getDomains = asyncHandler(async (req, res) => {
  const domains = await domainService.listDomains();
  res.status(200).json(new ApiResponse(200, domains));
});

export const verifyDomain = asyncHandler(async (req, res) => {
  const { domain, report } = await domainService.verifyDomain(req.params.id);
  res
    .status(200)
    .json(
      new ApiResponse(200, { domain, report }, "Verification check complete"),
    );
});

export const setDefaultDomain = asyncHandler(async (req, res) => {
  const domain = await domainService.setDefaultDomain(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, domain, "Default sending domain updated"));
});
