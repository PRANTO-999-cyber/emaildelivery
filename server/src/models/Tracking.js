import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      index: true,
    },
    emailLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailLog",
      required: true,
      index: true,
    },
    smtp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SMTP",
      index: true,
    },
    event: {
      type: String,
      enum: ["delivered", "opened", "clicked", "bounced", "complaint"],
      required: true,
      index: true,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true, // Replaces manual index for trackingId
    },
    metadata: {
      ip: String,
      userAgent: String,
      location: String,
      linkUrl: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Tracking ||
  mongoose.model("Tracking", trackingSchema);
