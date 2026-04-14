import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "e-commerce",
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;