import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

/**
 * Generate Access Token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    },
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    },
  );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Hash Password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

/**
 * Compare Password
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate Email Verification Token
 */
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Generate Password Reset Token
 */
export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Register User
 */
export const registerUser = async (payload) => {
  const existingUser = await User.findOne({
    email: payload.email.toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const password = await hashPassword(payload.password);

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
    password,
  });

  return user;
};

/**
 * Login User
 */
export const loginUser = async (email, password) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const matched = await comparePassword(password, user.password);

  if (!matched) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh Access Token
 */
export const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  return generateAccessToken(user);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashPassword,
  comparePassword,
  generateVerificationToken,
  generatePasswordResetToken,
  registerUser,
  loginUser,
  refreshAccessToken,
};
