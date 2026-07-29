import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    to: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    messageId: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ["queued", "sent", "delivered", "failed", "bounced"],
      default: "queued",
      index: true,
    },
    errorMessage: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.EmailLog ||
  mongoose.model("EmailLog", emailLogSchema);
