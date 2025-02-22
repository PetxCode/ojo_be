import { model, Schema, Types } from "mongoose";
import { LGA_AdminUserData } from "../utils/interfaces";

const adminUserModel = new Schema<LGA_AdminUserData>(
  {
    phone: {
      type: String,
    },
    bio: {
      type: String,
    },
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

    lga_branches: {
      type: Number,
    },

    lga_units: {
      type: Number,
    },
    best_performing: {
      type: [],
    },
    lga_members: {
      type: Number,
    },

    operation: [
      {
        type: [],
      },
    ],

    daily_operation: [
      {
        type: [],
      },
    ],

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
