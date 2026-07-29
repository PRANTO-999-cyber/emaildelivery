import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Contact from "../models/Contact.js";
import ContactGroup from "../models/ContactGroup.js";
import { generateUnsubscribeToken } from "../services/tracking.service.js";

export const createContact = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, groups, consentSource } = req.body;

  if (!consentSource) {
    throw new ApiError(
      400,
      "consentSource is required to record how this contact opted in",
    );
  }

  const contact = await Contact.create({
    email,
    firstName,
    lastName,
    groups,
    consent: {
      given: true,
      source: consentSource,
      givenAt: new Date(),
      ipAddress: req.ip,
    },
    unsubscribeToken: generateUnsubscribeToken(),
  });

  if (groups?.length) {
    await ContactGroup.updateMany(
      { _id: { $in: groups } },
      { $inc: { contactCount: 1 } },
    );
  }

  res.status(201).json(new ApiResponse(201, contact, "Contact added"));
});

export const getContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, groupId, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (groupId) filter.groups = groupId;
  if (search) filter.email = { $regex: search, $options: "i" };

  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Contact.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(200, {
      contacts,
      total,
      page: Number(page),
      limit: Number(limit),
    }),
  );
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) throw new ApiError(404, "Contact not found");
  res.status(200).json(new ApiResponse(200, null, "Contact deleted"));
});

export const createGroup = asyncHandler(async (req, res) => {
  const group = await ContactGroup.create(req.body);
  res.status(201).json(new ApiResponse(201, group, "Group created"));
});

export const getGroups = asyncHandler(async (req, res) => {
  const groups = await ContactGroup.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, groups));
});
