import mongoose from "mongoose";

const smtpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    host: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ["smtp", "sendgrid", "mailgun", "ses"],
      default: "smtp",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "failed"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.SMTP || mongoose.model("SMTP", smtpSchema);
