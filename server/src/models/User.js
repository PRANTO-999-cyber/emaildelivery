import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Automatically creates a unique index on 'email'
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      index: true, // Automatically creates an index on 'status'
    },
  },
  { timestamps: true },
);

// DO NOT ADD: userSchema.index({ email: 1 }); or userSchema.index({ status: 1 });

export default mongoose.models.User || mongoose.model("User", userSchema);
