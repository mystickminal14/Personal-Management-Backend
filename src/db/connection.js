import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${DATABASE_NAME}`
    );
    console.log(`MongoDb server connected successfully!! DB:host : ${response.connection.host}`);
  } catch (error) {
    console.error("Internal Server Error", error);
    process.exit(1);
  }
};

export default connectDb;
