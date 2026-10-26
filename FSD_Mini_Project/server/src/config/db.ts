
import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.log(
      "MongoDB URI not configured. Starting without database for now."
    );
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Atlas connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
