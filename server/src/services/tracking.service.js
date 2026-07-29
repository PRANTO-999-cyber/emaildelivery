import crypto from "crypto";
import jwt from "jsonwebtoken";
import Contact from "../models/Contact.js";

/* ===========================================================
   Tracking Tokens
=========================================================== */

export const generateTrackingToken = (trackingId) => {
  return jwt.sign(
    {
      trackingId,
      type: "tracking",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

export const verifyTrackingToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/* ===========================================================
   Unsubscribe Tokens
=========================================================== */

export const generateUnsubscribeToken = (contactId) => {
  return jwt.sign(
    {
      contactId,
      type: "unsubscribe",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "365d",
    },
  );
};

export const verifyUnsubscribeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/* ===========================================================
   Unsubscribe Contact
=========================================================== */

export const unsubscribeContact = async (token) => {
  const payload = verifyUnsubscribeToken(token);

  if (!payload?.contactId) {
    throw new Error("Invalid unsubscribe token");
  }

  const contact = await Contact.findById(payload.contactId);

  if (!contact) {
    throw new Error("Contact not found");
  }

  contact.subscribed = false;
  contact.unsubscribedAt = new Date();

  await contact.save();

  return contact;
};

/* ===========================================================
   Click Tracking
=========================================================== */

export const generateClickToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/* ===========================================================
   Open Tracking Pixel
=========================================================== */

export const generateOpenPixel = () => {
  return Buffer.from(
    "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    "base64",
  );
};

/* ===========================================================
   Tracking URL
=========================================================== */

export const buildTrackingUrl = (baseUrl, token) => {
  return `${baseUrl}/track/${token}`;
};

/* ===========================================================
   Unsubscribe URL
=========================================================== */

export const buildUnsubscribeUrl = (baseUrl, token) => {
  return `${baseUrl}/unsubscribe/${token}`;
};

export default {
  generateTrackingToken,
  verifyTrackingToken,
  generateUnsubscribeToken,
  verifyUnsubscribeToken,
  unsubscribeContact,
  generateClickToken,
  generateOpenPixel,
  buildTrackingUrl,
  buildUnsubscribeUrl,
};
