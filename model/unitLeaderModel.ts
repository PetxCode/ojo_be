import { model, Schema, Types } from "mongoose";
import { unitLeaderData } from "../utils/interfaces";

const unitLeaderModel = new Schema<unitLeaderData>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },

    role: {
      type: String,
      default: "Unit Leader",
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
    branchLeaderID: {
      type: String,
    },

    location: {
      type: String,
    },

    member: {
      type: [],
    },
    branchLeader: {
      type: Types.ObjectId,
      ref: "branchLeaders",
    },
  },
  {
    timestamps: true,
  }
);

export default model<unitLeaderData>("unitLeaders", unitLeaderModel);
