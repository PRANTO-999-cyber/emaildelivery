// MUST BE AT THE TOP
import dotenv from "dotenv";
dotenv.config();

// ... other imports follow below
import express from "express";
import mongoose from "mongoose";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start Express server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
});
