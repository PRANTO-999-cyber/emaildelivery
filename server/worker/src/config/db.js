import mongoose from "mongoose";

export const connectWorkerDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Worker connected to MongoDB successfully.");
  } catch (error) {
    console.error(`Worker DB Error: ${error.message}`);
    process.exit(1);
  }
};
