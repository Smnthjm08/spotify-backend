import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    console.log("Connecting to database...");
    const mongoUrl = process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(mongoUrl);
    console.log(`Connected to MongoDb ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
