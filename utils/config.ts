import { connect } from "mongoose";
import dot from "dotenv";
dot.config();

// const URL: string = process.env.MONGO_DB_URL_LOCAL!;
const URL: string = "mongodb://127.0.0.1:27017/transportDB";

export const dbConfig = async () => {
  try {
    await connect(URL).then(() => {
      console.log("connected: ❤️❤️🚀🚀");
    });
  } catch (error) {
    return error;
  }
};
