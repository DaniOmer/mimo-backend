import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongodbUri);
    console.log(`MongoDB connected to the host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Something went wrong during connect: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
