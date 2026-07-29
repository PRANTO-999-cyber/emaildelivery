import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpires,
  });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpires,
  });
