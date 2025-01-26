import { model, Schema } from "mongoose";
import { adminUserData } from "../utils/interfaces";

const adminModel = new Schema<adminUserData>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "admin",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
    },
    entryID: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },

    LGA_Admin: {
      type: [],
    },
  },
  {
    timestamps: true,
  }
);

export default model<adminUserData>("admins", adminModel);
