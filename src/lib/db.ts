import mongoose from "mongoose";
import { MONGO_URI } from "../utils/env";

export const connectDb = async () => {
  try {
    console.log("Connecting to database...");
    const mongoUrl = MONGO_URI;
    if (!mongoUrl) {
      throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(mongoUrl);
    console.log(`Connected to MongoDb ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
