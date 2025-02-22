import { model, Schema, Types } from "mongoose";
import { branchLeaderData } from "../utils/interfaces";

const branchLeaderModel = new Schema<branchLeaderData>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },

    role: {
      type: String,
      default: "Branch Leader",
    },
    verify: {
      type: Boolean,
      default: false,
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
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },
    location: {
      type: String,
    },
    phone: {
      type: String,
    },
    bio: {
      type: String,
    },

    branch_units: {
      type: Number,
    },

    branch_members: {
      type: Number,
    },

    branch_operation: [
      {
        type: Types.ObjectId,
        ref: "branch_operations",
      },
    ],
    best_performing: {
      type: [],
    },
    operation: {
      type: [],
    },

    daily_operation: {
      type: [],
    },

    unitLeader: {
      type: [],
    },

    LGA_Admin: {
      type: Types.ObjectId,
      ref: "LGA_Admins",
    },

    LGA_AdminID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model<branchLeaderData>("branchLeaders", branchLeaderModel);
