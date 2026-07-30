import crypto from "node:crypto";
import Contact from "../models/Contact.js";

export const generateUnsubscribeToken = () =>
  crypto.randomBytes(24).toString("hex");

export const buildUnsubscribeUrl = (baseUrl, token) =>
  `${baseUrl}/api/v1/public/unsubscribe/${token}`;

export const unsubscribeContact = async (token) => {
  const contact = await Contact.findOneAndUpdate(
    { unsubscribeToken: token },
    { status: "unsubscribed", unsubscribedAt: new Date() },
    { new: true },
  );
  return contact;
};

export const recordEngagement = async (contactId, type) => {
  const increment = type === "click" ? 3 : type === "open" ? 1 : 0;
  if (!increment) return;

  await Contact.findByIdAndUpdate(contactId, {
    $inc: { engagementScore: increment },
    $set: { lastEngagedAt: new Date() },
  });
};
