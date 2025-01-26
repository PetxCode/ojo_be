import { model, Schema, Types } from "mongoose";
import { LGA_AdminUserData } from "../utils/interfaces";

const adminUserModel = new Schema<LGA_AdminUserData>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },

    role: {
      type: String,
      default: "LGA Admin",
    },
    verify: {
      type: Boolean,
      default: true,
    },
    canCreate: {
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
    location: {
      type: String,
    },
    avatar: {
      type: String,
    },
    adminID: {
      type: String,
    },
    avatarID: {
      type: String,
    },

    branchLeader: {
      type: [],
    },
    admin: {
      type: Types.ObjectId,
      ref: "admins",
    },
  },
  {
    timestamps: true,
  }
);

export default model<LGA_AdminUserData>("LGA_Admins", adminUserModel);
