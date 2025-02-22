import { connect } from "mongoose";
import dot from "dotenv";
dot.config();

const URL: string = process.env.MONGO_DB_URL_LOCAL!;

export const dbConfig = async () => {
  try {
    await connect(URL).then(() => {
      console.log("connected: ❤️❤️🚀🚀");
    });
  } catch (error) {
    return error;
  }
};
