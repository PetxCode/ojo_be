import { model, Schema, Types } from "mongoose";
import { memberData } from "../utils/interfaces";

const memberModel = new Schema<memberData>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },

    role: {
      type: String,
      default: "member",
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
    plateNumber: {
      type: String,
    },
    nin_Number: {
      type: String,
    },
    location: {
      type: String,
    },

    operation: {
      type: [],
    },

    payment: {
      type: [],
    },

    unitLeaderID: {
      type: String,
    },
    unitLeader: {
      type: Types.ObjectId,
      ref: "unitLeaders",
    },
  },
  {
    timestamps: true,
  }
);

export default model<memberData>("members", memberModel);
