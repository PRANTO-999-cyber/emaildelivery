import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ApiError(401, "User not found."));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token."));
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action."),
      );
    }

    next();
  };
};

export default {
  protect,
  restrictTo,
};
