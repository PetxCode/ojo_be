import { connect } from "mongoose";

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
