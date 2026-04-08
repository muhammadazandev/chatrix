import mongoose from "mongoose";

async function connectMongodb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

export default connectMongodb;
