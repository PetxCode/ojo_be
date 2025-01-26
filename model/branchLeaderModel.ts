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
