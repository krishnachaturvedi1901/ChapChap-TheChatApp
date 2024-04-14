import mongoose from "mongoose";
import { config } from "../config/config.mjs";

const connectDb = async () => {
  try {
    await mongoose.connect(config.mongodb_url);
    console.log("Mongodb connected");
  } catch (error) {
    console.error("Error in connecting to mongodb", error);
    process.exit(1);
  }
};

export default connectDb;
